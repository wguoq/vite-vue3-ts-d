<script lang="ts" setup>
import SingleTableF from 'components/SingleTableF.vue';
import EditForm from 'components/EditForm.vue';
import { ref,reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { axiosSend, loading } from 'utils/http.ts'
import TesterApi from 'api/tester.ts'

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
	action: string = ""
	api:any = ""
	serviceName: string = ""
	pk: any = ""
	fieldInfo: any[]|null = null
	defData: {[key: string]: any;}|null = null
	disabledLabel: string[] = []
	hideLabel: string[] = []
	readOnly: boolean = false
	noSave: boolean = false
}

interface Data{
	testCaseTable:TableProps,
	tcDataTable:TableProps,
	tcCheckTable:TableProps,
	editForm:FormProps,
	showDialog:boolean,
	fieldInfo:[],
}

const data = reactive<Data>({
	testCaseTable: new TableProps(),
	tcDataTable:new TableProps(),
	tcCheckTable:new TableProps(),
	editForm: new FormProps(),
	showDialog:false,
	fieldInfo:[]
})

const TestCaseTable = ref()
let TestCaseTableRow:any
const TcDataTable = ref()
let TcDataTableRow:any


function init(){

	data.testCaseTable.api = TesterApi
	data.testCaseTable.serviceName = "TestCaseService"
	data.testCaseTable.action = "filter"
	data.testCaseTable.pageSize = 5
	data.testCaseTable.filters = {}
	data.testCaseTable.fieldInfo = null
	data.testCaseTable.colwidth = 150

	data.tcDataTable.api = TesterApi
	data.tcDataTable.serviceName = "TcDataService"
	data.tcDataTable.action = "filter"
	data.tcDataTable.pageSize = 5
	data.tcDataTable.filters = null
	data.tcDataTable.fieldInfo = null
	data.tcDataTable.colwidth = "auto"

	data.tcCheckTable.api = TesterApi
	data.tcCheckTable.serviceName = "TcCheckPointService"
	data.tcCheckTable.action = "filter"
	data.tcCheckTable.pageSize = 5
	data.tcCheckTable.filters = null
	data.tcCheckTable.fieldInfo = null
	data.tcCheckTable.colwidth = "auto"

}

const rowTestCaseTable=(row:any)=>{
	TestCaseTableRow = row
	data.tcDataTable.filters = {"test_case":row.id}
}

const rowTcDataTable=(row:any)=>{
	TcDataTableRow = row
	data.tcCheckTable.filters = {"tc_data":row.id}
}

const openTestCaseAdd=()=>{
	data.editForm.action = "add"
	data.editForm.api = TesterApi
	data.editForm.serviceName = "TestCaseService"
	data.editForm.fieldInfo = null,
	data.editForm.defData = null,
	data.editForm.hideLabel = ["id","code","created_time","modified_time"]
	data.editForm.disabledLabel = ["version"]
	data.showDialog = true
}

const editTestCase=(row:any)=>{
	data.editForm.action = "edit"
	data.editForm.api = TesterApi
	data.editForm.serviceName = "TestCaseService"
	data.editForm.pk = row.id
	data.editForm.hideLabel = []
	data.editForm.disabledLabel = ["id","code","created_time","modified_time","version"]
	data.showDialog = true
}

const afterSave=()=>{
	data.showDialog = false
	init()
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

const openTcDataAdd=()=>{
		if (TestCaseTableRow == null || TestCaseTableRow.id == null){
		ElMessage.warning("没有选中数据")
	}else{
		data.editForm.action = "add"
		data.editForm.api = TesterApi
		data.editForm.serviceName = "TcDataService"
		data.editForm.pk = null
		data.editForm.fieldInfo = null
		data.editForm.defData = {"test_case":TestCaseTableRow.id}
		data.editForm.hideLabel = ["id","code","created_time","modified_time"]
		data.editForm.disabledLabel = ["version","test_case"]
		data.showDialog = true
	}
}

const openTcCheckAdd=()=>{
		if (TcDataTableRow == null || TcDataTableRow.id == null){
		ElMessage.warning("没有选中数据")
	}else{
		data.editForm.action = "add"
		data.editForm.api = TesterApi
		data.editForm.serviceName = "TcCheckPointService"
		data.editForm.pk = null
		data.editForm.fieldInfo = null
		data.editForm.defData = {"tc_data":TcDataTableRow.id}
		data.editForm.hideLabel = ["id","code","created_time","modified_time"]
		data.editForm.disabledLabel = ["version","tc_data"]
		data.showDialog = true
	}
}

init()
</script>

<template>
	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="openTestCaseAdd">新增</el-button>
	</el-row>

	<el-dialog 
	v-model="data.showDialog" 
	:close-on-click-modal="false"
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
		<SingleTableF 
		ref="TestCaseTable"
		:api=data.testCaseTable.api
		:action=data.testCaseTable.action
		:serviceName=data.testCaseTable.serviceName
		:filters = data.testCaseTable.filters
		:pageSize=data.testCaseTable.pageSize
		:fieldInfo=data.testCaseTable.fieldInfo
		:colwidth=data.testCaseTable.colwidth
		@rowClick="rowTestCaseTable"
		>
			<template v-slot:SingleTableCol >
				<el-table-column fixed="right" label="操作栏" width="200" >
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
		</SingleTableF>
	</el-row>
	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="openTcDataAdd">新增</el-button>
	</el-row>
	<el-row style="text-align: left; margin: 5px;">
		<SingleTableF
		ref="TcDataTable"
		:api=data.tcDataTable.api
		:action=data.tcDataTable.action
		:serviceName=data.tcDataTable.serviceName
		:filters = data.tcDataTable.filters
		:pageSize=data.tcDataTable.pageSize
		:fieldInfo=data.tcDataTable.fieldInfo
		:colwidth=data.tcDataTable.colwidth
		@rowClick="rowTcDataTable"
		>
		</SingleTableF>
	</el-row>
	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="openTcCheckAdd">新增</el-button>
	</el-row>
	<el-row style="text-align: left; margin: 5px;">
		<SingleTableF
		ref="TcCheckTable"
		:api=data.tcCheckTable.api
		:action=data.tcCheckTable.action
		:serviceName=data.tcCheckTable.serviceName
		:filters = data.tcCheckTable.filters
		:pageSize=data.tcCheckTable.pageSize
		:fieldInfo=data.tcCheckTable.fieldInfo
		:colwidth=data.tcCheckTable.colwidth
		@rowClick=""
		>
		</SingleTableF>
	</el-row>
</template>

<style scoped>

</style>


