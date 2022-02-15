//npm install vuex@next --save
//store 是全局仓库，用来放一些公共的状态属性
import { InjectionKey } from 'vue';
import { useStore as baseUserStore, createStore, Store } from 'vuex';

//定义一个仓库需要使用的数据接口
export interface storedata {
	userid: string,
	username: string,
	usertoken: string,
	csrftoken: string,
}

// 定义注入类型的密钥key
export const key: InjectionKey<Store<storedata>> = Symbol()

// 创建仓库
export const store = createStore<storedata>({
	//state是store的接口，用于对数据赋值
	state: {
		userid: "00000",
		username:'张三',
		usertoken: 'token12345',
		csrftoken: 'csrftoken'
	},
	
	//getters是store的接口，读取store里的数据必须通过这个方法
	getters: {
		//这样写等于是定义了一个属性，不是方法
		userName: (storedata)=>{
			return storedata.username
		},
	},
	//mutations是store的接口，修改store里的数据必须通过这个方法
    mutations: {
		setUserName(storedata, newname: string){
			storedata.username = newname
		},
	},
    actions: {},
})

// 定义暴露出去的useStore函数
export function useStore() {
	return baseUserStore(key)
}
