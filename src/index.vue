<template>
	<div>
		<router-view></router-view>
	</div>
</template>

<script lang="ts" setup>
	//调用环境配置文件内容，根据mode不同读取.env.development或者.env.production
const env = import.meta.env
if (env.MODE=="development"){
	console.log(env)
}	  
</script>


<style>
::-webkit-scrollbar{
	width: 8px;
	height: 8px;
	background-color:aliceblue;
}
::-webkit-scrollbar-track{
	border-radius: 1px;
}
::-webkit-scrollbar-thumb{
	border-radius: 1px;
	background:dodgerblue;
}
</style>


