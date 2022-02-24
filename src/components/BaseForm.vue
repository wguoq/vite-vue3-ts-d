<script lang="ts" setup>
import { reactive } from 'vue'

interface Props{
	formData: {},
	disabledLabel: []
}

const props = withDefaults(defineProps<Props>(),{
	formData: {},
	disabledLabel: []
})


const emits = defineEmits(['save', 'cancel'])

const Save =()=>{
	emits('save')
}

const Cancel =()=>{
	emits('cancel')
}

const isdisabled =(data)=>{
	for(let a of props.disabledLabel){
		console.log(a)
		if (a === data){
			return true
		}
	}
	return false
}
</script>

<template>
		<el-form 
		label-width="auto" 
		label-position="right" >
			<el-row>
			<template v-for=" (value,index) in props.formData " >
				<el-col :span="11" style="margin: 2px;">
					<el-form-item :label="index" >
						<el-input
						:disabled="isdisabled(index)"
						v-model="props.formData[index]"
						clearable
						>
						</el-input>
					</el-form-item>
				</el-col>	
			</template>
			</el-row>
			<el-row>
				<el-col :span="11" style="text-align: right; margin: 5px;">
					  <el-button type="primary" @click="Save">Save</el-button>
				</el-col>
				<el-col :span="11" style="text-align: left; margin: 5px;">
					  <el-button  @click="Cancel">Cancel</el-button>
				</el-col>
			</el-row>
		</el-form>
</template>


