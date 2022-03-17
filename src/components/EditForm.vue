<script lang="ts" setup>
//1.props.fieldInfo为null时就查询fieldInfo；
//2.props.formData为null并且pk！=null就查询数据
//3.根据模板和数据渲染表单
//4.默认提供save方法
import { reactive, watch } from 'vue'
import { axiosSend, loading } from 'utils/http.ts'

interface Field{
	name:string 
	verbose_name:string 
	type:string 
	primary_key:boolean 
	max_length: number 
	default: any 
	help_text:string 
}

interface Props{
	action: string,
	api:any,
	serviceName: string,
	pk?: any,
	fieldInfo?: Field[]|null,
	formData?: {[key: string]: any;}|null,
	disabledLabel?: any[],
	hideLabel?: any[],
	readOnly?: boolean,
	noSave?: boolean,
}

const props = withDefaults(defineProps<Props>(),{
	action: "",
	api: "",
	serviceName: "",
	pk: "",
	fieldInfo: null,
	formData: null,
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
	fieldInfo: [],
	formData:{},
})

const getFieldInfo=()=>{
	let config = new props.api.Query()
	config.params.service = props.serviceName
	config.params.action = "getFieldInfo"
	let load = loading()
	axiosSend(config).then((res:any)=>{
		// console.log(res.data)
		load.close()
		if(res){
			data.fieldInfo = res.data.fields
			for (let field of data.fieldInfo){
				data.formData[field.name] = field.default
			}
		}
	})
}

const getData=()=>{
	let config = new props.api.Query()
	config.params.service = props.serviceName
	config.params.action = "get"
	config.params.filters = {"pk":props.pk}
	let load = loading()
	axiosSend(config).then((res:any)=>{
		// console.log(res.data)
		load.close()
		if(res){
			data.formData = res.data.data
		}
	})
}

const doSvae=()=>{
	let config = new props.api.Commit()
	config.data.service = props.serviceName
	config.data.action = props.action
	config.data.data = data.formData
	let load = loading()
	axiosSend(config).then((res:any)=>{
		load.close()
	})
}

function init(){
	if (props.fieldInfo){
		data.fieldInfo = props.fieldInfo
	}else{
		getFieldInfo()
	}
	if (props.formData){
		data.formData = props.formData
	}else if(props.pk){
		getData()
	}
}

const emits = defineEmits<{
	(event: 'beforeSave', data: any):void,
	(event: 'afterSave', data: any):void,
}>()

const Save =()=>{
	emits('beforeSave',data.formData)
	doSvae()
	emits('afterSave',data.formData)
}

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
					<el-form-item :label="field.verbose_name" >
						<el-input
						v-model = data.formData[field.name]
						:type = "getInputType(field.type)"
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