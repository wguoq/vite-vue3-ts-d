<script setup lang="ts">
	import { ref,reactive } from 'vue'
	import  {Bell,DArrowLeft,DArrowRight} from '@element-plus/icons-vue'
	//isCollapse = ref(true)这样写会导致响应失效
	// let isCollapse = ref(true)
	// const abc = ref("qqqqqqq")
	const data = reactive({
		isCollapse: false,
	})
	const clickCollapse = () => {
		data.isCollapse = !data.isCollapse
		//console.log(data.isCollapse)
	}
	
</script>

<template> 
	<el-aside width="data.isCollapse ? '50px':'auto'" >
		<el-row>
			<el-col :span="24" style="height: 56px;">
				<div style="text-align: left; margin-left: 10px; margin-top: 15px;">
					<el-button 
					id="arrow-button" 
					:icon="data.isCollapse ? DArrowRight:DArrowLeft" 
					size="large" 
					circle 
					@click="clickCollapse">
					</el-button>
				</div>
			</el-col>
		</el-row>
		<!-- el-menu
		要直接跳转路由需要写 :default-active="$route.path"和router
		控制收起展开 :collapse="isCollapse"
		取消边框 style="border-right: 0px" 
		水平排列 mode="horizontal"-->
		<el-menu
			class="aside-el-menu"
			:default-active="$route.path"
			router
			:collapse="data.isCollapse"
			style="border-right: 0px"
		>
			<el-menu-item index="/home">
				<el-icon><Bell /></el-icon>
				<span>Home</span>
			</el-menu-item>
			
			<el-menu-item index="/tester" >
				<el-icon><Bell /></el-icon>
				<span>Tester</span>
			</el-menu-item>

			<el-sub-menu index="">
				<template #title>
					<el-icon><Bell /></el-icon>
					<span>Flow</span>
				</template>
				<el-menu-item-group>
					<template #title>
						<el-menu-item index="/fwdesign">Flow Design</el-menu-item>
						<el-menu-item index="/flowinst">Flow Inst</el-menu-item>
					</template>
					
				</el-menu-item-group>
			</el-sub-menu>
			
			<el-sub-menu index="/test">
				<template #title>
					<el-icon><Bell /></el-icon>
					<span>Navigator Four</span>
				</template>
				<el-menu-item-group>
					<template #title><span>Group One</span></template>
					<el-menu-item index="/test">test</el-menu-item>
					<el-menu-item index="4-2">item 4-2</el-menu-item>
				</el-menu-item-group>
				<el-menu-item-group title="Group Two">
					<el-menu-item index="4-3">item 4-3</el-menu-item>
				</el-menu-item-group>
				<el-sub-menu index="4-4">
					<template #title><span>item 4-4</span></template>
					<el-menu-item index="4-4-1">item 4-4-1</el-menu-item>
				</el-sub-menu>
			</el-sub-menu>
		</el-menu>
	</el-aside>
</template>



<style scoped>
	.aside-el-menu:not(.el-menu--collapse) {
	  width: 200px;
	  min-height: 400px;
	}
	#arrow-button {
		border: none;
		background-color: none;
	}
	#arrow-button:focus {
		color: black;
		background-color: transparent;
	}
	#arrow-button:hover{
		color: black;
		background-color: transparent;
	}
</style>



