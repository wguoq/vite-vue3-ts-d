<template>
  <el-form ref="formRef" :model="form" label-width="120px">
	  <p>组件表</p>
	  <el-row>
		  <el-col :span="12">
			  <el-form-item label="组件code">
			    <el-input v-model="form.code"></el-input>
			  </el-form-item>
			  <el-form-item label="组件name">
			    <el-input v-model="form.name"></el-input>
			  </el-form-item>
		  </el-col>
	  </el-row>
	<el-button type="primary" plain>save</el-button>
  </el-form>

  <el-divider></el-divider>
  
  <div style="text-align: left; margin: 10px;" >
  	<el-button type="primary" plain @click="form.dialogTableVisible = true">open</el-button>  {{form.code}}
  </div>
  <p>组件和参数关系表</p>
  <el-dialog v-model="form.dialogTableVisible" title="参数表" :close-on-click-modal="false">
 
  <div style="text-align: left; margin: 5px;" >
  	<el-button type="primary" plain @click="add">add</el-button>
  </div>
  
  <el-table
    ref="multipleTableRef"
    :data="tableData"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
	<el-table-column property="id" label="id" width="120" />
   <el-table-column label="Date" width="120">
      <template #default="scope">{{ scope.row.date }}</template>
    </el-table-column>
    <el-table-column property="name" label="Name" width="120" />
    <el-table-column property="address" label="Address" show-overflow-tooltip />
  </el-table>
  </el-dialog>
  

<el-table
    ref="singleTableRef"
    :data="form.singleTableData"
    highlight-current-row
    style="width: 100%"
    @current-change="handleCurrentChange"
  >
    <el-table-column type="index" width="50" />
	<el-table-column property="code" label="组件code" width="auto" />
    <el-table-column property="id" label="参数id" width="auto" />
<!--    <el-table-column property="name" label="Name" width="120" />
    <el-table-column property="address" label="Address" /> -->
</el-table>
  <el-divider></el-divider>
 
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { ref } from 'vue'
import type { ElTable } from 'element-plus'

interface form {
  name: string,
  code: string,
  region: string,
  date1: string,
  date2: string,
  delivery: boolean,
  type: any[],
  resource: string,
  desc: string,
  multipleSelection: User[],
  singleTableData: Test[],
  dialogTableVisible: boolean,
}

const form = reactive<form>({
  name: "",
  code: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
  multipleSelection: [],
  singleTableData: [],
  dialogTableVisible: false,
})

const onSubmit = () => {
  console.log('submit!')
}


interface User {
	id: number
  date: string
  name: string
  address: string
}

interface Test {
	id?: any
  code?:any
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const toggleSelection = (rows?: User[]) => {
  if (rows) {
    rows.forEach((row) => {
      // TODO: improvement typing when refactor table
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      multipleTableRef.value!.toggleRowSelection(row, undefined)
    })
  } else {
    multipleTableRef.value!.clearSelection()
  }
}
const handleSelectionChange = (val: User[]) => {
  form.multipleSelection = val
}
const add = ()=>{
	// console.log(multipleSelection.value)
	// form.singleTableData = multipleSelection
	// console.log(form.multipleSelection)
  let i:User
  let ax:Test = {}
	for (i of form.multipleSelection) {
		ax.code = form.code
    ax.id = i.id
		form.singleTableData.push(ax)
	}
	form.dialogTableVisible = false
	

	
}
const tableData: User[] = [
  {
	  id: 1,
    date: '2016-05-03',
    name: '参数1',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
	  id: 2,
    date: '2016-05-02',
    name: '参数2',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
	  id: 3,
    date: '2016-05-04',
    name: '参数3',
    address: 'No. 189, Grove St, Los Angeles',

  },
  {
	  id: 4,
    date: '2016-05-01',
    name: '参数4',
    address: 'No. 189, Grove St, Los Angeles',
  },

]
</script>