<script lang="ts" setup>
// 只有query模式
// filters为null时不会发起查询数据，这是为了作为上下列表的下表时一开始不会查询
// fieldInfo为null时才会发起查询fieldInfo，这是为了组合多表字段时从父组件获取
import { reactive, watch } from 'vue'
import { axiosSend, loading } from 'utils/http.ts'

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
	api:any,
	action: string,
	serviceName: string,
	filters?: {[key: string]: any;}|null,
	pageSize:number,
	fieldInfo?: Field[]|null,
	colwidth?: any,
	
}

const props = withDefaults(defineProps<Props>(),{
	api:"",
	action: "query",
	serviceName: "",
	filters: ()=>{return {}},
	pageSize:10,
	fieldInfo:()=>[],
	colwidth:"auto",

})

interface Data {
	fieldInfo:Field[]
	tableData:any[]
	pageSize: number
	currentPage:number
	total:number
}

const data = reactive<Data>({
	fieldInfo: [],
	tableData:[],
	pageSize:10,
	currentPage:1,
	total:0
})

defineExpose({
	data
})

const getFieldInfo=()=>{
	let config = new props.api.Query()
	config.params.service = props.serviceName
	config.params.action = "getFieldInfo"
	let load = loading()
	axiosSend(config).then((res:any)=>{
		load.close()
		if(res){
			data.fieldInfo = res.data.fields
		}
	})
}

const filterData=()=>{
	let config = new props.api.Query()
	config.params.service = props.serviceName
	config.params.action = props.action
	config.params.filters = props.filters
	config.params.pageSize = data.pageSize
	config.params.pageNumber = data.currentPage
	let load = loading()
	axiosSend(config).then((res:any)=>{
		load.close()
		if(res){
			data.tableData = res.data.rows
			data.total = res.data.total
		}
	})
}


function init(){
	if (props.fieldInfo){
		data.fieldInfo = props.fieldInfo
	}else{
		getFieldInfo()
	}

	if (props.filters){
		data.pageSize = props.pageSize
		filterData()
	}else{
		data.tableData = []
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
const currentPageChange =()=>{
	filterData()

}
init()
watch(props,()=>init())
</script>

<template >
	<el-table
		:data="data.tableData"
		style="width: 100%"
		max-height="300"
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
			<template #default="scope">
				<span>
					{{scope.row[field.name]}}
				</span>
			</template>
			</el-table-column>
		</template>
		<slot v-if="data.tableData.length > 0" name="SingleTableCol" ></slot>
	</el-table>
	
	<el-row style="text-align: left; margin-top: 5px;">
		<el-pagination
		v-model:currentPage="data.currentPage"
		v-model:page-size="data.pageSize"
		:total="data.total"
		layout="total, prev, pager, next, jumper"
		:background="true"
		@size-change=""
		@current-change="currentPageChange"
		>
		</el-pagination>
	</el-row>

</template>


