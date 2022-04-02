<script lang="ts" setup>
// 只有query模式
// filters为null时不会发起查询数据，这是为了作为上下列表的下表时一开始不会查询
// fieldInfo为null时才会发起查询fieldInfo，这是为了组合多表字段时从父组件获取
// 通过rowClick事件把row传出去就行了
import { reactive, watch } from 'vue'
import { axiosSend, loading } from 'utils/http.ts'
import EditForm from 'components/EditForm.vue';

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
	repo: string,
	filters?: {[key: string]: any;}|null,
	pageSize:number,
	fieldInfo?: Field[]|null,
	noEditFields?: string[],
	colwidth?: any,
}

const props = withDefaults(defineProps<Props>(),{
	api:"",
	repo: "",
	filters: null,
	pageSize:5,
	fieldInfo:null,
	noEditFields:()=>[],
	colwidth:"auto",
})

const data = reactive({
	fieldInfo: [new Field()],
	tableData:[],
	pageSize:5,
	currentPage:1,
	total:0,
	pkName:"",
	editDialog:false,
	delTip:false,
})

const current = reactive({
	page:1,
	row:null
})

defineExpose({
	current
})

const handleCurrentChange = (currentRow:any,oldCurrentRow:any) => {
	current.row = currentRow
 	emits('currentChange',currentRow,oldCurrentRow)
}

const rowClick = (row:any) => {
	current.row = row
	emits('rowClick',row)
}

const emits = defineEmits<{
	(event: 'rowClick',row:any):void,
	(event: 'currentChange',currentRow:any,oldCurrentRow:any):void,
}>()

const filterData=()=>{
	let config = new props.api.Query()
	config.params.repo = props.repo
	config.params.action = "filter"
	config.params.filters = props.filters
	config.params.pageSize = data.pageSize
	config.params.pageNumber = current.page
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
	current.row = null
	//处理FieldInfo,null就去查询
	if(!props.fieldInfo){
		let config = new props.api.Query()
		config.params.repo = props.repo
		config.params.action = "getFieldInfo"
		let load = loading()
		axiosSend(config).then((res:any)=>{
			load.close()
			if(res){
				data.fieldInfo = res.data.fields
				getPkName()
			}else{
				data.fieldInfo = []
			}
			// 处理filters，不为null就查询
			if (props.filters){
				filterData()
			}else{
				data.tableData = []
			}
		})
	}else{
		data.fieldInfo = props.fieldInfo
		getPkName()
		if (props.filters){
				filterData()
			}else{
				data.tableData = []
			}
	}
}

function getPkName(){
	for(let f of data.fieldInfo){
		if (f.primary_key){
			data.pkName = f.name
			break
		}
	}
}

const currentPageChange =()=>{
	filterData()
}

function editRow(row:any){
	current.row = row
	data.editDialog = true
}

function afterSave(){
	data.editDialog = false
	filterData()
}
function delTip(row:any){
	current.row = row
	data.delTip = true
	
}
function delCurrentRow(){
	let config = new props.api.Commit()
	config.data.repo = props.repo
	config.data.action = 'del'
	config.data.data = {'pk': current.row[data.pkName]}
	let load = loading()
	axiosSend(config).then((res:any)=>{
		load.close()
		data.delTip = false
		filterData()
	})
}

init()
watch(props,()=>init())

</script>

<template >
	<el-dialog
		v-model="data.delTip"
		width="30%"
		:close-on-click-modal="false"
		destroy-on-close
		center
	>
		<span>删除数据?</span>
		<template #footer>
		<span class="dialog-footer">
			<el-button @click="data.delTip = false">Cancel</el-button>
			<el-button type="primary" @click="delCurrentRow"
			>Confirm</el-button
			>
		</span>
		</template>
	</el-dialog>

	<el-dialog 
	v-model="data.editDialog" 
	:close-on-click-modal="false"
	destroy-on-close
    center
	>
		<EditForm
		ref="DialogForm" 
		action = "save"
		:api = props.api
		:repo = props.repo
		:pk = current.row[data.pkName]
		:disabledLabel= props.noEditFields
		@afterSave = "afterSave"
		></EditForm>
	</el-dialog>

	<el-table
		:data="data.tableData"
		style="width: 100%"
		max-height="300"
		highlight-current-row
		border 
		@current-change="handleCurrentChange"
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
		<el-table-column v-if="data.tableData.length > 0" fixed="right" label="操作" width="140" >
			<template #default="scope">
			<el-row>
				<el-col :span="11">
					<el-button
						type="primary"
						size="small"
						@click="editRow(scope.row)"
						>
						编辑
					</el-button>
				</el-col>
				<el-col :span="11">
					<el-button
						type="primary"
						size="small"
						@click="delTip(scope.row)"
						>
						删除
					</el-button>
				</el-col>
			</el-row>
			</template>
			</el-table-column>
			<slot v-if="data.tableData.length > 0" name="SingleTableCol" ></slot>
	</el-table>
	
	<el-row style="text-align: left; margin-top: 5px;">
		<el-pagination
		v-model:currentPage="current.page"
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


