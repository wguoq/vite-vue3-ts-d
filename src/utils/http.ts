import { ElMessage } from 'element-plus';
import { ElLoading } from 'element-plus'
import axios from 'axios';
// import Cookies from 'js-cookie'

class StatuCsodes{

    // Informational.
    100=['continue']
    101=['switching_protocols']
    102=['processing']
    103=['checkpoint']
    122=['uri_too_long', 'request_uri_too_long']
    200=['ok', 'okay', 'all_ok', 'all_okay', 'all_good', '\\o/', '✓']
    201=['created',]
    202=['accepted',]
    203=['non_authoritative_info', 'non_authoritative_information']
    204=['no_content',]
    205=['reset_content', 'reset']
    206=['partial_content', 'partial']
    207=['multi_status', 'multiple_status', 'multi_stati', 'multiple_stati']
    208=['already_reported',]
    226=['im_used',]

    // Redirection.
    300=['multiple_choices',]
    301=['moved_permanently', 'moved', '\\o-']
    302=['found',]
    303=['see_other', 'other']
    304=['not_modified',]
    305=['use_proxy',]
    306=['switch_proxy',]
    307=['temporary_redirect', 'temporary_moved', 'temporary']
    308=['permanent_redirect',
          'resume_incomplete', 'resume',]  // These 2 to be removed in 3.0

    // Client Error.
    400=['bad_request', 'bad']
    401=['unauthorized',]
    402=['payment_required', 'payment']
    403=['forbidden',]
    404=['not_found', '-o-']
    405=['method_not_allowed', 'not_allowed']
    406=['not_acceptable',]
    407=['proxy_authentication_required', 'proxy_auth', 'proxy_authentication']
    408=['request_timeout', 'timeout']
    409=['conflict',]
    410=['gone',]
    411=['length_required',]
    412=['precondition_failed', 'precondition']
    413=['request_entity_too_large',]
    414=['request_uri_too_large',]
    415=['unsupported_media_type', 'unsupported_media', 'media_type']
    416=['requested_range_not_satisfiable', 'requested_range', 'range_not_satisfiable']
    417=['expectation_failed',]
    418=['im_a_teapot', 'teapot', 'i_am_a_teapot']
    421=['misdirected_request',]
    422=['unprocessable_entity', 'unprocessable']
    423=['locked',]
    424=['failed_dependency', 'dependency']
    425=['unordered_collection', 'unordered']
    426=['upgrade_required', 'upgrade']
    428=['precondition_required', 'precondition']
    429=['too_many_requests', 'too_many']
    431=['header_fields_too_large', 'fields_too_large']
    444=['no_response', 'none']
    449=['retry_with', 'retry']
    450=['blocked_by_windows_parental_controls', 'parental_controls']
    451=['unavailable_for_legal_reasons', 'legal_reasons']
    499=['client_closed_request',]

    // Server Error.
    500=['internal_server_error', 'server_error', '/o\\', '✗']
    501=['not_implemented',]
    502=['bad_gateway',]
    503=['service_unavailable', 'unavailable']
    504=['gateway_timeout',]
    505=['http_version_not_supported', 'http_version']
    506=['variant_also_negotiates',]
    507=['insufficient_storage',]
    509=['bandwidth_limit_exceeded', 'bandwidth']
    510=['not_extended',]
    511=['network_authentication_required', 'network_auth', 'network_authentication']
}


function httpError(error:any){
	const codes = new StatuCsodes()
	if (error.response) {
		const errorcode = error.response.status
		for (let index in codes){
			if (errorcode==index){
				ElMessage.error(errorcode + ': ' + codes[index][0])
				break
			}
		}
		// switch (errorcode) {
		//   case 401:
		// 	ElMessage.error('401 认证失败，无法访问系统资源')
		// 	  break;
		//   case 403:
		// 	ElMessage.error('403 当前操作没有权限')
		// 	  break;
		//   case 404:
		// 	ElMessage.error("404 访问资源不存在")
		// 	  break;
		//   case 500:
		// 	ElMessage.error('500 系统错误')
		// 	  break;
		// }
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
	
	
export function loading(text:string = "loading...", timeout: number = 10000){ 
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