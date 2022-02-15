<script lang="ts" setup>
interface Props{
	size?: any,
	total: any
}

const props = withDefaults(defineProps<Props>(),{
	size:10,
	total:0,
})
</script>

<template>
  <el-pagination
    :page-size="props.size"
	:pager-count="11"
	background
    layout="prev, pager, next"
    :total="props.total"
	style="padding: 0px;"
  >
  </el-pagination>
</template>

<style>
</style>
