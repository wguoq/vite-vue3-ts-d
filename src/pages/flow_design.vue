<script lang="ts" setup>
import SingleTableF from 'components/SingleTableF.vue';
import EditForm from 'components/EditForm.vue';
import { ref,reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { axiosSend, loading } from 'utils/http.ts'
import FlowApi from 'api/flow.ts'
import axios from 'axios';
import { Field } from '../components/PropsClass';

class TableProps{
	api:any = ""
	action: string = ""
	serviceName: string = ""
	filters: {[key: string]: any;}|null ={}
	pageSize:number = 5
	fieldInfo: any = []
	colwidth: any = "auto"
}

class FormProps{
	formType: "query"|"local" = "query"
	action: string = ""
	api:any = ""
	serviceName: string = ""
	pk: any = ""
	fieldInfo: any[] = []
	formData: {[key: string]: any;} = {}
	disabledLabel: string[] = []
	hideLabel: string[] = []
	readOnly: boolean = false
	noSave: boolean =false
}

interface Data{
	flowTable:TableProps,
	flowNodeTable:TableProps,
	editForm:FormProps,
	showDialog:boolean,
	fieldInfo:Field[],
}

const data = reactive<Data>({
	flowTable: new TableProps(),
	flowNodeTable: new TableProps(),
	editForm: new FormProps(),
	showDialog:false,
	fieldInfo:[]

})

const DialogForm = ref()
const FlowTable = ref()
let FlowTableRow:any
const FlowNodeTable = ref()
let FlowNodeTableRow:any

function init(){

		data.flowTable.api = FlowApi
		data.flowTable.serviceName = "FlowDesignService"
		data.flowTable.action = "all"
		data.flowTable.pageSize = 5
		data.flowTable.filters = {}
		data.flowTable.fieldInfo = null
		data.flowTable.colwidth = 150
		
		data.flowNodeTable.api = FlowApi
		data.flowNodeTable.serviceName = "FlowNodeService"
		data.flowNodeTable.action = "filter"
		data.flowNodeTable.pageSize = 5
		data.flowNodeTable.filters = null
		data.flowNodeTable.fieldInfo = []
		data.flowNodeTable.colwidth = 150

		let config1 = new FlowApi.Query()
		config1.params.service = "FlowNodeService"
		config1.params.action = "getFieldInfo"
		let config2 = new FlowApi.Query()
		config2.params.service = "NodeDesignService"
		config2.params.action = "getFieldInfo"
		
		let load = loading()
		axios.all([axiosSend(config1),axiosSend(config2)]).then(axios.spread((res1,res2)=>{
			load.close()
			let aaa = res1.data.fields
			let bbb = res2.data.fields
			let ccc:any[] = []
			let arr = ["id","code","created_time","modified_time"]
			for (let a of aaa){
				if (arr.indexOf(a.name)>-1){
					continue
				}else{
					ccc.push(a)
				}
			}
			for (let b of bbb){
				if (arr.indexOf(b.name)>-1){
					continue
				}else{
					ccc.push(b)
				}
			}
			data.flowNodeTable.fieldInfo =  ccc
		}))

}

const rowClickFlowTable=(row:any)=>{
	FlowTableRow = row
	data.flowNodeTable.filters= {"flow_design_id":row.id}
}

const rowClickFlowNodeTable=(row:any)=>{
	FlowNodeTableRow = row
}

const openFwDesignAdd=()=>{
	data.editForm.formType = "query"
	data.editForm.api = FlowApi
	data.editForm.action = "add"
	data.editForm.serviceName = "FlowDesignService"
	data.editForm.hideLabel = ["id","code"]
	data.editForm.disabledLabel = ["created_time","modified_time"]
	data.showDialog = true
}

const openFwDesignEdit=(row:any)=>{
	data.editForm.formType = "query"
	data.editForm.api = FlowApi
	data.editForm.action = "edit"
	data.editForm.serviceName = "FlowDesignService"
	data.editForm.pk = row.id
	data.editForm.disabledLabel = ["id","code","created_time","modified_time"]
	data.showDialog = true
}

const afterSave=()=>{
	data.showDialog = false
	location.reload()
}

const instanceFlow=(row:any)=>{
	let config = new Configs.Commit()
	let param = new Params.Commit()
	param.service = "FlowService"
	param.action = "instance"
	param.data = {"id":row.id}
	config.data = param
	let load = loading()
	axiosSend(config).then((res:any)=>{
		load.close()
		if(res){
			ElMessage.success("ok")
		}
		
	})
}

const openFlowNodeAdd=()=>{
	if (FlowTableRow == null || FlowTableRow.id == null){
		ElMessage.warning("没有选中数据")
	}else{

		data.editForm.formType = "local"
		data.editForm.action = "add"
		data.editForm.serviceName = "FlowNodeService"
		data.editForm.hideLabel = []
		data.editForm.disabledLabel = ["flow_design","node_design"]
		data.editForm.fieldInfo = data.flowNodeTable.fieldInfo
		for(let field of data.editForm.fieldInfo){
			data.editForm.formData[field.name] = field.default
		}
		data.editForm.formData["flow_design"] = FlowTableRow.id

		data.showDialog = true
	}
}

init()
</script>

<template>
	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="openFwDesignAdd">新增</el-button>
	</el-row>

	<el-dialog v-model="data.showDialog" :close-on-click-modal="false">
		<EditForm
		ref="DialogForm" 
		:formType= data.editForm.formType
		:action = data.editForm.action
		:api = data.editForm.api
		:serviceName = data.editForm.serviceName
		:pk = data.editForm.pk
		:fieldInfo = data.editForm.fieldInfo
		:formData = data.editForm.formData
		:disabledLabel= data.editForm.disabledLabel
		:hideLabel= data.editForm.hideLabel
		:readOnly = data.editForm.readOnly
		:noSave = data.editForm.noSave
		@afterSave="afterSave"
		></EditForm>
	</el-dialog>

	<el-row style="text-align: left; margin: 5px;">
		<SingleTableF 
		ref="FlowTable"
		:api=data.flowTable.api
		:action=data.flowTable.action
		:serviceName=data.flowTable.serviceName
		:filters = data.flowTable.filters
		:pageSize=data.flowTable.pageSize
		:fieldInfo=data.flowTable.fieldInfo
		:colwidth=data.flowTable.colwidth
		@rowClick="rowClickFlowTable"
		>
			<template v-slot:SingleTableCol >
				<el-table-column fixed="right" label="操作栏" width="200" >
					<template #default="scope">
					<el-row>
						<el-col :span="11">
						<el-button
							type="primary"
							size="small"
							@click="instanceFlow(scope.row)"
							>
							实例化
						</el-button>
						</el-col>
						<el-col :span="11">
						<el-button
							type="primary"
							size="small"
							@click="openFwDesignEdit(scope.row)"
							>
							编辑
						</el-button>
						</el-col>
					</el-row>
					</template>
				</el-table-column>
			</template>
		</SingleTableF>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="openFlowNodeAdd">新增</el-button> 
	</el-row>
	
	<el-row style="text-align: left; margin: 5px;">
		<SingleTableF 
		ref="FlowNodeTable"
		:api=data.flowNodeTable.api
		:action=data.flowNodeTable.action
		:serviceName=data.flowNodeTable.serviceName
		:filters = data.flowNodeTable.filters
		:pageSize=data.flowNodeTable.pageSize
		:fieldInfo=data.flowNodeTable.fieldInfo
		:colwidth=data.flowNodeTable.colwidth
		@rowClick="rowClickFlowNodeTable"
		>
		</SingleTableF>
	</el-row>

</template>

<style scoped>

</style>


