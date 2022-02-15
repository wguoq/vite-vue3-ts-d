<script setup lang="ts">
	//ts语法要求script必须在第一行
	//setup语法糖:可省略components的声明;import时必须写上.vue并且在tscongfig里配置识别.vue
	// This starter template is using Vue 3 <script setup> SFCs
	// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
	import HelloWorld from '../components/HelloWorld.vue'

	//定义一个方法,接收一个参数paramA
	const hello = (paramA:string)=>{
		console.log('这是index的方法hello '+ paramA)
		helloWorld.value.childProp = '把子组件的属性childProp值改为hello'
	}
	
	//reactive用于创建数组或者对象
	import { reactive } from 'vue'
	//变量定义
	const data = reactive({
		num: 100,
		user:{
			name: '张三'
		},
		arr: [1,2,'a','b']
	})
	
	let msg = '这是index.vue的msg'
	//要在父组件调用子组件暴露的事件和属性需要
	//ref用于创建一个响应式数据，当数据发生改变时，Vue会自动更新UI
	import { ref } from 'vue'
	const helloWorld = ref()
	//生命周期钩子onMounted=这个页面加载完成
	import { onMounted, onUnmounted} from 'vue' 
	onMounted(()=>{
		console.log('这是onMounted钩子');
		console.log('这是调用子组件的属性: '+ helloWorld.value.childProp)
		console.log('这是调用子组件的方法: ')
		helloWorld.value.childFun()
	})
	//生命周期钩子created=这个页面创建时,加载完成之前
	//setup语法糖中不需要定义created,所有function()都是在created时开始执行
	function testcreated(paramA:string){
		console.log('这是testcreated方法' + paramA)
	}
	testcreated("testcreated")
	
	//生命周期
	// beforeCreate -> use setup()
	
	// created -> use setup()
	
	// beforeMount -> onBeforeMount
	
	// mounted -> onMounted
	
	// beforeUpdate -> onBeforeUpdate
	
	// updated -> onUpdated
	
	// beforeUnmount -> onBeforeUnmount
	
	// unmounted -> onUnmounted
	
	// errorCaptured -> onErrorCaptured
	
	// renderTracked -> onRenderTracked
	
	// renderTriggered -> onRenderTriggered
	
	//使用store,ts语法默认导入index.ts文件
	import { useStore } from 'store'

	const store = useStore() 

	console.log("调用store userName ",store.getters.userName);
	console.log("调用store: ",store.state.csrftoken);
</script>

<template>
 <!-- 给组件传入属性值: text直接输入值;msg调用msg变量; @使用子组件定义的接收事件把hello方法传过去
 ref="helloWorld"是给组件一个别名方便调用;使用helloWorld.value.属性|方法调用-->
	<HelloWorld ref="helloWorld" :msg=msg  @hello='hello' ></HelloWorld>
	<p>{{data.num}}</p>
	<p>{{data.user.name}}</p>
</template>

<style>
</style>
