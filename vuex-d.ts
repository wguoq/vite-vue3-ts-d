//这个文件是告诉ts如果限制store里面的数据类型，非必须
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
	interface userInfo {
		userid: string,
		username: string,
		password: string
	}
	
	interface ComponentCustomProperties{
		$store: Stroe<userInfo>
	}
}