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
	editForm: new FormProps(),
	showDialog:false,
})

const FlowTable = ref()
const NodeTable = ref()

const FlowTableCurrentChange=(currentRow:any,oldCurrentRow:any)=>{
	if (FlowTable.value?.current.row){
		data.nodeTableP.filters = {"flow_instance": FlowTable.value.current.row.id}
	}else{
		data.nodeTableP.filters = null
	}
}

const NodeTableCurrentChange=(currentRow:any,oldCurrentRow:any)=>{
}

function init(){

	data.flowTableP = new TableProps()
	data.flowTableP.api = FlowApi
	data.flowTableP.repo = "FlowInstance"
	data.flowTableP.filters = {}

	data.nodeTableP = new TableProps()
	data.nodeTableP.api = FlowApi
	data.nodeTableP.repo = "NodeInstance"
	data.nodeTableP.filters = null
	data.nodeTableP.colwidth = 150

}


const runFlowInst=(row:any)=>{
	let config = new FlowApi.Commit()
	config.data.action = "run"
	config.data.data = {"pk":row.id}
	let load = loading()
	axiosSend(config).then((res:any)=>{
		load.close()
		if(res){
			ElMessage.success(JSON.stringify(res.data))
			reload('FlowInstance')
		}
		
	})
}

function reload(name:string){
	if(name == 'FlowInstance'){
		data.flowTableP.filters = {}
	}
	else if(name == 'NodeInstance'){
		data.nodeTableP.filters = {"flow_instance": FlowTable.value.current.row.id}
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
		<span>FlowInstTable</span>
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
						@click="runFlowInst(scope.row)"
						>
						执行
					</el-button>
				</el-row>
				</template>
			</el-table-column>
			</template>
		</SingleTable>
	</el-row>

	<el-row justify="center" style="margin: 5px;">
		<span>NodeInstTable</span>
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

</template>

<style scoped>

</style>

