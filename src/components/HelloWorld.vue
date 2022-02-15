<script setup lang="ts">
	//ref用于创建一个响应式简单数据，当数据发生改变时，Vue会自动更新UI
	//reactive则对应对象{}
	import { ref,reactive } from 'vue'
	const countA = ref(0)
	const countB = ref(10)
	//ts里读取ref类型的值需要加个.valueA
	console.log(countB.value)
	//监听变量值的变化
	import { watch, watchEffect } from 'vue'
	//watchEffect 会在一开始就调用一次,所以会打印一次;watchEffect是全局监听
	watchEffect(()=>console.log('watchEffect countA = '+ countA.value, 'watchEffect countB = '+ countB.value))
	//watch 需要指定监听对象,不会在一开始就调用,所有不会打印一次
	watch(countA,(new_, old_)=> console.log('watch countA = '+ new_, old_))
	//加上immediate: true 让 watch在页面刷新之后立刻执行一次,deep: true是为了能监听对象里面的值,比如数组
	watch(countB,(new_, old_)=> {console.log('立刻执行:'+'watch countB = '+ new_, old_)}, {immediate: true, deep: true} )
	//监听多个变量
	watch([countA, countB],(new_, old_)=>console.log('监听多个变量:'+'watch countA = '+ new_[0], old_[0],'watch countB = '+ new_[1], old_[1]))

	//defineProps是setup语法糖的api,用于定义父组件可以传入的属性名,下面是vue写法
	// const props = defineProps({
	// 	msg: String,
	// 	text: {
	// 		type: String,
	// 		default:()=>{return '这是text的默认值'},
	// 	},
	// })
	// console.log(props.text)
	// console.log(props.msg)

	// ts写法,这样可以限制参数的输入类型以及设定必传参数,默认值参数
	// 直接写<{msg:string}>是必传参数,加个问号<{msg?:string}>是可以不传
	// const props = defineProps<{
	// 	msg: (string | number | boolean), 
	// 	text?: any
	// }>()
	//定义一个接口
	interface Props{
		msg?: (string | number | boolean),
		items?: any,
		text?: string
	}
	//withDefaults是vue3提供的专门定义默认值的方法
	withDefaults(defineProps<Props>(),{
		text: "default-Text",
		items: ["de","fault"]
	})
	//withDefaults是vue3提供的专门定义默认值的方法,也可以吧定义和默认值写一起
	// withDefaults(defineProps<{
	// 	msg?: (string | number | boolean),
	// 	items?: string[]
	// 	text?: string
	// }>(),{
	// 	text: 'defaultText',
	// 	items: ['de','fault']
	// })
	
	const abcd = ref<string>('')
	//defineEmits是setup语法糖的api,用于定义父组件可以传入的事件名,vue写法
	//const emits = defineEmits(['helloEmit001',])
	//ts写法,可以限制传入的事件类型和参数,本质是回调
	const emits = defineEmits<{
		(event: 'hello', data: string):void,
	}>()

	//定义这个组件的方法
	const ClickHello = ()=>{
		console.log('ClickHello')
		//调用传入的hello方法
		emits('hello','AAAAA')
	}
	const childFun = ()=>{
		console.log('子组件的方法')
	}
	//defineExpose是setup语法糖的api,用于定义向父组件暴露的属性和方法,让父组件可以修改自己的属性
	let childProp = ref('child-prop')
	defineExpose({
		childProp,
		childFun,
	})
	const check = () => {
		console.log('这是check方法')
		name.value = '这是check方法'
	}
	let name = ref()
</script>

<template>
  <img alt="Vue logo" src="../assets/logo.png" />
  <h1>msg= {{ msg }}</h1>
  <h1>text= {{ text }}</h1>
  <p v-for="(item, index) in items" :key="index">{{item}}</p>
  <button @click="ClickHello">click hello</button>
  <p>{{childProp}}</p>
  <p>
	   <input v-model="name" type="text" @blur="check()" /> 	
  </p>
  <p>{{name}}</p>
  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>See <code>README.md</code> for more information.</p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Docs
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
  </p>

  <button type="button" @click="countA++,countB++">countA is: {{ countA }} &AElig; countB is: {{ countB }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
