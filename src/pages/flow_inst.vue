<script lang="ts" setup>
import SingleTable from 'components/SingleTable.vue';
import Pagination from 'components/Pagination.vue';
import { ref,reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { axiosSend, loading } from 'utils/http.ts'
import Configs from 'api/flow.ts'
import Params from 'api/params.ts'

const data = reactive({
	flowLabels:[""],
	flowData: [],
	flowTotal: 0,
	nodeLabels:[""],
	nodeData: [],
	nodeTotal: 0,
})

const FlowTable = ref()

function getAllFlowInst(){
	let config = new Configs.Query()
	let param = new Params.Query()
	param.service = "FlowInstService"
	param.action = "all"
	config.params = param
	let load = loading()
	axiosSend(config).then((res:any)=>{
		load.close()
		if(res.data.total > 0){
			let res_data = res.data
			data.flowData = res_data.rows
			data.flowTotal = res_data.total
			data.flowLabels = Object.keys(data.flowData[0])
		}
	})
}

const getNodeInstList = (row:any) =>{
	console.log("row_id: ",row.id)
	if (row.id == null){
		ElMessage.warning("没有选中数据")
	}else{
		let config = new Configs.Query()
		let param = new Params.Query()
		param.service = "NodeInstService"
		param.action = "filter"
		param.filters = {"flow_instance_id":row.id}
		config.params = param
		let load = loading()
		axiosSend(config).then((res:any)=>{
			load.close()
			let res_data = res.data
			if (res_data.total > 0){
				data.nodeData = res_data.rows
				data.nodeTotal = res_data.total
				data.nodeLabels = Object.keys(data.nodeData[0])
			}else{
				data.nodeData = []
				data.nodeTotal = 0
			}
		})
	}
}

const runFlowInst=(id:any)=>{
	let config = new Configs.Commit()
	let param = new Params.Commit()
	param.service = "FlowInstService"
	param.action = "run"
	param.data = {"id":id}
	config.data = param
	let load = loading()
	axiosSend(config).then((res:any)=>{
		console.log("res == ",res)
		load.close()
		if(res){
			ElMessage.success("ok")
		}
	})
	getAllFlowInst()
}


getAllFlowInst()
</script>

<template>
	<el-row style="text-align: left; margin: 5px;">
		<el-button type="primary" plain @click="getAllFlowInst">getAllFlowInst</el-button>
	</el-row>
	<el-row style="text-align: left; margin: 5px;">
		<SingleTable 
		ref="FlowTable"
		:labels="data.flowLabels" 
		:tableData="data.flowData"
		@rowClick="getNodeInstList"
		>
			<template v-slot:SingleTableCol>
				<el-table-column fixed="right" label="操作栏" width="200">
					<template #default="scope">
						<el-button
							type="text"
							size="small"
							@click="runFlowInst(scope.row.id)"
							>
							执行
						</el-button>
					</template>
				</el-table-column>
			</template>
		</SingleTable>
	</el-row>
	<el-row style="text-align: left; margin: 5px;">
		<Pagination
		:total = "data.flowTotal"
		>
		</Pagination>
	</el-row>
	<el-row style="text-align: left; margin: 5px;" >
		<el-button type="primary" plain @click="getNodeInstList">getNodeInstList</el-button>
	</el-row>
	<el-row style="text-align: left; margin: 5px;" >
		<SingleTable 
		ref="NodeTable"
		:labels="data.nodeLabels" 
		:tableData="data.nodeData"
		>
		</SingleTable>
	</el-row>
	<el-row style="text-align: left; margin: 5px;" >
		<Pagination
		:total = "data.nodeTotal"
		>
		</Pagination>
</el-row>
</template>

<style scoped>

</style>


