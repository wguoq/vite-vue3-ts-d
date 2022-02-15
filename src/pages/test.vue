<template>
  <el-form ref="formRef" :model="form" label-width="120px">
	  <el-row>
		  <el-col :span="12">
			  <el-form-item label="code">
			    <el-input v-model="form.code"></el-input>
			  </el-form-item>
		  </el-col>
	  </el-row>
  </el-form>
  <el-divider></el-divider>
  
  <div style="text-align: left; margin: 5px;" >
  	<el-button type="primary" plain @click="form.dialogTableVisible = true">open</el-button>
  </div>
  
  <el-dialog v-model="form.dialogTableVisible" title="address">
 
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
	<el-table-column property="code" label="Code" width="120" />
    <el-table-column property="date" label="Date" width="120" />
    <el-table-column property="name" label="Name" width="120" />
    <el-table-column property="address" label="Address" />
</el-table>
  <el-divider></el-divider>
 
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
const dialogTableVisible = ref(false)
// do not use same name with ref
const form = reactive({
  name: '',
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
import { ref } from 'vue'
import type { ElTable } from 'element-plus'

interface User {
  date: string
  name: string
  address: string
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
  console.log(form.multipleSelection)
}
const add = ()=>{
	// console.log(multipleSelection.value)
	// form.singleTableData = multipleSelection
	// console.log(form.multipleSelection)
	for (let i of  form.multipleSelection) {
		console.log(i)
		i.code = form.code
		console.log(i)
		form.singleTableData.push(i)
	}
	form.dialogTableVisible = false
	

	
}
const tableData: User[] = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',

  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-08',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-06',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-07',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>