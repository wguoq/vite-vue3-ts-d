<script lang="ts" setup>
//1.formType："query"|"local" 决定查询数据还是使用传入的值
//2.action：add模式需要知道service，然后去获取model模板
//3.action：edit模式需要知道service和pk，然后去获取model模板和get数据
//4.根据模板和数据渲染表单
//5.默认提供save方法
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
	formType: "query"|"local",
	action: string,
	api:any,
	serviceName: string,
	pk?: any,
	fieldInfo?: Field[],
	formData?: {[key: string]: any;},
	disabledLabel?: any[],
	hideLabel?: any[],
	readOnly?: boolean,
	noSave?: boolean,
}

const props = withDefaults(defineProps<Props>(),{
	formType:"query",
	action: "",
	api: "",
	serviceName: "",
	pk: "",
	fieldInfo: ()=>[],
	formData: ()=>{return {}},
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
		console.log(res.data)
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
		console.log(res.data)
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
	if (props.formType === "local"){
		data.fieldInfo = props.fieldInfo
		data.formData = props.formData
	}else if(props.formType === "query"){
		getFieldInfo()
		if (props.action === "edit" && props.pk){
			getData()
		}
	}else{
		return false
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


