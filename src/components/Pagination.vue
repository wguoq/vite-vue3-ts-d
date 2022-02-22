<script lang="ts" setup>
import { reactive } from 'vue'

interface Props{
	pagesize?: number
	small?: boolean,
	disabled?: boolean,
	background?: boolean,
	total: number,
}

const props = withDefaults(defineProps<Props>(),{
	pagesize: 10,
	small: false,
	disabled: false,
	background: true,
	total:0,
})

const data = reactive({
	currentPage: 0
})

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
</script>

<template>
    <el-pagination
      v-model:currentPage="data.currentPage"
      :page-size="props.pagesize"
      :small="props.small"
      :disabled="props.disabled"
      :background="props.background"
      layout="total, prev, pager, next"
      :total="props.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
</template>

<style>
</style>
