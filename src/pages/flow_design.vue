<script lang="ts" setup>
import SingleTable from 'components/SingleTable.vue';
import EditForm from 'components/EditForm.vue';
import { ref,reactive,} from 'vue';
import { ElMessage, ElTable } from 'element-plus';
import { axiosSend, loading } from 'utils/http.ts'
import FlowApi from 'api/flow.ts'

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
const NodeTable = ref()
const OrderTable = ref()

const FlowTableCurrentChange=(currentRow:any,oldCurrentRow:any)=>{
	if (FlowTable.value?.current.row){
		data.orderTableP.filters = {"flow_design": FlowTable.value.current.row.id}
	}else{
		data.orderTableP.filters = null
	}
}

const NodeTableCurrentChange=(currentRow:any,oldCurrentRow:any)=>{
}

const OrderTableCurrentChange=(currentRow:any,oldCurrentRow:any)=>{	
}

function init(){

	data.flowTableP = new TableProps()
	data.flowTableP.api = FlowApi
	data.flowTableP.repo = "FlowDesign"
	data.flowTableP.filters = {}
	data.flowTableP.colwidth = 150

	data.nodeTableP = new TableProps()
	data.nodeTableP.api = FlowApi
	data.nodeTableP.repo = "NodeDesign"
	data.nodeTableP.filters = {}
	data.nodeTableP.colwidth = 150

	data.orderTableP = new TableProps()
	data.orderTableP.api = FlowApi
	data.orderTableP.repo = "FlowNodeOder"
	data.orderTableP.filters = null

}

const addFlow=()=>{
	data.editForm = new FormProps()
	data.editForm.action = "save"
	data.editForm.api = FlowApi
	data.editForm.repo = "FlowDesign"
	data.editForm.hideLabel = ["id","created_time","modified_time","code","ver_status"]
	data.editForm.disabledLabel = ["version"]
	data.showDialog = true
}

const instFlow=(row:any)=>{
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

const addNode=()=>{
	data.editForm = new FormProps()
	data.editForm.action = "save"
	data.editForm.api = FlowApi
	data.editForm.repo = "NodeDesign"
	data.editForm.hideLabel = ["id","created_time","modified_time","code","ver_status"]
	data.editForm.disabledLabel = ["version"]
	data.showDialog = true
}

const addOrder=()=>{	
	if (FlowTable.value?.current.row){
		data.editForm = new FormProps()
		data.editForm.action = "save"
		data.editForm.api = FlowApi
		data.editForm.repo = "FlowNodeOder"
		data.editForm.pk = null
		data.editForm.fieldInfo = null
		data.editForm.defData = {"flow_design":FlowTable.value.current.row.id}
		if(NodeTable.value?.current.row){
			data.editForm.defData["node_design"] = NodeTable.value?.current.row.id
		}
		data.editForm.hideLabel = ["id","code","created_time","modified_time"]
		data.editForm.disabledLabel = ["version","flow_design"]
		data.showDialog = true
	}else{
		ElMessage.warning("没有选中数据")

	}
}

function reload(name:string){
	if(name == 'FlowDesign'){
		data.flowTableP.filters = {}
	}
	else if(name == 'NodeDesign'){
		data.nodeTableP.filters = {}
	}
	else if(name == 'FlowNodeOder'){
		data.orderTableP.filters = {"flow_design": FlowTable.value.current.row.id}
	}
}

const afterSave=(name:string)=>{
	data.showDialog = false
	reload(name)
}

init()
let noEditFields = ["id","code","created_time","modified_time","version","ver_status","test_case","tc_data_id"]

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
		@afterSave = "afterSave(data.editForm.repo)"
		></EditForm>
	</el-dialog>

	<el-row justify="center" style="margin: 5px;">
		<span>FlowTable</span>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="addFlow">新增</el-button>
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
		@currentChange="FlowTableCurrentChange"
		>
			<template v-slot:SingleTableCol >
			<el-table-column fixed="right" label="功能" width="70" >
				<template #default="scope">
				<el-row>
					<el-button
						type="primary"
						size="small"
						@click="instFlow(scope.row)"
						>
						提交
					</el-button>
				</el-row>
				</template>
			</el-table-column>
			</template>
		</SingleTable>
	</el-row>

	<el-row justify="center" style="margin: 5px;">
		<span>NodeTable</span>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="addNode">新增</el-button>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<SingleTable
		ref="NodeTable"
		:api=data.nodeTableP.api
		:repo=data.nodeTableP.repo
		:filters = data.nodeTableP.filters
		:pageSize=data.nodeTableP.pageSize
		:fieldInfo=data.nodeTableP.fieldInfo
		:colwidth=data.nodeTableP.colwidth
		:noEditFields = noEditFields
		@currentChange="NodeTableCurrentChange"
		>
		</SingleTable>
	</el-row>

	<el-row justify="center" style="margin: 5px;">
		<span>OrderTable</span>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="addOrder">新增</el-button>
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
		@currentChange="OrderTableCurrentChange"
		>
		</SingleTable>
	</el-row>

</template>

<style scoped>

</style>

