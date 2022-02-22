<script lang="ts" setup>
import SingleTable from 'components/SingleTable.vue';
import Pagination from 'components/Pagination.vue';
import BaseForm from 'components/BaseForm.vue';

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
	showFwDesignAdd: false,
	showFwDesignEdit: false,
	showNdDesignAdd: false,
	showNdDesignEdit: false,
	flowDesignTemp:{}
})

const FlowTable = ref()

import { axiosSend, loading } from 'utils/http.ts'
import Configs from 'api/flow.ts'
import Params from 'api/params.ts'

function getAllFlow(){
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

const openFwDesignAdd=()=>{
	let config = Configs.query
	let param = Params.query
	param["service"] = "FlowDesignService"
	param["action"] = "getDesignTemp"
	config["params"] = param
	let load = loading()
	axiosSend(config).then((res:any)=>{
		console.log(res.data)
		load.close()
		if(res){
			data.flowDesignTemp = res.data.des
			data.showFwDesignAdd = true
		}
		
	})
}

const saveFlowDesign=()=>{
	let config = Configs.commit
	let param = Params.commit
	param["service"] = "FlowDesignService"
	param["action"] = "add"
	param["data"] = data.flowDesignTemp
	config["data"] = param
	let load = loading()
	axiosSend(config).then((res:any)=>{
		load.close()
		if(res){
			getAllFlow()
			data.showFwDesignAdd = false
			ElMessage.success("ok")
		}
	})
}

const openFwDesignEdit=(row)=>{
	data.flowDesignTemp = row
	data.showFwDesignEdit = true
}

const editFlowDesign=()=>{
	let config = Configs.commit
	let param = Params.commit
	param["service"] = "FlowDesignService"
	param["action"] = "edit"
	param["data"] = data.flowDesignTemp
	config["data"] = param
	let load = loading()
	axiosSend(config).then((res:any)=>{
		load.close()
		if(res){
			getAllFlow()
			data.showFwDesignEdit = false
			ElMessage.success("ok")
		}
	})
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

const instanceFlow=(row)=>{
	let config = Configs.commit
	let param = Params.commit
	param["service"] = "FlowService"
	param["action"] = "instance"
	param["data"] = {"id":row.id}
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



getAllFlow()
</script>

<template>
	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="getAllFlow">getAllFlow</el-button>
		<el-button type="primary" plain @click="openFwDesignAdd">新增</el-button> 
	</el-row>

	<el-dialog v-model="data.showFwDesignAdd" :close-on-click-modal="false">
		<BaseForm
		:formData="data.flowDesignTemp"
		@save="saveFlowDesign"
		@cancel="data.showFwDesignAdd = false"
		></BaseForm>
	</el-dialog>
	<el-dialog v-model="data.showFwDesignEdit" :close-on-click-modal="false">
		<BaseForm
		:formData="data.flowDesignTemp"
		@save="editFlowDesign"
		@cancel="data.showFwDesignEdit = false"
		></BaseForm>
	</el-dialog>
	
	<el-row>
		<SingleTable 
		ref="FlowTable"
		:labels="data.flowLabels" 
		:tableData="data.flowData"
		:colwidth="150"
		@rowClick="getNodeList"
		>
<!-- 					<template v-slot:operations="{scope_row}">
				<el-button
					type="text"
					size="small"
					@click="instanceFlow(scope_row.id)"
					>
					实例化
				</el-button>
			</template> -->
			<template v-slot:columnslot >
				<el-table-column fixed="right" label="slot 操作栏" width="200" >
					<template #default="scope">
						<el-button
							type="primary"
							size="small"
							@click="instanceFlow(scope.row)"
							>
							实例化
						</el-button>
						<el-button
							type="primary"
							size="small"
							@click="openFwDesignEdit(scope.row)"
							>
							编辑
						</el-button>
					</template>
				</el-table-column>
			</template>
		</SingleTable>
	</el-row>
	<el-row style="text-align: left; margin-top: 5px;">
		<Pagination
		:total = "data.flowTotal"
		>
		</Pagination>
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


