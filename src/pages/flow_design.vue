<script lang="ts" setup>
import SingleTable from 'components/SingleTable.vue';
import EditForm from 'components/EditForm.vue';
import { ref,reactive,} from 'vue';
import { barProps, ElMessage, ElTable } from 'element-plus';
import { axiosSend, loading } from 'utils/http.ts';
import FlowApi from 'api/flow.ts';
import axios from 'axios';

class TableProps{
	api:any = null
	repo: string | null = ""
	filters: {[key: string]: any;}|null = null
	pageSize:number = 5
	fieldInfo: any = null
	tableData: any = []
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
	addTableP: new TableProps(),
	groupTableP:new TableProps(),
	editForm: new FormProps(),
	showDialog:false,
	showListDialog:false,
	importbutton:false,
	tmpData:{},
	condition:{}
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
	console.log(OrderTable.value.current.row);
	
	getGroupTableInfo().then(axios.spread(function (res1,res2,res3) {
		let a = res1.data.fields
		let b = res2.data.fields
		let c = res3.data.fields
		if (OrderTable.value?.current.row){
			let config1 = new FlowApi.Query()
			config1.params.repo = 'FlowDesign'
			config1.params.action = "table_get"
			config1.params.filters = {"pk":OrderTable.value?.current.row.flow_design}

			let config2 = new FlowApi.Query()
			config2.params.repo = 'NodeDesign'
			config2.params.action = "table_get"
			config2.params.filters = {"pk":OrderTable.value?.current.row.node_design}

			let config3 = new FlowApi.Query()
			config3.params.repo = 'FlowNodeOder'
			config3.params.action = "table_get"
			config3.params.filters = {"pk":OrderTable.value?.current.row.id}

			axios.all([axiosSend(config1),axiosSend(config2),axiosSend(config3)]).then(axios.spread(function (res1,res2,res3){
				let d = res1.data.data
				let e = res2.data.data
				let f = res3.data.data
				data.groupTableP = new TableProps()
				data.groupTableP.api = FlowApi
				data.groupTableP.filters = null
				data.groupTableP.colwidth = 150
				data.groupTableP.fieldInfo = [...a,...b,...c]
				data.groupTableP.tableData = [{...d,...e,...f}]

			}))
		}else{
				data.groupTableP = new TableProps()
				data.groupTableP.api = FlowApi
				data.groupTableP.filters = null
				data.groupTableP.colwidth = 150
				data.groupTableP.fieldInfo = [...a,...b,...c]
				data.groupTableP.tableData = []
		}

	}))


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

	data.groupTableP = new TableProps()
	data.groupTableP.api = null
	data.groupTableP.repo = null
	data.groupTableP.filters = null
	data.groupTableP.colwidth = 150

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

const getGroupTableInfo=()=>{
	let config1 = new FlowApi.Query()
	config1.params.repo = 'FlowNodeOder'
	config1.params.action = "getTableInfo"

	let config2 = new FlowApi.Query()
	config2.params.repo = 'FlowDesign'
	config2.params.action = "getTableInfo"

	let config3 = new FlowApi.Query()
	config3.params.repo = 'NodeDesign'
	config3.params.action = "getTableInfo"
	return axios.all([axiosSend(config1),axiosSend(config2),axiosSend(config3)])
}

const addOrderG=()=>{
	getGroupTableInfo().then(axios.spread(function (res1,res2,res3) {
		let a = res1.data.fields
		let b = res2.data.fields
		let c = res3.data.fields
		data.condition = ["FlowNodeOder__flow_design=FlowDesign__id","FlowNodeOder__node_design=NodeDesign__id"]
		data.editForm = new FormProps()
		data.editForm.action = "save_group"
		data.editForm.api = FlowApi
		data.editForm.repo = 'FlowNodeOder'
		data.editForm.pk = null
		data.editForm.fieldInfo = [...a,...b,...c]
		if(FlowTable.value?.current.row){
			let config = new FlowApi.Query()
			config.params.repo = 'FlowDesign'
			config.params.action = "table_get"
			config.params.filters = {"pk":FlowTable.value?.current.row.id}
			axiosSend(config).then((res:any)=>{
				let a = res.data.data
				let x = {"FlowNodeOder__flow_design":a.FlowDesign__id}
				if(NodeTable.value?.current.row){
					let config = new FlowApi.Query()
					config.params.repo = 'NodeDesign'
					config.params.action = "table_get"
					config.params.filters = {"pk":NodeTable.value?.current.row.id}
					axiosSend(config).then((res:any)=>{
						let b = res.data.data
						let y = {"FlowNodeOder__node_design":b.NodeDesign__id}
						data.editForm.defData = {...x,...y,...a,...b}
					})
				}else{
					data.editForm.defData = {...x,...a}	
				}
			})

		}
		data.editForm.disabledLabel = ["FlowNodeOder__id","FlowDesign__id","NodeDesign__id"]
		data.showDialog = true

	}))

}

const fImportRule=(repo:string)=>{
	if(FlowTable.value?.current.row){
		data.tmpData = FlowTable.value.current.row
		data.addTableP = new TableProps()
		data.addTableP.api = FlowApi
		data.addTableP.repo = repo
		data.addTableP.filters = {}
		data.showListDialog = true
		data.importbutton = true
	}else{
		ElMessage.warning("没有选中数据")
	}
}


const doImport=(row:any,repo:string)=>{
	let config = new FlowApi.Commit()
	config.data.repo = "FlowDesign"
	config.data.action = "save"
	if(repo === "FlowResultRule"){
		data.tmpData["fw_result_rule"] = row.id
	}else if(repo === "FlowStatusRule"){
		data.tmpData["fw_status_rule"] = row.id
	}
	config.data.data = data.tmpData
	let load = loading()
	axiosSend(config).then((res:any)=>{
		load.close()
		if(res){
			ElMessage.success(JSON.stringify(res.data))
			data.showListDialog = false
			reload()
		}
		
	})
}


const nStatusRule=(row:any)=>{
	data.addTableP = new TableProps()
	data.addTableP.api = FlowApi
	data.addTableP.repo = "NodeStatusRule"
	data.addTableP.filters = {"node_design": row.id}
	data.editForm = new FormProps()
	data.editForm.defData = {"node_design": row.id}
	data.showListDialog = true
}

const nStartRule=(row:any)=>{
	data.addTableP = new TableProps()
	data.addTableP.api = FlowApi
	data.addTableP.repo = "NodeStartRule"
	data.addTableP.filters = {"node_design": row.id}
	data.editForm = new FormProps()
	data.editForm.defData = {"node_design": row.id}
	data.showListDialog = true
}

const AddTableAdd=()=>{
	data.editForm.action = "save"
	data.editForm.api = FlowApi
	data.editForm.repo = data.addTableP.repo
	data.editForm.hideLabel = ["id","created_time","modified_time","code","ver_status"]
	data.editForm.disabledLabel = ["version","node_design"]
	data.showDialog = true
}

function reload(){
	let name = data.editForm.repo
	switch (name){
		case 'FlowDesign': 
			data.flowTableP.filters = {}
			break
		case 'NodeDesign':
			data.nodeTableP.filters = {}
			break
		case 'FlowNodeOder':
			data.orderTableP.filters = {"flow_design": FlowTable.value?.current.row.id}
			break
		case 'NodeStatusRule':
			data.addTableP.filters = {"node_design": NodeTable.value.current.row.id}
			break
		case 'NodeStartRule':
			data.addTableP.filters = {"node_design": NodeTable.value.current.row.id}
			break
		case 'FlowResultRule':
			data.addTableP.filters = {}
			break
		case 'FlowStatusRule':
			data.addTableP.filters = {}
			break
	}

}

const afterSave=()=>{
	data.showDialog = false
	reload()
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
		:condition=data.condition
		@afterSave = "afterSave"
		></EditForm>
	</el-dialog>

	<el-dialog 
	v-model="data.showListDialog" 
	:close-on-click-modal="false"
	width="90%"
	destroy-on-close
    center
	@close = "data.importbutton = false"
	>
	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="AddTableAdd">新增</el-button>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<SingleTable
		ref="AddTable"
		:api=data.addTableP.api
		:repo=data.addTableP.repo
		:filters = data.addTableP.filters
		:pageSize=data.addTableP.pageSize
		:fieldInfo=data.addTableP.fieldInfo
		:colwidth=data.addTableP.colwidth
		:noEditFields = noEditFields
		>
			<template v-if="data.importbutton" v-slot:SingleTableCol >
			<el-table-column fixed="right" label="功能" width="70" >
				<template #default="scope">
				<el-row>
					<el-button
						type="primary"
						size="small"
						@click="doImport(scope.row,data.addTableP.repo)"
						>
						导入
					</el-button>
				</el-row>
				</template>
			</el-table-column>
			</template>
		</SingleTable>
	</el-row>
	</el-dialog>

	<el-row justify="center" style="margin: 5px;">
		<span>FlowTable</span>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="addFlow">新增</el-button>
		<el-button type="primary" plain @click="fImportRule('FlowResultRule')">结果规则</el-button>
		<el-button type="primary" plain @click="fImportRule('FlowStatusRule')">状态规则</el-button>
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
			<template v-slot:SingleTableCol >
			<el-table-column fixed="right" label="功能" width="200" >
				<template #default="scope">
				<el-row>
					<el-button
						type="primary"
						size="small"
						@click="nStartRule(scope.row)"
						>
						启动规则
					</el-button>
					<el-button
						type="primary"
						size="small"
						@click="nStatusRule(scope.row)"
						>
						状态规则
					</el-button>
				</el-row>
				</template>
			</el-table-column>
			</template>
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

	<el-row justify="center" style="margin: 5px;">
		<span>	<el-row justify="center" style="margin: 5px;">
		<span>三表组合</span>
	</el-row></span>
	</el-row>
	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="addOrderG">组合新增</el-button>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<SingleTable
		ref="GroupTable"
		:api=data.groupTableP.api
		:repo=data.groupTableP.repo
		:filters = data.groupTableP.filters
		:pageSize=data.groupTableP.pageSize
		:fieldInfo=data.groupTableP.fieldInfo
		:tableData=data.groupTableP.tableData
		:noEditFields = noEditFields
		:colwidth=data.groupTableP.colwidth
		@currentChange=""
		>
		</SingleTable>
	</el-row>

</template>

<style scoped>

</style>

