import { ElMessage } from 'element-plus';
import { ElLoading } from 'element-plus'
import axios from 'axios';
import Cookies from 'js-cookie'


export function httpError(error:any){
	if (error.response) {
		const errorcode = error.response.status
		//console.log(error.response.data);
		//console.log(errorcode);
		//console.log(error.response.headers);
		switch (errorcode) {
		  case 401:
			ElMessage.error('401 认证失败，无法访问系统资源')
			  break;
		  case 403:
			ElMessage.error('403 当前操作没有权限')
			  break;
		  case 404:
			ElMessage.error("404 访问资源不存在")
			  break;
		  case 500:
			ElMessage.error('500 系统错误')
			  break;
		}
	}else{
		ElMessage.error(error.message)
	}
}

export function axiosSend(config: object){
		//axios.defaults.xsrfCookieName = 'csrftoken';axios.defaults.xsrfHeaderName = 'X-CSRFToken';
		//这2句会自动设置csrftoken到headers里
		axios.defaults.xsrfCookieName = 'csrftoken';
		axios.defaults.xsrfHeaderName = 'X-CSRFToken';
		axios.defaults.withCredentials = true
		const axios_inst = axios.create();
		//请求拦截器处理post时需要添加的头信息
		axios_inst.interceptors.request.use((config: any) => {
			if (config.method==="post"){
				//要添加这句才能发送和接收json格式数据
				config['headers']['Content-Type'] = 'application/json'
			}
			return config;
		});
		//响应拦截器
		axios_inst.interceptors.response.use((response:any) => {
			return response
		});
		
		//axios是默认异步的，不能通过return来返回response，所以要在使用的页面用then获取
		return axios_inst.request(config).catch(function (error) {
				httpError(error)
			});
	}
	
	
export function loading(text?:string = "loading...", timeout?: number = 30000){ 
	const loading = ElLoading.service({
		lock: true,
		text: text,
		background: 'rgba(0, 0, 0, 0.7)',
	});
	setTimeout(() => {
	    loading.close();
	  }, timeout);
	return loading
}