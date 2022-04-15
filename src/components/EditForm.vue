<script lang="ts" setup>
//1.props.fieldInfo为null时就查询fieldInfo；
//2.props.pk=null时就不查询，用fieldInfo组装出data.formData
//3.在2.的情况下props.defData!=null时就把里面的数据赋值给data.formData
//4.props.pk!=null时，用pk去查询数据赋值给data.formData，并忽略props.defData
//5.默认提供save方法
import { reactive, watch } from 'vue'
import { axiosSend, loading } from 'utils/http.ts'
import axios from 'axios';
import { ElMessage } from 'element-plus';

class Field{
	name:string = ""
	verbose_name:string = ""
	type:string = ""
	primary_key:boolean = false 
	max_length: number = 0
	default: any = ""
	help_text:string = ""
}

interface Props{
	action: string,
	api:any,
	repo: string,
	pk?: any|null,
	fieldInfo?: Field[]|null,
	defData?: {[key: string]: any;}|null,
	disabledLabel?: any[],
	hideLabel?: any[],
	readOnly?: boolean,
	noSave?: boolean,
	condition?:any,
}

const props = withDefaults(defineProps<Props>(),{
	action: "",
	api: "",
	repo: "",
	pk: "",
	fieldInfo: null,
	formData: null,
	defData:null,
	disabledLabel: ()=>[],
	hideLabel: ()=>[],
	readOnly: false,
	noSave: false,
	condition:{},
})

interface Data {
	fieldInfo:Field[] 
	formData:{[key: string]: any;}

}

const data = reactive<Data>({
	fieldInfo: [new Field()],
	formData:{},

})

const doSvae=()=>{
	//把JSON格式化的数据转回string
	try {
		parseJson()
	} catch (error) {
		ElMessage.error('json格式错误')
		return false
	}
	delete data.formData.created_time
	delete data.formData.modified_time
	emits('beforeSave',data.formData)
	let config = new props.api.Commit()
	config.data.repo = props.repo
	config.data.action = props.action
	config.data.data = data.formData
	config.data.condition = props.condition
	let load = loading()
	axiosSend(config).then((res:any)=>{
		load.close()
		emits('afterSave')
	})
}

const setDefData=()=>{
	if(props.defData){
		let keys = Object.keys(data.formData)
		for (let k of keys){
			if (props.defData[k]){
				data.formData[k] = props.defData[k]
			}else{
				continue
			}
		}
	}
}

const stringifyJson=()=>{
	for(let field of data.fieldInfo){
		if(field.type == "JSONField"){
			if(data.formData[field.name]){
				data.formData[field.name] = JSON.stringify(data.formData[field.name],null,4)
			}else{}
		}else{
			continue
		}
	}
}

const parseJson=()=>{
	for(let field of data.fieldInfo){
		if(field.type == "JSONField"){
			if (data.formData[field.name]){
				data.formData[field.name] = JSON.parse(data.formData[field.name])
			}else{}
		}else{
			continue
		}
	}
}

function init(){
	//由于axios是异步的，需要分情况处理
	let config1 = new props.api.Query()
	config1.params.repo = props.repo
	config1.params.action = "getFieldInfo"

	let config2 = new props.api.Query()
	config2.params.repo = props.repo
	config2.params.action = "get"
	config2.params.filters = {"pk":props.pk}

	// 如果没有传入pk，那就是add，会处理默认值
	if(!props.pk){
		if(!props.fieldInfo){
			axiosSend(config1).then((res:any)=>{
				data.fieldInfo = res.data.fields
				if (data.fieldInfo){
					for (let f of data.fieldInfo){
						data.formData[f.name] = f.default
					}
				}
				setDefData()
			})
		}else{
			data.fieldInfo = props.fieldInfo
			setDefData()
		}
		
	// 如果传入了pk，那就是edit，不要默认值
	}else{
		if(!props.fieldInfo){
			axios.all([axiosSend(config1),axiosSend(config2)]).then(axios.spread((res1,res2)=>{
				data.fieldInfo = res1.data.fields
				data.formData = res2.data.data
				//处理一下json数据
				stringifyJson()
			}))
		}else{
			axiosSend(config2).then((res:any)=>{
				data.formData = res.data.data
				data.fieldInfo = props.fieldInfo
				stringifyJson()
			})
		}
	}
}

const emits = defineEmits<{
	(event: 'beforeSave', formData: any):void,
	(event: 'afterSave'):void,
}>()

defineExpose({
	data
})

const isInList =(data: any,list: any[])=>{
	for(let a of list){
		if (a == data){
			return true
		}else{
			continue
		}
	}
	return false
}

const getInputType=(t: string)=>{
	if (t == "IntegerField"){
		return "number"
	}else if (t == "DateTimeField"){
		return "text"
		// return "datetime"
	}else if (t == "JSONField"){
		return "textarea"
	}
}

init()
watch(props,()=>init())

</script>

<template>
		<el-form 
		label-position="top"
		label-width="80px" 
		 >
			<el-row>
			<template v-for=" field of data.fieldInfo " >
				<el-col :span="11" style="margin-left: 5px;" v-show="!isInList(field.name,props.hideLabel)">
					<el-form-item :label="field.verbose_name + ' : '+field.name" >
						<!-- <pre>{{data.formData[field.name]}}</pre> -->
						<el-input
						v-model = data.formData[field.name]
						:type = "getInputType(field.type)"
						:row = 3
						:placeholder="field.help_text"	
						:disabled="isInList(field.name,props.disabledLabel) || props.readOnly"					
						autosize
						>
						</el-input>
					</el-form-item>
				</el-col>	
			</template>
			</el-row>
			<el-row justify="center" v-if="!props.noSave">
				<el-button type="primary" @click="doSvae">Save</el-button>
			</el-row>
			<slot name="formSlot"></slot>
		</el-form>
</template>


<style>
.el-form--label-top .el-form-item__label {
    display: block;
    text-align: left;
    padding: 0 0 1px 0;
	margin-left: 5px;
}
</style>