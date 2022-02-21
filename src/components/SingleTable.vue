<script lang="ts" setup>
import { ref,reactive } from 'vue'
import type { ElTable } from 'element-plus'
import { ElMessage } from 'element-plus';

const data = reactive({
	currentRow: ""
})

const handleCurrentChange = (val: any | undefined) => {
  data.currentRow = val
  emits('rowClick')
}

interface Props{
	labels: [],
	tableData: [],
}

const props = withDefaults(defineProps<Props>(),{
	labels:["label1","label2","label3"],
	tableData: [
		{
		  label1: "1",
		  label2: "2",
		  label3: "3",
		},
	]
})

defineExpose({
	data
})

const emits = defineEmits<{
	(event: 'rowClick'):void,
}>()

const show =()=>{
	ElMessage.success("table自己的按钮")
}
</script>

<template>
	<el-table
		:data="props.tableData"
		style="width: 100%"
		max-height="500"
		highlight-current-row
		border 
		@current-change="handleCurrentChange"
	>  
		<template v-for="label in props.labels">
			<el-table-column 
			:property="label" 
			:label="label" 
			width="auto" 
			show-overflow-tooltip 
			sortable>
				<!-- 要把json对象转成string才能显示出来 -->
				<!-- #default="scope" 可以用scope.row来获取当前行数据scope.$index获取表格index -->
				<template #default="scope">
					<span>
						{{scope.row[label]}}
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
					<el-button
						type="text"
						size="small"
						@click="show()"
						>
						table自己的按钮
					</el-button>
			</template>
		</el-table-column>
		<slot name="columnslot"></slot>
	</el-table>
</template>


