<script lang="ts" setup>
import SingleTable from 'components/SingleTable.vue';
import Pagination from 'components/Pagination.vue';
import BaseForm from 'components/BaseForm.vue';
import { ref,reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { axiosSend, loading } from 'utils/http.ts'
import Configs from 'api/tester.ts'
import Params from 'api/params.ts'

const data = reactive({
	labels: [],
	tableData: [],
	total: 0,
	response: {},
	caseInfo:{},
	showCaseResult: false,
	showCaseInfo: false,
	showCellInfo: false,
	type:"textarea",
	cellInfo:""
})

const testCaseTable = ref()

const getAllCase=()=>{
	let config = new Configs.Query()
	let params = new Params.Query()
	params.service = "TestCaseService"
	params.action = "all"
	config.params = params
	let load = loading()
	axiosSend(config).then((res:any)=>{
		// console.log("res == ",res)
		let res_data = res.data
		data.tableData.length = 0
		data.tableData = res_data.rows
		data.total = res_data.total
		data.labels = Object.keys(data.tableData[0])
		load.close()
	})
}


const runCase = () =>{
	if (testCaseTable.value.data.currentRow.id){
		let id = testCaseTable.value.data.currentRow.id
		// console.log(id)
		let config = new Configs.Commit()
		let params = new Params.Commit()
		params.service = "TesterService"
		params.action = "run"
		params.data = {"id":id}
		config.data = params
		let load = loading()
		axiosSend(config).then((res:any)=>{
			load.close()
			// console.log(res)
			data.response = res.data.data
			data.showCaseResult = true
		})
	}else{
		ElMessage.warning("没有选中数据")
	}
}

const showInfo = (row:any) =>{
	data.caseInfo = row
	data.showCaseInfo = true
}

const showCellInfo = (row:any,column:any) =>{
	let key = column.property
	if (typeof(row[key]) == "object"){
		data.cellInfo = JSON.stringify(row[key])
	}else{
		data.cellInfo = row[key]
	}
	data.showCellInfo = true
	
}
</script>

<template>
	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="getAllCase">getAllCase</el-button>
		<el-button type="primary" plain @click="runCase">runCase</el-button>
	</el-row>

	<el-dialog v-model="data.showCaseResult" :close-on-click-modal="false">
		<BaseForm
		:formData="data.response"
		:type="data.type"
		:readOnly="true"
		:noSave="true"
		:noCancel="true"
		></BaseForm>
	</el-dialog>

	<el-dialog v-model="data.showCaseInfo" :close-on-click-modal="false">
		<BaseForm
		:formData="data.caseInfo"
		:type="data.type"
		:readOnly="true"
		:noSave="true"
		:noCancel="true"
		></BaseForm>
	</el-dialog>

	<el-dialog v-model="data.showCellInfo" :close-on-click-modal="false">
		<el-input
		v-model="data.cellInfo"
		type="textarea"
		autosize
		>
		</el-input>
	</el-dialog>

	<el-row style="text-align: left; margin: 5px;">
		<SingleTable 
		ref="testCaseTable"
		:labels="data.labels" 
		:tableData="data.tableData"
		@cellDbclick="showCellInfo"
		>
		<!-- <template v-slot:test="{row}">  operations是子组件slot的name，row是slot设置的属性 -->
		<!--<template v-slot:operations="{scope_row}">
			<el-button
				size="small"
				@click="run(scope_row.id)"
				>
				slot传入的按钮
			</el-button>
		</template> -->
		<template v-slot:SingleTableCol>
			<el-table-column fixed="right" label="操作栏" width="200" >
				<template #default="scope" v-show="scope.row">
					<el-button
						type="primary"
						size="small"
						@click="showInfo(scope.row)"
						>
						查看
					</el-button>
				</template>
			</el-table-column>
		</template>
		</SingleTable>
	</el-row>
	<el-row style="text-align: left; margin-top: 5px;">
		<Pagination
		:total = "data.total"
		>
		</Pagination>
	</el-row>
</template>

<style scoped>

</style>


