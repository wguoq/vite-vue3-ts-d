import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	// npm run dev 时 command=serve, mode=development
	// npm run build 时 command=build, mode=production
	// console.log(command, mode)
	// console.log(process.cwd())
	// console.log(loadEnv(mode, process.cwd()))
	if (command === 'serve'){
		return {
			plugins: [vue()],
			//server是前端自己的配置
			server: {
				// hostname: '0.0.0.0',
				host: "127.0.0.1",
				// loadEnv() 检查process.cwd() 根目录路径下.env.development.local、.env.development、.env.local、.env这四个环境文件。
				// 输出NODE_ENV和VITE_开头的键值对。
				// VITE_开头的键值对后面的不会覆盖前面的。
				// NODE_ENV的值后面的会覆盖前面的。
				port: Number(loadEnv(mode, process.cwd()).VITE_APP_PORT), 
				strictPort: true,//端口已被占用则会直接退出
				// 是否自动在浏览器打开
				open: true,
				// 是否开启 https
				https: false,
				// 服务端渲染
				// ssr: false,
				//proxy是请求后端服务器的配置，可以有多个
				proxy: {
					'/api': {
						target: loadEnv(mode, process.cwd()).VITE_API_BASE_URL,
						changeOrigin: true, //跨域配置
						ws: true,
						rewrite: (pathStr) => pathStr.replace('/api', '')
					},
				},
				hmr: {
					overlay: false //打开服务器错误置顶显示
				}
			},
			resolve: {
				//文件夹别名
				alias: {
					'@': path.resolve(__dirname, './src'),
					layouts: path.resolve(__dirname, './src/layouts'),
					pages: path.resolve(__dirname, './src/pages'),
					components: path.resolve(__dirname, './src/components'),
					utils: path.resolve(__dirname, './src/utils'),
					assets: path.resolve(__dirname, "./src/assets"),
					store: path.resolve(__dirname, "./src/store"),
					api: path.resolve(__dirname, "./src/api"),
				}
			},
		}
	} else {
		return {
			plugins: [vue()],
			server: {
				// hostname: '0.0.0.0',
				host: "127.0.0.1",
				port: Number(loadEnv(mode, process.cwd()).VITE_APP_PORT), 
				strictPort: true,
				open: false,
				https: false,
				proxy: {
					'/api': {
						target: loadEnv(mode, process.cwd()).VITE_API_BASE_URL,
						changeOrigin: true, 
						ws: true,
						rewrite: (pathStr) => pathStr.replace('/api', '')
					},
				},
				hmr: {
					overlay: true 
				}
			},
			resolve: {
				alias: {
					'@': path.resolve(__dirname, './src'),
					pages: path.resolve(__dirname, './src/pages'),
					components: path.resolve(__dirname, './src/components'),
					utils: path.resolve(__dirname, './src/utils'),
					assets: path.resolve(__dirname, "./src/assets"),
					store: path.resolve(__dirname, "./src/store"),
				}
			},
			
		}
	}
})

/*
// vite.config.ts 代理配置
    proxy: { // 代理配置
     '/user': {
     target: 'https://www.baidu.com',
     changeOrigin: true,
     rewrite: (path) => path.replace(/^\/user/, '')
     },
     '/cus': {
     target: 'https://www.taobao.com',
     changeOrigin: true,
     rewrite: (path) => path.replace(/^\/cus/, '')
     }
     },
    
    // 代理接口调用 
    // 1.调用user部分接口
    export function getUser(data: object) {
     return request({
     url: '/user/getUser',
     method: 'get',
     baseURL: '/user',
     data
     })
    }
    // 实际调用地址为
    https://www.baidu.com/user/getUser // /user通过rewrite正则过滤掉了
    
    // 2.调用cus部分接口
    export function getCus(data: object) {
     return request({
     url: '/customer/getCus',
     method: 'get',
     baseURL: '/cus',
     data
     })
    }
    // 实际调用地址为
    https://www.taobao.com/customer/getCus // /cus通过rewrite正则过滤掉了</pre>
*/