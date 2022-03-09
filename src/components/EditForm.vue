<script lang="ts" setup>
//1.formType："query"|"local" 决定查询数据还是使用传入的值
//2.action：add模式需要知道service，然后去获取model模板
//3.action：edit模式需要知道service和pk，然后去获取model模板和get数据
//4.根据模板和数据渲染表单
//5.默认提供save方法
import { reactive, ref, watch } from 'vue'
import { axiosSend, loading } from 'utils/http.ts'
import Params from 'api/params.ts'

interface Props{
	formType: "query"|"local",
	action: string|null,
	api:any|null,
	serviceName: string|null,
	pk?: any|null,
	fieldInfo?: any[],
	formData?: any,
	disabledLabel?: any[],
	hideLabel?: any[],
	readOnly?: boolean,
	noSave?: boolean,
}

const props = withDefaults(defineProps<Props>(),{
	formType:"query",
	action: null,
	api: null,
	serviceName: null,
	pk: null,
	fieldInfo: ()=>[],
	formData: ()=>{},
	disabledLabel: ()=>[],
	hideLabel: ()=>[],
	readOnly: false,
	noSave: false,
})


const data = reactive({
	fieldInfo: [""],
	formData: {},
})

const getFieldInfo=()=>{
	let config = new props.api.Query()
	let param = new Params.Query()
	param.service = props.serviceName
	param.action = "getFieldInfo"
	config.params = param
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
	let param = new Params.Query()
	param.service = props.serviceName
	param.action = "get"
	param.filters = {"pk":props.pk}
	config.params = param
	let load = loading()
	axiosSend(config).then((res:any)=>{
		console.log(res.data)
		load.close()
		if(res){
			data.formData = res.data.rows
		}
	})
}

const doSvae=()=>{
	let config = new props.api.Commit()
	let param = new Params.Commit()
	param.service = props.serviceName
	param.action = props.action
	param.data = data.formData
	config.data = param
	let load = loading()
	axiosSend(config).then((res:any)=>{
		console.log(res.data)
		load.close()
	})
}

function init(){
	data.fieldInfo = []
	data.formData = {}
	if (props.formType === "local"){
		data.fieldInfo = props.fieldInfo
		data.formData = props.formData
	}else if(props.formType === "query"){
		getFieldInfo()
		if (props.action === 'edit' && props.pk){
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


const getInputType=(type: string)=>{
	if (type == "IntegerField"){
		return "number"
	}else if (type == "DateTimeField"){
		return "text"
		// return "datetime"
	}
}

init()
watch(props,()=>init())

</script>

<template>
		<el-form 
		label-width="80px" 
		label-position="right" >
			<el-row>
			<template v-for=" field of data.fieldInfo " >
				<el-col :span="11" style="margin: 2px;" v-show="!isInList(field.name,props.hideLabel)">
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
			<el-row>
				<el-col :span="24" style="margin: 5px;" v-if="!props.noSave">
					  <el-button type="primary" @click="Save">Save</el-button>
				</el-col>
			</el-row>
			<slot></slot>
		</el-form>
</template>


