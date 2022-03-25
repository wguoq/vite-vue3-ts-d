<script lang="ts" setup>
import SingleTable from 'components/SingleTable.vue';
import EditForm from 'components/EditForm.vue';
import { ref,reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { axiosSend, loading } from 'utils/http.ts'
import TesterApi from 'api/tester.ts'
// import {SingleTableProps} from 'components/PropsClass.ts'

class TableProps{
	api:any = null
	serviceName: string|null = ""
	filters: {[key: string]: any;}|null = null
	pageSize:number = 5
	fieldInfo: any = null
	colwidth: any = "auto"
}

class FormProps{
	api:any = ""
	serviceName: string = ""
	action: string = "add"
	pk: any = null
	fieldInfo: any[]|null = null
	defData: {[key: string]: any;}|null = null
	disabledLabel: string[] = []
	hideLabel: string[] = []
	readOnly: boolean = false
	noSave: boolean = false
}

const data = reactive({
	testCaseTable: new TableProps(),
	tcApiTable: new TableProps(),
	tcApiDataTable:new TableProps(),
	tcCheckTable:new TableProps(),
	editForm: new FormProps(),
	showDialog:false,
})

const TcApiTable = ref()
let TcApiTableRow:any = null

const TestCaseTable = ref()
let TestCaseTableRow:any = null 

const TcApiDataTable = ref()
let TcApiDataTableRow:any = null

const TcCheckTable = ref()
let TcCheckTableRow:any = null

function init(){

	data.tcApiTable = new TableProps()
	data.tcApiTable.api = TesterApi
	data.tcApiTable.serviceName = "TcApiService"
	data.tcApiTable.filters = {}
	data.tcApiTable.colwidth = 150

	data.testCaseTable = new TableProps()
	data.testCaseTable.api = TesterApi
	data.testCaseTable.serviceName = "TestCaseService"
	data.testCaseTable.filters = null
	data.testCaseTable.colwidth = 150

	data.tcApiDataTable = new TableProps()
	data.tcApiDataTable.api = TesterApi
	data.tcApiDataTable.filters = null
	data.tcApiDataTable.colwidth = 150

	data.tcCheckTable = new TableProps()
	data.tcCheckTable.api = TesterApi
	data.tcCheckTable.filters = null


}

const addTcApi=()=>{
	data.editForm = new FormProps()
	data.editForm.action = "add"
	data.editForm.api = TesterApi
	data.editForm.serviceName = "TcApiService"
	data.editForm.hideLabel = ["id","created_time","modified_time"]
	data.editForm.disabledLabel = ["version"]
	data.showDialog = true
}

const editTcApi=(row:any)=>{
	data.editForm = new FormProps()
	data.editForm.action = "edit"
	data.editForm.api = TesterApi
	data.editForm.serviceName = "TcApiService"
	data.editForm.pk = row.id
	data.editForm.hideLabel = []
	data.editForm.disabledLabel = ["id","created_time","modified_time","version"]
	data.showDialog = true
	
}

const rowClickTcApiTable=(row:any)=>{
	TcApiTableRow = row
	data.testCaseTable.filters = {"tc_action_id": row.id}
}

const addTestCase=()=>{
	if (TcApiTableRow == null || TcApiTableRow.id == null){
		ElMessage.warning("没有选中数据")
	}else{
		data.editForm = new FormProps()
		data.editForm.action = "add"
		data.editForm.api = TesterApi
		data.editForm.serviceName = "TestCaseService"
		data.editForm.defData = {"tc_action_id": TcApiTableRow.id}
		data.editForm.hideLabel = ["id","code","created_time","modified_time"]
		data.editForm.disabledLabel = ["version","tc_action_id"]
		data.showDialog = true
	}
}

const editTestCase=(row:any)=>{
	data.editForm = new FormProps()
	data.editForm.action = "edit"
	data.editForm.api = TesterApi
	data.editForm.serviceName = "TestCaseService"
	data.editForm.pk = row.id
	data.editForm.hideLabel = []
	data.editForm.disabledLabel = ["id","code","created_time","modified_time","version"]
	data.showDialog = true
}

const rowClickTestCaseTable=(row:any)=>{
	TestCaseTableRow = row
	data.tcApiDataTable.serviceName = "TcApiDataService"
	data.tcApiDataTable.filters = {"test_case":row.id}
}

const runTestCase=(row:any)=>{
	let config = new TesterApi.Commit()
	config.data.service = "TesterService"
	config.data.action = "run"
	config.data.data = {"id":row.id}
	let load = loading()
	axiosSend(config).then((res:any)=>{
		load.close()
		console.log(res);
		if(res){
			if (res.data.test_case_result == 'fail'){
				ElMessage.warning(JSON.stringify(res.data))
			}else{
				ElMessage.success(JSON.stringify(res.data))
			}
		}
		
	})
}

const addTcApiData=()=>{	
	
	if (TestCaseTableRow == null || TestCaseTableRow.id == null){
		ElMessage.warning("没有选中数据")
	}else{
		data.editForm = new FormProps()
		data.editForm.action = "add"
		data.editForm.api = TesterApi
		if(TestCaseTableRow.tc_type === "api"){
			data.editForm.serviceName = "TcApiDataService"
		}
		data.editForm.pk = null
		data.editForm.fieldInfo = null
		data.editForm.defData = {"test_case":TestCaseTableRow.id}
		data.editForm.hideLabel = ["id","code","created_time","modified_time"]
		data.editForm.disabledLabel = ["version","test_case"]
		data.showDialog = true
	}
}

const editTcApiData=(row:any)=>{	
	data.editForm = new FormProps()
	data.editForm.action = "edit"
	data.editForm.api = TesterApi
	data.editForm.serviceName = "TcApiDataService"
	data.editForm.pk = row.id
	data.editForm.fieldInfo = null
	data.editForm.hideLabel = ["id","code","created_time","modified_time"]
	data.editForm.disabledLabel = ["version","test_case"]
	data.showDialog = true
}

const rowClickTcApiDataTable=(row: any)=>{
	TcApiDataTableRow = row
	data.tcCheckTable.serviceName = "TcCheckPointService"
	data.tcCheckTable.filters = {"tc_data_id":row.id}
}

const addTcCheck=()=>{
	if (TcApiDataTableRow == null || TcApiDataTableRow.id == null){
		ElMessage.warning("没有选中数据")
	}else{
		data.editForm = new FormProps()
		data.editForm.action = "add"
		data.editForm.api = TesterApi
		data.editForm.serviceName = "TcCheckPointService"
		data.editForm.pk = null
		data.editForm.fieldInfo = null
		data.editForm.defData = {"tc_data_id":TcApiDataTableRow.id}
		data.editForm.hideLabel = ["id","code","created_time","modified_time"]
		data.editForm.disabledLabel = ["version","tc_data_id"]
		data.showDialog = true
	}
}

const editTcChec=(row:any)=>{
	data.editForm.action = "edit"
	data.editForm.api = TesterApi
	data.editForm.serviceName = "TcCheckPointService"
	data.editForm.pk = row.id
	data.editForm.fieldInfo = null
	data.editForm.hideLabel = ["id","code","created_time","modified_time"]
	data.editForm.disabledLabel = ["version","tc_data_id"]
	data.showDialog = true
}
const afterSave=()=>{
	data.showDialog = false
	init()
}
init()
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
		:serviceName = data.editForm.serviceName
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

	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="addTcApi">新增</el-button>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<SingleTable
		ref="TcApiTable"
		:api=data.tcApiTable.api
		:serviceName=data.tcApiTable.serviceName
		:filters = data.tcApiTable.filters
		:pageSize=data.tcApiTable.pageSize
		:fieldInfo=data.tcApiTable.fieldInfo
		:colwidth=data.tcApiTable.colwidth
		@rowClick="rowClickTcApiTable"
		>
			<template v-slot:SingleTableCol >
			<el-table-column fixed="right" label="操作栏" width="80" >
				<template #default="scope">
				<el-row>
					<el-col :span="11">
						<el-button
							type="primary"
							size="small"
							@click="editTcApi(scope.row)"
							>
							编辑
						</el-button>
					</el-col>
				</el-row>
				</template>
			</el-table-column>
			</template>
		</SingleTable>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="addTestCase">新增</el-button>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<SingleTable
		ref="TestCaseTable"
		:api=data.testCaseTable.api
		:serviceName=data.testCaseTable.serviceName
		:filters = data.testCaseTable.filters
		:pageSize=data.testCaseTable.pageSize
		:fieldInfo=data.testCaseTable.fieldInfo
		:colwidth=data.testCaseTable.colwidth
		@rowClick="rowClickTestCaseTable"
		>
			<template v-slot:SingleTableCol >
			<el-table-column fixed="right" label="操作栏" width="160" >
				<template #default="scope">
				<el-row>
					<el-col :span="11">
						<el-button
							type="primary"
							size="small"
							@click="editTestCase(scope.row)"
							>
							编辑
						</el-button>
					</el-col>
					<el-col :span="11">
						<el-button
							type="primary"
							size="small"
							@click="runTestCase(scope.row)"
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
		<el-button type="primary" plain @click="addTcApiData">新增</el-button>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<SingleTable
		ref="TcApiDataTable"
		:api=data.tcApiDataTable.api
		:serviceName=data.tcApiDataTable.serviceName
		:filters = data.tcApiDataTable.filters
		:pageSize=data.tcApiDataTable.pageSize
		:fieldInfo=data.tcApiDataTable.fieldInfo
		:colwidth=data.tcApiDataTable.colwidth
		@rowClick="rowClickTcApiDataTable"
		>
			<template v-slot:SingleTableCol >
			<el-table-column fixed="right" label="操作栏" width="80" >
				<template #default="scope">
				<el-row>
					<el-col :span="11">
						<el-button
							type="primary"
							size="small"
							@click="editTcApiData(scope.row)"
							>
							编辑
						</el-button>
					</el-col>
				</el-row>
				</template>
			</el-table-column>
			</template>
		</SingleTable>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="addTcCheck">新增</el-button>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<SingleTable
		ref="TcCheckTable"
		:api=data.tcCheckTable.api
		:serviceName=data.tcCheckTable.serviceName
		:filters = data.tcCheckTable.filters
		:pageSize=data.tcCheckTable.pageSize
		:fieldInfo=data.tcCheckTable.fieldInfo
		:colwidth=data.tcCheckTable.colwidth
		@rowClick=""
		>
			<template v-slot:SingleTableCol >
			<el-table-column fixed="right" label="操作栏" width="80" >
				<template #default="scope">
				<el-row>
					<el-col :span="11">
						<el-button
							type="primary"
							size="small"
							@click="editTcChec(scope.row)"
							>
							编辑
						</el-button>
					</el-col>
				</el-row>
				</template>
			</el-table-column>
			</template>
		</SingleTable>
	</el-row>
</template>

<style scoped>

</style>


