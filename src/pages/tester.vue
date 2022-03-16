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
	noSave: boolean = false
}

interface Data{
	testCaseTable:TableProps,
	editForm:FormProps,
	showDialog:boolean,
	fieldInfo:[],
}

const data = reactive<Data>({
	testCaseTable: new TableProps(),
	editForm: new FormProps(),
	showDialog:false,
	fieldInfo:[]
})

const TestCaseTable = ref()
let TestCaseTableRow:any

function init(){

	data.testCaseTable.api = TesterApi
	data.testCaseTable.serviceName = "TestCaseService"
	data.testCaseTable.action = "filter"
	data.testCaseTable.pageSize = 5
	data.testCaseTable.filters = {}
	data.testCaseTable.fieldInfo = null
	data.testCaseTable.colwidth = 150

}

const rowClickFlowInstTable=(row:any)=>{
	TestCaseTableRow = row

}

const editTestCase=(row:any)=>{
	data.editForm.formType = "query"
	data.editForm.action = "edit"
	data.editForm.api = TesterApi
	data.editForm.serviceName = "TestCaseService"
	data.editForm.pk = row.id
	data.editForm.readOnly = true
	data.editForm.noSave = true
	data.showDialog = true
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

init()
</script>

<template>

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
								@click="editTestCase(scope.row)"
								>
								详情
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
</template>

<style scoped>

</style>


