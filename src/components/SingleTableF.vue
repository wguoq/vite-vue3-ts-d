<script lang="ts" setup>
//1.tableType:"query"|"local" 决定查询数据还是使用传入的值
//2.query模式根据传入的参数发起查询
import { reactive, ref, watch } from 'vue'
import { axiosSend, loading } from 'utils/http.ts'
import Params from 'api/params.ts'

interface Field{
        name:string 
        verbose_name:string 
        type:string 
        primary_key:boolean 
        max_length: number 
        default: any 
        help_text:string 
}

interface Props{
	tableType: "query"|"local",
	action: string|null,
	api:any|null,
	serviceName: string|null,
	filters?: {[key: string]: any;},
	fieldInfo?: Field[],
	tableData?: any[],
	colwidth?: any,

}

const props = withDefaults(defineProps<Props>(),{
	tableType: "local",
	action: null,
	api:null,
	serviceName: null,
	filters:()=>{return {}},
	fieldInfo:()=>[],
	tableData:()=>[],
	colwidth:"auto",
})

interface Data {
	fieldInfo:Field[]
	tableData:any[]
}

const data = reactive<Data>({
	fieldInfo: [],
	tableData:[],
})

const getFieldInfo=()=>{
	let config = new props.api.Query()
	let param = new Params.Query()
	param.service = props.serviceName
	param.action = "getFieldInfo"
	config.params = param
	let load = loading()
	axiosSend(config).then((res:any)=>{
		console.log(res.data)
		load.close()
		if(res){
			data.fieldInfo = res.data.fields
		}
	})
}

const filterData=()=>{
	let config = new props.api.Query()
	let param = new Params.Query()
	param.service = props.serviceName
	param.action = props.action
	param.filters = props.filters
	config.params = param
	let load = loading()
	axiosSend(config).then((res:any)=>{
		console.log(res.data)
		load.close()
		if(res){
			data.tableData = res.data.rows
		}
	})
}


function init(){
	if (props.tableType === "local"){
		data.fieldInfo = props.fieldInfo
		data.tableData = props.tableData
	}else if(props.tableType === "query"){
		getFieldInfo()
		filterData()
	}else{
		return false
	}
}


const rowClick = (row:any)=>{
  emits('rowClick',row)
}


const emits = defineEmits<{
	(event: 'rowClick',row:any):void,
	(event: 'cellDbclick',row:any,column:any):void,
}>()

const celldblclick =(row:any, column:any, cell:any, event:any)=>{
	emits('cellDbclick',row,column)
}

init()
watch(props,()=>init())
</script>

<template>
	<el-table
		:data="data.tableData"
		style="width: 100%"
		max-height="400"
		highlight-current-row
		border 
		@current-change=""
		@cell-dblclick="celldblclick"
		@row-click="rowClick"
	>  
		<el-table-column v-if="data.tableData.length > 0" type="index" width="50" />
		<template v-for="field in data.fieldInfo">
			<el-table-column 
			:property="field.name" 
			:label="field.verbose_name" 
			:width="props.colwidth"
			show-overflow-tooltip 
			sortable
			>
				<!-- 要把json对象转成string才能显示出来 -->
				<!-- #default="scope" 可以用scope.row来获取当前行数据scope.$index获取表格index -->
				<template #default="scope">
					<span>
						{{scope.row[field.name]}}
					</span>
				</template>
			</el-table-column>
		</template>
		<el-table-column fixed="right" label="操作" width="200" v-if="false">
			<!-- #default={row}就是只获取row数据=scope.row -->
			<!-- <template #default={row}> -->
			<template #default="scope">
				<!-- <slot></slot>标签表示可以接收一个父组件传入的新组件 -->
				<!-- :row="scope.row" 加入一个row属性赋值为scope.row，给父组件用 -->
					<slot name="operations" :scope_row="scope.row"></slot>
<!-- 					<el-button
						type="text"
						size="small"
						@click="show()"
						>
						table自己的按钮
					</el-button> -->
			</template>
		</el-table-column>
		<slot v-if="data.tableData.length > 0" name="SingleTableCol" ></slot>
	</el-table>
</template>


