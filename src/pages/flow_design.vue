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
	dialogTableVisible: false,
	flowDesignTemp:{}

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
	axiosSend(config).then((res: any)=>{
		// console.log("res == ",res)
		//console.log("res.data == ",res.data)
		//res.data取出来是string，要转成obj
		load.close()
		if(res){
			let res_data = res.data
			data.flowData = res_data.rows
			data.flowTotal = res_data.total
			data.flowLabels = Object.keys(data.flowData[0])
		}
	})
	//axios.all用于并发多个请求并且等待所有请求都完成
	// axios.all([axiosSend(url),]).then(axios.spread(function (res1,){
	// 	load.close()
	// 	console.log("res1 == ",res1)
	// }))
}

const getNodeList=()=>{
	let id = FlowTable.value.data.currentRow.id
	if (id == null){
		ElMessage.warning("没有选中数据")
	}else{
		let config = Configs.query
		let param = Params.query
		param["service"] = "FlowDesignService"
		param["action"] = "getNodeList"
		param["filters"] = {"id":id}
		config["params"] = param
		let load = loading()
		axiosSend(config).then((res:any) => {
			// console.log(res)
			load.close()
			if (res.data.total > 0){
				data.nodeData = res.data.rows
				data.nodeTotal = res.data.total
				data.nodeLabels = Object.keys(data.nodeData[0])
			}else{
				data.nodeData = []
				data.nodeTotal = 0
			}
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
	axiosSend(config).then((res:any)=>{
		load.close()
		if(res){
			ElMessage.success("ok")
		}
		
	})
}

const show = (data) =>{
	console.log("show data: ",data)
}

const getDesignTemp=()=>{
	let config = Configs.query
	let param = Params.query
	param["service"] = "FlowService"
	param["action"] = "getDesignTemp"
	config["params"] = param
	let load = loading()
	axiosSend(config).then((res:any)=>{
		console.log(res.data)
		load.close()
		if(res){
			data.flowDesignTemp = res.data.des
			data.dialogTableVisible = true
		}
		
	})
}

const saveFlowDesign=()=>{
	let config = Configs.commit
	let param = Params.commit
	param["service"] = "FlowService"
	param["action"] = "add"
	param["data"] = data.flowDesignTemp
	config["data"] = param
	let load = loading()
	axiosSend(config).then((res:any)=>{
		load.close()
		if(res){
			console.log(res)
			ElMessage.success("ok")
		}
		
	})
}
</script>

<template>
	<el-row>
		<el-col :span="24">
			<div style="text-align: left; margin: 5px;" >
				<el-button type="primary" plain @click="getAllFlow">getAllFlow</el-button>
				<el-button type="primary" plain @click="getDesignTemp">add</el-button> 
			</div>
		</el-col>
	</el-row>

	<el-dialog v-model="data.dialogTableVisible" :close-on-click-modal="false">
		<el-form ref="FlowDesignForm" label-width="120px">
			<el-row>
				<template v-for=" (value,index) in data.flowDesignTemp " >
					<el-col :span='11'>
						<el-form-item :label="index">
							<el-input 
							v-model="data.flowDesignTemp[index]"
							clearable
							>
							</el-input>
						</el-form-item>
					</el-col>
				</template>
			</el-row>
			<el-row>
				<el-col :span="11" style="text-align: right; margin: 5px;">
					  <el-button type="primary" @click="saveFlowDesign">Save</el-button>
				</el-col>
				<el-col :span="11" style="text-align: left; margin: 5px;">
					  <el-button  @click="data.dialogTableVisible = false">Cancel</el-button>
				</el-col>
			</el-row>
		</el-form>
	</el-dialog>
	
	<el-row>
		<el-col :span="24">
			<div style="text-align: left; margin: 5px;">
				<SingleTable 
				ref="FlowTable"
				:labels="data.flowLabels" 
				:tableData="data.flowData"
				@rowClick="getNodeList"
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


