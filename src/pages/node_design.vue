<script lang="ts" setup>
import SingleTable from 'components/SingleTable.vue';
import Pagination from 'components/Pagination.vue';
import { ref,reactive } from 'vue';
import { ElMessage } from 'element-plus';
import Cookies from 'js-cookie'
import axios from 'axios';

const data = reactive({
	labels:[],
	tableData: [],
	total: 0,
})

const FlowTable = ref()

import { axiosSend, loading } from 'utils/http.ts'
import Configs from 'api/flow.ts'
import Params from 'api/params.ts'

const getAllNode=()=>{
	let config = Configs.query
	let params = Params.query
	params["service"] = "NodeDesignService"
	params["action"] = "all"
	config["params"] = params
	let load = loading()
	axiosSend(config).then( function (res){
		console.log("res == ",res)
		// let res_data = JSON.parse(res.data)
		let res_data = res.data
		data.tableData = res_data.rows
		data.total = res_data.total
		data.labels = Object.keys(data.tableData[0])
		load.close()
	})
}



</script>

<template>
	<el-row>
		<el-col :span="24">
			<div style="text-align: left; margin: 5px;" >
				<el-button type="primary" plain @click="getAllNode">getAllNode</el-button>
			</div>
		</el-col>
	</el-row>
	<el-row>
		<el-col :span="24">
			<div style="text-align: left; margin: 5px;">
				<SingleTable 
				ref="FlowTable"
				:labels="data.labels" 
				:tableData="data.tableData"
				>
					<template v-slot:operations="{scope_row}">
						<el-button
							type="text"
							size="small"
							@click="instanceFlow(scope_row.id)"
							>
							实例化
						</el-button>
					</template>
				</SingleTable>
			</div>
		</el-col>
	</el-row>
	<el-row >
		<el-col :span="24" >
			<div style="text-align: left; margin-top: 5px;">
				<Pagination
				:total = "data.total"
				>
				</Pagination>
			</div>
		</el-col>
	</el-row>
	<p>{{data.resData}}</p>
</template>

<style scoped>

</style>


