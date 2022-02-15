<script lang="ts" setup>
import IndexSide from 'components/IndexSide.vue'
import IndexHeader from 'components/IndexHeader.vue'

let clientHeight:any
let mainHeight:any

function setHeight(){
	clientHeight = `${document.documentElement.clientHeight}` 
	mainHeight = clientHeight-20+"px"
	// console.log(mainHeight);
}
setHeight()

</script>

<template>	
	<!-- el-container 要固定顶部和侧边栏需要设置一个高度属性，可以动态获取屏幕高度 -->
	<el-container :style="{'height': mainHeight}">
		<IndexSide></IndexSide>
		<el-container>
			<el-header style="height: 56px;">
				<IndexHeader></IndexHeader>
			</el-header>
			<el-divider style="margin: 1px"></el-divider>
			<el-main style="background-color: #fafafa;">
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
	
</template>

<style scoped>
	.el-header {
	/*  background-color: #48dada; */
	  color: var(--el-text-color-primary);
	  line-height: 50px;
	}

	.el-aside {
	  color: var(--el-text-color-primary);
	}
</style>
