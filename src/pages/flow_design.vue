<script lang="ts" setup>
import SingleTable from 'components/SingleTable.vue';
import EditForm from 'components/EditForm.vue';
import { ref,reactive,watch } from 'vue';
import { ElMessage } from 'element-plus';
import { axiosSend, loading } from 'utils/http.ts'
import FlowApi from 'api/flow.ts'
// import {SingleTableProps} from 'components/PropsClass.ts'

class TableProps{
	api:any = null
	repo: string = ""
	filters: {[key: string]: any;}|null = null
	pageSize:number = 5
	fieldInfo: any = null
	colwidth: any = "auto"
}

class FormProps{
	api:any = ""
	repo: string = ""
	action: string = "save"
	pk: any = null
	fieldInfo: any[]|null = null
	defData: {[key: string]: any;}|null = null
	disabledLabel: string[] = []
	hideLabel: string[] = []
	readOnly: boolean = false
	noSave: boolean = false
}

const data = reactive({
	flowTableP: new TableProps(),
	nodeTableP: new TableProps(),
	orderTableP: new TableProps(),
	editForm: new FormProps(),
	showDialog:false,
})

const FlowTable = ref()
const OrderTable = ref()
const NodeTable = ref()


let FlowTableRow = ref(null)
let OrderTableRow = ref(null)
let NodeTableRow = ref(null)


function init(){

	data.flowTableP = new TableProps()
	data.flowTableP.api = FlowApi
	data.flowTableP.repo = "FlowDesign"
	data.flowTableP.filters = {}
	data.flowTableP.colwidth = 150

	data.orderTableP = new TableProps()
	data.orderTableP.api = FlowApi
	data.orderTableP.repo = "FlowNodeOder"
	data.orderTableP.filters = null


	data.nodeTableP = new TableProps()
	data.nodeTableP.api = FlowApi
	data.nodeTableP.repo = "NodeDesign"
	data.nodeTableP.filters = {}
	data.nodeTableP.colwidth = 150



}

const updata=()=>{
	//当数据发生改变后，重新获取每个列表的当前选中行
	if (typeof(FlowTable.value) != "undefined" && FlowTable.value.current.row){
		FlowTableRow.value = FlowTable.value.current.row
	}else{
		FlowTableRow.value = null
	}

	if (typeof(OrderTable.value) != "undefined" && OrderTable.value.current.row){
		OrderTableRow.value = OrderTable.value.current.row
	}else{
		OrderTableRow.value = null
	}

	if (typeof(NodeTable.value) != "undefined" && NodeTable.value.current.row){
		NodeTableRow.value = NodeTable.value.current.row
	}else{
		NodeTableRow.value = null
	}
}
//监听每个列表选中行的变化来更新关联数据
watch([FlowTableRow,OrderTableRow,NodeTableRow],(new_,old_) => {
	if(new_[0] != old_[0]){
		if (typeof(FlowTable.value) != "undefined" && FlowTable.value.current.row){
			data.orderTableP.filters = {"flow_design_id": FlowTable.value.current.row.id}
		}else{
			data.orderTableP.filters = null
		}
	}
	
	if(new_[1] != old_[1]){
		if (typeof(OrderTable.value) != "undefined" && OrderTable.value.current.row){
			data.nodeTableP.filters = {"pk": OrderTable.value.current.row.node_design}
		}else{
			data.nodeTableP.filters = null
		}
	}
})

const addFlowD=()=>{
	data.editForm = new FormProps()
	data.editForm.action = "save"
	data.editForm.api = FlowApi
	data.editForm.repo = "FlowDesign"
	data.editForm.hideLabel = ["id","created_time","modified_time","code"]
	data.editForm.disabledLabel = ["version"]

	data.showDialog = true
}

const instFlowD=(row:any)=>{
	let config = new FlowApi.Commit()
	config.data.action = "instance"
	config.data.data = {"pk":row.id}
	let load = loading()
	axiosSend(config).then((res:any)=>{
		load.close()
		console.log(res);
		if(res){
			ElMessage.success(JSON.stringify(res.data))
		}
		
	})
}

const addFlowNodeOder=()=>{
	if (FlowTable.value.current.row == null || FlowTable.value.current.row.id == null){
		ElMessage.warning("没有选中数据")
	}else{
		data.editForm = new FormProps()
		data.editForm.action = "save"
		data.editForm.api = FlowApi
		data.editForm.repo = "FlowNodeOder"
		data.editForm.defData = {"flow_design": FlowTable.value.current.row.id}
		data.editForm.hideLabel = ["id","code","created_time","modified_time",]
		data.editForm.disabledLabel = ["version","tc_action_id","flow_design"]
		data.showDialog = true
	}
}



const addNodeD=()=>{	
	// if (OrderTable.value.current.row == null || OrderTable.value.current.row.id == null){
	// 	ElMessage.warning("没有选中数据")
	// }else{
		data.editForm = new FormProps()
		data.editForm.action = "save"
		data.editForm.api = FlowApi
		data.editForm.repo = "NodeDesign"
		data.editForm.pk = null
		data.editForm.fieldInfo = null
		data.editForm.hideLabel = ["id","code","created_time","modified_time"]
		data.editForm.disabledLabel = ["version","test_case"]
		data.showDialog = true
	
}

const addTcCheck=()=>{
	if (OrderTable.value.current.row == null || OrderTable.value.current.row.id == null){
		ElMessage.warning("没有选中数据")
	}else{
		data.editForm = new FormProps()
		data.editForm.action = "save"
		data.editForm.api = TesterApi
		data.editForm.repo = "TcCheckPoint"
		data.editForm.pk = null
		data.editForm.fieldInfo = null
		data.editForm.defData = {"tc_data_id":OrderTable.value.current.row.id}
		data.editForm.hideLabel = ["id","code","created_time","modified_time"]
		data.editForm.disabledLabel = ["version","tc_data_id"]
		data.showDialog = true
	}
}

function reload(repo:string){
	if(repo == 'FlowDesign'){
		data.flowTableP.filters = {}
	}
	else if(repo == 'FlowNodeOder'){
		data.orderTableP.filters = {"flow_design_id": FlowTable.value.current.row.id}
	}
	else if(repo == 'NodeDesign'){
		data.nodeTableP.filters = {"pk": OrderTable.value.current.row.node_design}
	}

}

const afterSave=(f:any)=>{
	data.showDialog = false
	reload(f.repo)
}

init()
let noEditFields = ["id","code","created_time","modified_time","version","ver_status","flow_design"]
</script>

<template>
	<el-dialog 
	v-model="data.showDialog" 
	:close-on-click-modal="false"
	destroy-on-close
    center
	>
		<EditForm
		ref="DialogForm" 
		:action = data.editForm.action
		:api = data.editForm.api
		:repo = data.editForm.repo
		:pk = data.editForm.pk
		:fieldInfo = data.editForm.fieldInfo
		:defData = data.editForm.defData
		:disabledLabel= data.editForm.disabledLabel
		:hideLabel= data.editForm.hideLabel
		:readOnly = data.editForm.readOnly
		:noSave = data.editForm.noSave
		@afterSave = "afterSave"
		></EditForm>
	</el-dialog>

	<el-row justify="center" style="margin: 5px;">
		<span>FlowTable</span>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="addFlowD">新增</el-button>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<SingleTable
		ref="FlowTable"
		:api=data.flowTableP.api
		:repo=data.flowTableP.repo
		:filters = data.flowTableP.filters
		:pageSize=data.flowTableP.pageSize
		:fieldInfo=data.flowTableP.fieldInfo
		:colwidth=data.flowTableP.colwidth
		:noEditFields = noEditFields
		@rowClick="updata"
		@afterInit="updata"
		>
		</SingleTable>
	</el-row>

	<el-row justify="center" style="margin: 5px;">
		<span>OrderTable</span>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="addFlowNodeOder">新增</el-button>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<SingleTable
		ref="OrderTable"
		:api=data.orderTableP.api
		:repo=data.orderTableP.repo
		:filters = data.orderTableP.filters
		:pageSize=data.orderTableP.pageSize
		:fieldInfo=data.orderTableP.fieldInfo
		:noEditFields = noEditFields
		:colwidth=data.orderTableP.colwidth
		@rowClick="updata"
		@afterInit="updata"
		>
		</SingleTable>
	</el-row>

	<el-row justify="center" style="margin: 5px;">
		<span>NodeTable</span>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="addNodeD">新增</el-button>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<SingleTable
		ref="NodeTable"
		:api=data.nodeTableP.api
		:repo=data.nodeTableP.repo
		:filters = data.nodeTableP.filters
		:pageSize=data.nodeTableP.pageSize
		:fieldInfo=data.nodeTableP.fieldInfo
		:noEditFields = noEditFields
		:colwidth=data.nodeTableP.colwidth
		@rowClick="updata"
		@afterInit="updata"
		>
		</SingleTable>
	</el-row>

</template>

<style scoped>

</style>

