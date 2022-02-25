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
	flowDesignTemp:{},
	showFlowNodeAdd: false,
	showFlowNodeEdit: false,
	flowNodeTemp:{},

})

const FlowTable = ref()

import { axiosSend, loading } from 'utils/http.ts'
import Configs from 'api/flow.ts'
import Params from 'api/params.ts'

function getAllFlow(){
	let config = new Configs.Query()
	let param = new Params.Query()
	param["service"] = "FlowDesignService"
	param["action"] = "all"
	config["params"] = param
	let load = loading()
	axiosSend(config).then((res: any)=>{
		load.close()
		if(res){
			let res_data = res.data
			data.flowData = res_data.rows
			data.flowTotal = res_data.total
			data.flowLabels = Object.keys(data.flowData[0])
		}
	})
}

const openFwDesignAdd=()=>{
	let config = new Configs.Query()
	let param = new Params.Query()
	param["service"] = "FlowDesignService"
	param["action"] = "getTemp"
	config["params"] = param
	let load = loading()
	axiosSend(config).then((res:any)=>{
		console.log(res.data)
		load.close()
		if(res){
			data.flowDesignTemp = res.data.rows
			data.showFwDesignAdd = true
		}
	})
}

const saveFlowDesign=()=>{
	let config = new Configs.Commit()
	let param = new Params.Commit()
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
			data.showFwDesignEdit = false
			ElMessage.success("ok")
		}
	})
}

const openFwDesignEdit=(row)=>{
	data.flowDesignTemp = row
	data.showFwDesignEdit = true
}

const getNodeList=()=>{
	let id = FlowTable.value.data.currentRow.id
	if (id == null){
		ElMessage.warning("没有选中数据")
	}else{
		let config = new Configs.Query()
		let param = new Params.Query()
		param["service"] = "FlowNodeService"
		param["action"] = "filter"
		param["filters"] = {"flow_design_id":id}
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
	let config = new Configs.Commit()
	let param = new Params.Commit()
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

const openFlowNodeAdd=()=>{
	let id = FlowTable.value.data.currentRow.id
	if (id == null){
		ElMessage.warning("没有选中数据")
	}else{
		let config1 = new Configs.Query()
		let param1 = new Params.Query()
		param1["service"] = "FlowNodeService"
		param1["action"] = "getTemp"
		config1["params"] = param1
		
		let config2 = new Configs.Query()
		let param2 = new Params.Query()
		param2["service"] = "NodeDesignService"
		param2["action"] = "getTemp"
		config2["params"] = param2
		
		let load = loading()

		axios.all([axiosSend(config1),axiosSend(config2)]).then(axios.spread((res1,res2)=>{
			load.close()
			data.flowNodeTemp = Object.assign(res1.data.rows, res2.data.rows)
			data.flowNodeTemp["flow_design"] = id
			delete data.flowNodeTemp.node_design
			delete data.flowNodeTemp.version
			delete data.flowNodeTemp.ver_status
			data.showFlowNodeAdd = true
		}))
	}
}

const saveflowNodeTemp=()=>{
	let config = new Configs.Commit()
	let param = new Params.Commit()
	param["service"] = "FlowNodeService"
	param["action"] = "add"
	param["data"] = data.flowNodeTemp
	config["data"] = param
	let load = loading()
	axiosSend(config).then((res:any)=>{
		load.close()
		if(res){
			getNodeList()
			data.showFlowNodeAdd = false
			data.showFlowNodeEdit = false
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
		:disabledLabel="[]"
		:hideLabel="['version','ver_status']"
		@save="saveFlowDesign"
		@cancel="data.showFwDesignAdd = false"
		></BaseForm>
	</el-dialog>
	
	<el-dialog v-model="data.showFwDesignEdit" :close-on-click-modal="false">
		<BaseForm
		:formData="data.flowDesignTemp"
		:disabledLabel="['id','code']"
		:hideLabel="['version','ver_status']"
		@save="saveFlowDesign"
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
			<template v-slot:operations="{scope_row}">
				<el-button
					type="text"
					size="small"
					@click="instanceFlow(scope_row.id)"
					>
					实例化
				</el-button>
			</template>
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
				<el-button type="primary" plain @click="openFlowNodeAdd">新增</el-button> 
			</div>
		</el-col>
	</el-row>
	
	<el-dialog v-model="data.showFlowNodeAdd" :close-on-click-modal="false">
		<BaseForm
		:formData="data.flowNodeTemp"
		:disabledLabel="['flow_design']"
		:hideLabel="['version','ver_status']"
		@save="saveflowNodeTemp"
		@cancel="data.showFlowNodeAdd = false"
		></BaseForm>
	</el-dialog>
	
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


