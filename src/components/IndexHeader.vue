<script lang="ts" setup>
import { ref } from 'vue'
import  { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const input = ref('')
const toHome = ()=>{
	router.push({name: 'home'})
}
</script>

<template>
	<el-row>
		<el-col :span="8">
			<div style="text-align: left; font-size: 15px">
<!-- 				<router-link to="/home">to home</router-link> &nbsp;
				<router-link to="/about">to about</router-link> &nbsp;
				<el-button @click="toHome">to home</el-button> &nbsp;
				<el-button @click="apiTest">apiTest</el-button> -->
			</div>
		</el-col>
		<el-col :span="8">
			<div style="text-align: left; font-size: 15px">
				<el-input
					v-model="input"
					class="w-50 m-2"
					placeholder="Please input"
					clearable
					:prefix-icon="Search"
				/>
			</div>
		</el-col>
		<el-col :span="8">
			<div style="text-align: right; font-size: 15px">
				<el-dropdown>
					<el-icon style="margin-right: 20px"><share /></el-icon>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item>Weibo</el-dropdown-item>
							<el-dropdown-item>QQ</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</el-col>
	</el-row>
</template>


<style scoped>
</style>
