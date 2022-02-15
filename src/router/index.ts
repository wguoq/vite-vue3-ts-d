//npm install vue-router@next --save
import { createRouter, createMemoryHistory, createWebHistory} from 'vue-router'
import index from 'pages/index.vue'

const routes = [
	{
		path: '/',
		name: 'index',
		component: index,
		//一进来就重定向到/home
		redirect: '/home',
		//如果让根目录使用router-view，然后在根目录的组件里面也使用第二层的router-view，就需要写在children里面
		children:[
			{
				path: '/home',
				name: 'home',
				component: ()=> import('../pages/home.vue'),
			},
			{
				path: '/tester',
				name: 'tester',
				component: ()=> import('../pages/tester.vue'),
			},
			{
				path: '/fwdesign',
				name: 'flowdesign',
				component: ()=> import('../pages/flow_design.vue'),
			},
			{
				path: '/nodesign',
				name: 'nodedesign',
				component: ()=> import('../pages/node_design.vue'),

			},
			{
				path: '/test',
				name: 'test',
				component: ()=> import('../pages/test.vue'),
			
			},
		]
	},
	
]


const router = createRouter({
	// 这个模式会导致url不变
	//history: createMemoryHistory(),
	//HTML5 模式
	history: createWebHistory(),
	// (缩写) 相当于 routes: routes
	routes
})

export default router