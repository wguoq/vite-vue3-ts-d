<script lang="ts" setup>
import SingleTable from 'components/SingleTable.vue';
import Pagination from 'components/Pagination.vue';
import { ref,reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { axiosSend, loading } from 'utils/http.ts'
import Configs from 'api/tester.ts'
import Params from 'api/params.ts'

const data = reactive({
	labels: [""],
	tableData: [""],
	total: 0,
	response:""
})

const testCaseTable = ref()

const getAllCase=()=>{
	let config = new Configs.Query()
	let params = new Params.Query()
	params["service"] = "TestCaseService"
	params["action"] = "all"
	config["params"] = params
	let load = loading()
	axiosSend(config).then((res:any)=>{
		console.log("res == ",res)
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
		console.log(id)
		let config = new Configs.Commit()
		let params = new Params.Commit()
		params["service"] = "TesterService"
		params["action"] = "run"
		params["data"] = {"id":id}
		config["data"] = params
		let load = loading()
		axiosSend(config).then((res:any)=>{
			console.log("res == ",res)
			data.response = res.data.data
			load.close()
		})
	}else{
		ElMessage.warning("没有选中数据")
	}
}

const run = (id:any) =>{
	
}
</script>

<template>
	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="getAllCase">getAllCase</el-button>
		<el-button type="primary" plain @click="runCase">runCase</el-button>
	</el-row>
	<el-row style="text-align: left; margin: 5px;">
		<SingleTable 
		ref="testCaseTable"
		:labels="data.labels" 
		:tableData="data.tableData"
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
		<template v-slot="columnslot">
			
		</template>
		</SingleTable>
	</el-row>
	<el-row style="text-align: left; margin-top: 5px;">
		<Pagination
		:total = "data.total"
		>
		</Pagination>
	</el-row>
	<p>{{data.response}}</p>
</template>

<style scoped>

</style>


