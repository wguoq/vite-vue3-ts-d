<script lang="ts" setup>
import SingleTable from 'components/SingleTable.vue';
import { ref,reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { axiosSend, loading } from 'utils/http.ts'
import FlowApi from 'api/flow.ts'

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
	flowInstTable:TableProps,
	nodeInstTable:TableProps,
	editForm:FormProps,
	showDialog:boolean,
	fieldInfo:[],
}

const data = reactive<Data>({
	flowInstTable: new TableProps(),
	nodeInstTable: new TableProps(),
	editForm: new FormProps(),
	showDialog:false,
	fieldInfo:[]

})

const FlowInstTable = ref()
let FlowInstTableRow:any
const NodeInstTable = ref()
let NodeInstTableRow:any

function init(){

	data.flowInstTable.api = FlowApi
	data.flowInstTable.serviceName = "FlowInstService"
	data.flowInstTable.action = "filter"
	data.flowInstTable.pageSize = 5
	data.flowInstTable.filters = {}
	data.flowInstTable.fieldInfo = null
	data.flowInstTable.colwidth = 150
	
	data.nodeInstTable.api = FlowApi
	data.nodeInstTable.serviceName = "NodeInstService"
	data.nodeInstTable.action = "filter"
	data.nodeInstTable.pageSize = 5
	data.nodeInstTable.filters = null
	data.nodeInstTable.fieldInfo = null
	data.nodeInstTable.colwidth = 150

}

const rowClickFlowInstTable=(row:any)=>{
	FlowInstTableRow = row
	data.nodeInstTable.filters= {"flow_instance_id":row.id}
}

const rowClickNodeInstTableTable=(row:any)=>{
	NodeInstTableRow = row
}

const runFLowInst=(row:any)=>{
	let config = new FlowApi.Commit()
	config.data.service = "FlowInstService"
	config.data.action = "run"
	config.data.data = {"id":row.id}
	let load = loading()
	axiosSend(config).then((res:any)=>{
		load.close()
		if(res){
			ElMessage.success("ok")
		}
		
	})
}

init()
</script>

<template>
	<el-row style="text-align: left; margin: 5px;">
		<SingleTable
		ref="FlowInstTable"
		:api=data.flowInstTable.api
		:action=data.flowInstTable.action
		:serviceName=data.flowInstTable.serviceName
		:filters = data.flowInstTable.filters
		:pageSize=data.flowInstTable.pageSize
		:fieldInfo=data.flowInstTable.fieldInfo
		:colwidth=data.flowInstTable.colwidth
		@rowClick="rowClickFlowInstTable"
		>
			<template v-slot:SingleTableCol >
				<el-table-column fixed="right" label="操作栏" width="200" >
					<template #default="scope">
					<el-row>
						<el-col :span="11">
						<el-button
							type="primary"
							size="small"
							@click="runFLowInst(scope.row)"
							>
							运行
						</el-button>
						</el-col>
					</el-row>
					</template>
				</el-table-column>
			</template>
		</SingleTable>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<SingleTable
		ref="NodeInstTable"
		:api=data.nodeInstTable.api
		:action=data.nodeInstTable.action
		:serviceName=data.nodeInstTable.serviceName
		:filters = data.nodeInstTable.filters
		:pageSize=data.nodeInstTable.pageSize
		:fieldInfo=data.nodeInstTable.fieldInfo
		:colwidth=data.nodeInstTable.colwidth
		@rowClick="rowClickNodeInstTableTable"
		>
		</SingleTable>
	</el-row>

</template>

<style scoped>

</style>


