<script lang="ts" setup>
import SingleTable from 'components/SingleTable.vue';
import EditForm from 'components/EditForm.vue';
import { ref,reactive,} from 'vue';
import { ElMessage, ElTable } from 'element-plus';
import { axiosSend, loading } from 'utils/http.ts'
import TestCaseApi from 'api/testcase.ts'


class TableProps{
	api:any = null
	repo: string = ""
	filters: {[key: string]: any;}|null = null
	pageSize:number = 5
	fieldInfo: any = null
	colwidth: any = "auto"
}

class FormProps{
	api:any=null
	repo:any=null
	pk:any=null
	replaced:any=0
	isgroup:any=0
	condition:any=null
	fieldInfo:any=null
	defData:any=null
	disabledLabel:any=[]
	hideLabel:any=[]
	readOnly:boolean=false
	noSave:boolean=false
}

const data = reactive({
	testCaseTableP: new TableProps(),
	tcApiTableP: new TableProps(),
	tcApiDataTableP: new TableProps(),
	tcCheckTableP:new TableProps(),
	editForm: new FormProps(),
	showDialog:false,
})

const TcApiTable = ref()
const TestCaseTable = ref()
const TcApiDataTable = ref()
const TcCheckTable = ref()

const TcApiTableCurrentChange=(currentRow:any,oldCurrentRow:any)=>{
	if (TcApiTable.value?.current.row){
		data.testCaseTableP.filters = {"FK_TestApi_pk": TcApiTable.value.current.row.id}
	}else{
		data.testCaseTableP.filters = null
	}
}

const TestCaseTableCurrentChange=(currentRow:any,oldCurrentRow:any)=>{
	if (TestCaseTable.value?.current.row){
		data.tcApiDataTableP.filters = {"FK_ApiTestCase_pk": TestCaseTable.value.current.row.id}
	}else{
		data.tcApiDataTableP.filters = null
	}
}

const TcApiDataTableCurrentChange=(currentRow:any,oldCurrentRow:any)=>{

	if (TcApiDataTable.value?.current.row){
		data.tcCheckTableP.filters = {"FK_ApiTestData_pk": TcApiDataTable.value.current.row.id}
	}else{
		data.tcCheckTableP.filters = null
	}
	
}
const TcCheckTableCurrentChange=(currentRow:any,oldCurrentRow:any)=>{

}

function init(){

	data.tcApiTableP = new TableProps()
	data.tcApiTableP.api = TestCaseApi
	data.tcApiTableP.repo = "TestApi"
	data.tcApiTableP.filters = {}
	data.tcApiTableP.colwidth = 150

	data.testCaseTableP = new TableProps()
	data.testCaseTableP.api = TestCaseApi
	data.testCaseTableP.repo = "ApiTestCase"
	data.testCaseTableP.filters = null
	data.testCaseTableP.colwidth = 150

	data.tcApiDataTableP = new TableProps()
	data.tcApiDataTableP.api = TestCaseApi
	data.tcApiDataTableP.repo = "ApiTestData"
	data.tcApiDataTableP.filters = null
	data.tcApiDataTableP.colwidth = 150

	data.tcCheckTableP = new TableProps()
	data.tcCheckTableP.api = TestCaseApi
	data.tcCheckTableP.repo = "ApiTestCheckPoint"
	data.tcCheckTableP.filters = null
	data.tcApiDataTableP.colwidth = 150

}

const addTcApi=()=>{
	data.editForm = new FormProps()
	data.editForm.api = TestCaseApi
	data.editForm.repo = "TestApi"
	data.editForm.hideLabel = ["id","created_time","modified_time"]
	data.editForm.disabledLabel = ["version"]
	data.showDialog = true
}

const addTestCase=()=>{
	if (TcApiTable.value?.current.row){
		data.editForm = new FormProps()
		data.editForm.api = TestCaseApi
		data.editForm.repo = "ApiTestCase"
		data.editForm.defData = {"FK_TestApi_pk": TcApiTable.value.current.row.id}
		data.editForm.hideLabel = ["id","code","created_time","modified_time"]
		data.editForm.disabledLabel = ["version","FK_TestApi_pk"]
		data.showDialog = true
	}else{
		ElMessage.warning("没有选中TestApi数据")
	}
}

const runTestCase=(row:any)=>{
	let config = new TestCaseApi.Commit()
	config.data.action = "run"
	config.data.data = {"pk":row.id}
	let load = loading()
	axiosSend(config).then((res:any)=>{
		load.close()
		if(res){
			ElMessage.success(JSON.stringify(res.data))
		}
		
	})
}

const addTcApiData=()=>{	
	if (TestCaseTable.value?.current.row){
		data.editForm = new FormProps()
		data.editForm.api = TestCaseApi
		data.editForm.repo = "ApiTestData"
		data.editForm.pk = null
		data.editForm.fieldInfo = null
		data.editForm.defData = {"FK_ApiTestCase_pk":TestCaseTable.value.current.row.id}
		data.editForm.hideLabel = ["id","code","created_time","modified_time"]
		data.editForm.disabledLabel = ["version","FK_ApiTestCase_pk"]
		data.showDialog = true
		
	}else{
		ElMessage.warning("没有选中ApiTestCase数据")

	}
}

const addTcCheck=()=>{
	if (TcApiDataTable.value?.current.row){
		data.editForm = new FormProps()
		data.editForm.api = TestCaseApi
		data.editForm.repo = "ApiTestCheckPoint"
		data.editForm.pk = null
		data.editForm.fieldInfo = null
		data.editForm.defData = {"FK_ApiTestData_pk":TcApiDataTable.value.current.row.id}
		data.editForm.hideLabel = ["id","code","created_time","modified_time"]
		data.editForm.disabledLabel = ["version","FK_ApiTestData_pk"]
		data.showDialog = true
		
	}else{
		ElMessage.warning("没有选中ApiTestData数据")

	}
}

function reload(name:string){
	if(name == 'TestApi'){
		data.tcApiTableP.filters = {}
	}
	else if(name == 'ApiTestCase'){
		data.testCaseTableP.filters = {"FK_TestApi_pk": TcApiTable.value?.current.row.id}
	}
	else if(name == 'ApiTestData'){
		data.tcApiDataTableP.filters = {"FK_ApiTestCase_pk": TestCaseTable.value?.current.row.id}
	}
	else if(name == 'ApiTestCheckPoint'){
		data.tcCheckTableP.filters = {"FK_ApiTestData_pk": TcApiDataTable.value?.current.row.id}
	}

}

const afterSave=(name:string)=>{
	data.showDialog = false
	reload(name)
}

init()
let noEditFields = ["id","code","created_time","modified_time","version","ver_status","test_case","relate_TcApiData_pk"]


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
		:api = data.editForm.api
		:repo = data.editForm.repo
		:pk = data.editForm.pk
		:replaced = data.editForm.replaced
		:isgroup = data.editForm.isgroup
		:condition = data.editForm.condition
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
		<span>TestApi</span>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="addTcApi">新增</el-button>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<SingleTable
		ref="TcApiTable"
		:api=data.tcApiTableP.api
		:repo=data.tcApiTableP.repo
		:filters = data.tcApiTableP.filters
		:pageSize=data.tcApiTableP.pageSize
		:fieldInfo=data.tcApiTableP.fieldInfo
		:colwidth=data.tcApiTableP.colwidth
		:noEditFields = noEditFields
		@currentChange="TcApiTableCurrentChange"
		>
		</SingleTable>
	</el-row>

	<el-row justify="center" style="margin: 5px;">
		<span>ApiTestCase</span>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="addTestCase">新增</el-button>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<SingleTable
		ref="TestCaseTable"
		:api=data.testCaseTableP.api
		:repo=data.testCaseTableP.repo
		:filters = data.testCaseTableP.filters
		:pageSize=data.testCaseTableP.pageSize
		:fieldInfo=data.testCaseTableP.fieldInfo
		:noEditFields = noEditFields
		:colwidth=data.testCaseTableP.colwidth
		@currentChange="TestCaseTableCurrentChange"
		>
			<template v-slot:SingleTableCol >
			<el-table-column fixed="right" label="功能" width="70" >
				<template #default="scope">
				<el-row>
					<el-button
						type="primary"
						size="small"
						@click="runTestCase(scope.row)"
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
		<span>ApiTestData</span>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="addTcApiData">新增</el-button>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<SingleTable
		ref="TcApiDataTable"
		:api=data.tcApiDataTableP.api
		:repo=data.tcApiDataTableP.repo
		:filters = data.tcApiDataTableP.filters
		:pageSize=data.tcApiDataTableP.pageSize
		:fieldInfo=data.tcApiDataTableP.fieldInfo
		:noEditFields = noEditFields
		:colwidth=data.tcApiDataTableP.colwidth
		@currentChange="TcApiDataTableCurrentChange"
		>
		</SingleTable>
	</el-row>

	<el-row justify="center" style="margin: 5px;">
		<span>ApiTestCheckPoint</span>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="addTcCheck">新增</el-button>
	</el-row>

	<el-row style="text-align: left; margin: 5px;">
		<SingleTable
		ref="TcCheckTable"
		:api=data.tcCheckTableP.api
		:repo=data.tcCheckTableP.repo
		:filters = data.tcCheckTableP.filters
		:pageSize=data.tcCheckTableP.pageSize
		:fieldInfo=data.tcCheckTableP.fieldInfo
		:noEditFields = noEditFields
		:colwidth=data.tcCheckTableP.colwidth
		@currentChange="TcCheckTableCurrentChange"
		>
		</SingleTable>
	</el-row>
</template>

<style scoped>

</style>

