<script lang="ts" setup>
//包含query和save行为，需要传入所需的参数
//根据传入pk来判断需不需要query数据，以此区分add和edit场景
import { reactive, ref, watch } from 'vue'
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
	required:boolean = false
	help_text:string = ""
}


interface Props{
	api?:any|null,
	repo?: string|null,
	pk?: any|null,
	replaced?:0|1,
	isgroup?: 0|1,
	condition?:any[]|null,
	fieldInfo?: Field[]|null,
	defData?: {[key: string]: any;}|null,
	disabledLabel?: any[],
	hideLabel?: any[],
	readOnly?: boolean,
	noSave?: boolean,
}

const props = withDefaults(defineProps<Props>(),{
	api:null,
	repo:null,
	pk:null,
	replaced:0,
	isgroup:0,
	condition:null,
	fieldInfo: null,
	formData: null,
	defData:null,
	disabledLabel: ()=>[],
	hideLabel: ()=>[],
	readOnly: false,
	noSave: false,
})

interface Data {
	fieldInfo:Field[] 
	formData:{[key: string]: any;}
}

const data = reactive<Data>({
	fieldInfo: [new Field()],
	formData:{},
})

function init(){
	//由于axios是异步的，需要分情况处理
	let config1 = new props.api.FieldInfo()
	config1.params.repo = props.repo
	config1.params.replaced = props.replaced

	let config2 = new props.api.Query()
	config2.data.repo = props.repo
	config2.data.filters = {"pk":props.pk}

	// 如果没有传入pk，那就是add，会处理默认值
	if(props.pk == null){
		if(props.fieldInfo == null){
			let load = loading()
			axiosSend(config1).then((res:any)=>{
				load.close()
				data.fieldInfo = res.data.fields
				if (data.fieldInfo){
					for (let f of data.fieldInfo){
						data.formData[f.name] = f.default
					}
				}
				setDefData()
				stringifyJson()
			})
		}else{
			data.fieldInfo = props.fieldInfo
			if (data.fieldInfo){
				for (let f of data.fieldInfo){
					data.formData[f.name] = f.default
				}
			}
			setDefData()
			stringifyJson()
		}
		
	// 如果传入了pk，那就是edit，不要默认值
	}else{
			let load = loading()
			axiosSend(config2).then((res:any)=>{
				if(res.data?.total > 1){
					ElMessage.error('查询结果大于1,不能编辑')
					data.formData = {}
				}else{
					data.formData = res.data.rows[0]
				}
				// 然后判断有没有传入fieldInfo
				if (props.fieldInfo == null){
					axiosSend(config1).then((res:any)=>{
						data.fieldInfo = res.data.fields
					})
				}else{
					data.fieldInfo = props.fieldInfo
				}
				stringifyJson()
				load.close()
			})
		// if(props.fieldInfo == null){
		// 	axios.all([axiosSend(config1),axiosSend(config2)]).then(axios.spread((res1,res2)=>{			
		// 		data.fieldInfo = res1.data.fields
		// 		console.log(res2.data);
		// 		data.formData = res2.data.rows[0]
		// 		//处理一下json数据
		// 		stringifyJson()
		// 	}))
		// }else{
		// 	axiosSend(config2).then((res:any)=>{
		// 		console.log(res.data);
		// 		data.formData = res.data.rows[0]
		// 		data.fieldInfo = props.fieldInfo
		// 		stringifyJson()
		// 	})
		// }
	}
}
const Save=()=>{
	//判断必填项有没有填 todo

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
	let config = new props.api.Save()
	config.data.repo = props.repo
	config.data.action = "save"
	config.data.is_group = props.isgroup
	config.data.data = data.formData
	config.data.condition = props.condition
	let load = loading()
	axiosSend(config).then((res:any)=>{
		load.close()
		emits('afterSave')
		ElMessage.success("ok")
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
	}else if (t == "JSONField" || t == "TextField"){
		return "textarea"
	}
}

const getSpan=(field: Field)=>{
	if (field.type == "JSONField" || field.type == "TextField" || field.max_length > 200){
		return 24
	}else{
		return 12
	}

}
init()
watch(props,()=>init())

</script>

<template>
		<el-form 
		ref = "formRef"
		label-position="top"
		label-width="80px" 
		 >
			<el-row :gutter="10" justfiy="center">
			<template v-for=" field of data.fieldInfo " >
				<el-col :span="getSpan(field)" v-show="!isInList(field.name,props.hideLabel)" :xs="24">
					<el-form-item 
					:label="field.verbose_name + ' : '+field.name" 
					:required = "field.required"
					>
						<el-input
						v-model = data.formData[field.name]
						:type = "getInputType(field.type)"
						:placeholder="field.help_text"	
						:disabled="isInList(field.name,props.disabledLabel) || props.readOnly"				
						:autosize = "{minRows: 2,}"
						>
						</el-input>
					</el-form-item>
				</el-col> 
			</template>
			</el-row>
			<el-row justify="center" v-if="!props.noSave">
				<el-button type="primary" @click="Save">Save</el-button>
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