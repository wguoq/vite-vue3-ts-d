<script lang="ts" setup>
// 只有query模式
// filters为null时不会发起查询数据，这是为了作为上下列表的下表时一开始不会查询
// fieldInfo为null时才会发起查询fieldInfo，这是为了组合多表字段时从父组件获取
// 通过rowClick事件把row传出去就行了
import { reactive, watch } from 'vue'
import { axiosSend, loading } from 'utils/http.ts'

class Field{
	name:string = ""
	verbose_name:string = ""
	type:string = ""
	primary_key:boolean = false
	max_length: number = 0
	default: any = ""
	help_text:string = ""
}

interface Props{
	api:any,
	serviceName: string,
	filters?: {[key: string]: any;}|null,
	pageSize:number,
	fieldInfo?: Field[]|null,
	colwidth?: any,
}

const props = withDefaults(defineProps<Props>(),{
	api:"",
	serviceName: "",
	filters: ()=>{return {}},
	pageSize:10,
	fieldInfo:()=>[],
	colwidth:"auto",

})

const data = reactive({
	fieldInfo: [new Field()],
	tableData:[],
	pageSize:10,
	currentPage:1,
	total:0
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
	config.params.action = "filter"
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
	if (props.filters){
		data.pageSize = props.pageSize
		getFieldInfo()
		filterData()
	}else{
		data.tableData = []
		data.fieldInfo =[ new Field()]
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


