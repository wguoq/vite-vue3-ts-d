<script lang="ts" setup>
import SingleTable from 'components/SingleTable.vue';
import EditForm from 'components/EditForm.vue';
import { ref,reactive,watch } from 'vue';
import { ElMessage } from 'element-plus';
import { axiosSend, loading } from 'utils/http.ts'
import TesterApi from 'api/tester.ts'
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

let TcApiTableRow = ref(null)
let TestCaseTableRow = ref(null)
let TcApiDataTableRow = ref(null)
let TcCheckTableRow = ref(null)

function init(){

	data.tcApiTableP = new TableProps()
	data.tcApiTableP.api = TesterApi
	data.tcApiTableP.repo = "TcApi"
	data.tcApiTableP.filters = {}
	data.tcApiTableP.colwidth = 150

	data.testCaseTableP = new TableProps()
	data.testCaseTableP.api = TesterApi
	data.testCaseTableP.repo = "TestCase"
	data.testCaseTableP.filters = null
	data.testCaseTableP.colwidth = 150

	data.tcApiDataTableP = new TableProps()
	data.tcApiDataTableP.api = TesterApi
	data.tcApiDataTableP.repo = "TcApiData"
	data.tcApiDataTableP.filters = null
	data.tcApiDataTableP.colwidth = 150

	data.tcCheckTableP = new TableProps()
	data.tcCheckTableP.api = TesterApi
	data.tcCheckTableP.repo = "TcCheckPoint"
	data.tcCheckTableP.filters = null
	data.tcApiDataTableP.colwidth = 150

}

const updata=()=>{
	//当数据发生改变后，重新获取每个列表的当前选中行
	if (typeof(TcApiTable.value) != "undefined" && TcApiTable.value.current.row){
		TcApiTableRow.value = TcApiTable.value.current.row
	}else{
		TcApiTableRow.value = null
	}

	if (typeof(TestCaseTable.value) != "undefined" && TestCaseTable.value.current.row){
		TestCaseTableRow.value = TestCaseTable.value.current.row
	}else{
		TestCaseTableRow.value = null
	}

	if (typeof(TcApiDataTable.value) != "undefined" && TcApiDataTable.value.current.row){
		TcApiDataTableRow.value = TcApiDataTable.value.current.row
	}else{
		TcApiDataTableRow.value = null
	}

	if (typeof(TcCheckTable.value) != "undefined" && TcCheckTable.value.current.row){
		TcCheckTableRow.value = TcCheckTable.value.current.row
	}else{
		TcCheckTableRow.value = null
	}
}
//监听每个列表选中行的变化来更新关联数据
watch([TcApiTableRow,TestCaseTableRow,TcApiDataTableRow],(new_,old_) => {
	if(new_[0] != old_[0]){
		if (typeof(TcApiTable.value) != "undefined" && TcApiTable.value.current.row){
			data.testCaseTableP.filters = {"tc_action_id": TcApiTable.value.current.row.id}
		}else{
			data.testCaseTableP.filters = null
		}
	}
	
	if(new_[1] != old_[1]){
		if (typeof(TestCaseTable.value) != "undefined" && TestCaseTable.value.current.row){
			data.tcApiDataTableP.filters = {"test_case": TestCaseTable.value.current.row.id}
		}else{
			data.tcApiDataTableP.filters = null
		}
	}

	if(new_[2] != old_[2]){
		if (typeof(TcApiDataTable.value) != "undefined" && TcApiDataTable.value.current.row){
			data.tcCheckTableP.filters = {"tc_data_id": TcApiDataTable.value.current.row.id}
		}else{
			data.tcCheckTableP.filters = null
		}
	}

})

const addTcApi=()=>{
	data.editForm = new FormProps()
	data.editForm.action = "save"
	data.editForm.api = TesterApi
	data.editForm.repo = "TcApi"
	data.editForm.hideLabel = ["id","created_time","modified_time"]
	data.editForm.disabledLabel = ["version"]
	data.showDialog = true
}

const addTestCase=()=>{
	if (TcApiTable.value.current.row == null || TcApiTable.value.current.row.id == null){
		ElMessage.warning("没有选中数据")
	}else{
		data.editForm = new FormProps()
		data.editForm.action = "save"
		data.editForm.api = TesterApi
		data.editForm.repo = "TestCase"
		data.editForm.defData = {"tc_action_id": TcApiTable.value.current.row.id}
		data.editForm.hideLabel = ["id","code","created_time","modified_time"]
		data.editForm.disabledLabel = ["version","tc_action_id"]
		data.showDialog = true
	}
}

const runTestCase=(row:any)=>{
	let config = new TesterApi.Commit()
	config.data.action = "run"
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

const addTcApiData=()=>{	
	if (TestCaseTable.value.current.row == null || TestCaseTable.value.current.row.id == null){
		ElMessage.warning("没有选中数据")
	}else{
		data.editForm = new FormProps()
		data.editForm.action = "save"
		data.editForm.api = TesterApi
		data.editForm.repo = "TcApiData"
		data.editForm.pk = null
		data.editForm.fieldInfo = null
		data.editForm.defData = {"test_case":TestCaseTable.value.current.row.id}
		data.editForm.hideLabel = ["id","code","created_time","modified_time"]
		data.editForm.disabledLabel = ["version","test_case"]
		data.showDialog = true
	}
}

const addTcCheck=()=>{
	if (TcApiDataTable.value.current.row == null || TcApiDataTable.value.current.row.id == null){
		ElMessage.warning("没有选中数据")
	}else{
		data.editForm = new FormProps()
		data.editForm.action = "save"
		data.editForm.api = TesterApi
		data.editForm.repo = "TcCheckPoint"
		data.editForm.pk = null
		data.editForm.fieldInfo = null
		data.editForm.defData = {"tc_data_id":TcApiDataTable.value.current.row.id}
		data.editForm.hideLabel = ["id","code","created_time","modified_time"]
		data.editForm.disabledLabel = ["version","tc_data_id"]
		data.showDialog = true
	}
}

function reload(repo:string){
	if(repo == 'TcApi'){
		data.tcApiTableP.filters = {}
	}
	else if(repo == 'TestCase'){
		data.testCaseTableP.filters = {"tc_action_id": TcApiTable.value.current.row.id}
	}
	else if(repo == 'TcApiData'){
		data.tcApiDataTableP.filters = {"test_case": TestCaseTable.value.current.row.id}
	}
	else if(repo == 'TcCheckPoint'){
		data.tcCheckTableP.filters = {"tc_data_id": TcApiDataTable.value.current.row.id}
	}

}

const afterSave=(f:any)=>{
	data.showDialog = false
	reload(f.repo)
}

init()
let noEditFields = ["id","code","created_time","modified_time","version","ver_status"]
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
		<span>ApiTable</span>
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
		@rowClick="updata"
		@afterInit="updata"
		>
		</SingleTable>
	</el-row>

	<el-row justify="center" style="margin: 5px;">
		<span>TestCaseTable</span>
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
		@rowClick="updata"
		@afterInit="updata"
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
		<span>ApiDataTable</span>
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
		@rowClick="updata"
		@afterInit="updata"
		>
		</SingleTable>
	</el-row>

	<el-row justify="center" style="margin: 5px;">
		<span>CheckPointTable</span>
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
		@rowClick="updata"
		@afterInit="updata"
		>
		</SingleTable>
	</el-row>
</template>

<style scoped>

</style>

