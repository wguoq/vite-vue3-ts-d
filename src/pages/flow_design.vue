<script lang="ts" setup>
import SingleTable from 'components/SingleTable.vue';
import Pagination from 'components/Pagination.vue';
import { ref,reactive } from 'vue';
import { ElMessage } from 'element-plus';
import Cookies from 'js-cookie'
import axios from 'axios';

const data = reactive({
	flowLabels:[],
	flowData: [],
	flowTotal: 0,
	nodeLabels:[],
	nodeData: [],
	nodeTotal: 0,
})

const FlowTable = ref()

import { axiosSend, loading } from 'utils/http.ts'
import Configs from 'api/flow.ts'
import Params from 'api/params.ts'

const getAllFlow=()=>{
	let config = Configs.query
	let param = Params.query
	param["service"] = "FlowDesignService"
	param["action"] = "all"
	config["params"] = param
	//开启loading
	let load = loading()
	axiosSend(config).then( function (res){
		// console.log("res == ",res)
		//console.log("res.data == ",res.data)
		//res.data取出来是string，要转成obj
		let res_data = res.data
		data.flowData = res_data.rows
		data.flowTotal = res_data.total
		data.flowLabels = Object.keys(data.flowData[0])
		load.close()
	})
	//axios.all用于并发多个请求并且等待所有请求都完成
	// axios.all([axiosSend(url),]).then(axios.spread(function (res1,){
	// 	load.close()
	// 	console.log("res1 == ",res1)
	// }))
}

const getNodeList=()=>{
	let flowDesignId = FlowTable.value.data.currentRow.id
	if (flowDesignId == null){
		ElMessage.warning("没有选中数据")
	}else{
		let config = Configs.query
		let param = Params.query
		param["service"] = "FlowDesignService"
		param["action"] = "getNodeList"
		param["filters"] = {"flowDesignId":flowDesignId}
		config["params"] = param
		let load = loading()
		axiosSend(config).then( function (res){
			// console.log(res)
			let res_data = res.data
			if (res_data.total > 0){
				data.nodeData = res_data.rows
				data.nodeTotal = res_data.total
				data.nodeLabels = Object.keys(data.nodeData[0])
			}else{
				data.nodeData = []
				data.nodeTotal = 0
			}
			load.close()
		})
	}
}

const instanceFlow=(id)=>{
	let config = Configs.commit
	let param = Params.commit
	param["service"] = "FlowService"
	param["action"] = "instance"
	param["data"] = {"id":id}
	config["data"] = param
	let load = loading()
	axiosSend(config).then( function (res){
		console.log("res == ",res)
		load.close()
	})
}

const show = (data) =>{
	console.log("data: ",data)
}


const clickFlow = (row) =>{
	console.log("row_id: ",row.id)
	if (row.id == null){
		ElMessage.warning("没有选中数据")
	}else{
		let config = Configs.query
		let param = Params.query
		param["service"] = "FlowDesignService"
		param["action"] = "getNodeList"
		param["filters"] = {"flowDesignId":row.id}
		config["params"] = param
		let load = loading()
		axiosSend(config).then( function (res){
			// console.log(res)
			let res_data = res.data
			if (res_data.total > 0){
				data.nodeData = res_data.rows
				data.nodeTotal = res_data.total
				data.nodeLabels = Object.keys(data.nodeData[0])
			}else{
				data.nodeData = []
				data.nodeTotal = 0
			}
			load.close()
		})
	}
}

</script>

<template>
	<el-row>
		<el-col :span="24">
			<div style="text-align: left; margin: 5px;" >
				<el-button type="primary" plain @click="getAllFlow">getAllFlow</el-button>
			</div>
		</el-col>
	</el-row>
	<el-row>
		<el-col :span="24">
			<div style="text-align: left; margin: 5px;">
				<SingleTable 
				ref="FlowTable"
				:labels="data.flowLabels" 
				:tableData="data.flowData"
				@rowClick="clickFlow"
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
					<template v-slot:columnslot>
						<el-table-column fixed="right" label="slot 操作栏" width="200">
							<template #default="scope">
								<el-button
									type="text"
									size="small"
									@click="instanceFlow(scope.row.id)"
									>
									实例化
								</el-button>
							</template>
						</el-table-column>
					</template>
				</SingleTable>
			</div>
		</el-col>
	</el-row>
	<el-row >
		<el-col :span="24" >
			<div style="text-align: left; margin-top: 5px;">
				<Pagination
				:total = "data.flowTotal"
				>
				</Pagination>
			</div>
		</el-col>
	</el-row>
	<el-divider></el-divider>
	<el-row>
		<el-col :span="24">
			<div style="text-align: left; margin: 5px;" >
				<el-button type="primary" plain @click="getNodeList">getNodeList</el-button>
			</div>
		</el-col>
	</el-row>
	<el-row>
		<el-col :span="24">
			<div style="text-align: left; margin: 5px;">
				<SingleTable 
				ref="NodeTable"
				:labels="data.nodeLabels" 
				:tableData="data.nodeData"
				>
				</SingleTable>
			</div>
		</el-col>
	</el-row>
	<el-row >
		<el-col :span="24" >
			<div style="text-align: left; margin-top: 5px;">
				<Pagination
				:total = "data.nodeTotal"
				>
				</Pagination>
			</div>
		</el-col>
	</el-row>
</template>

<style scoped>

</style>


