<script lang="ts" setup>
import { reactive } from 'vue'

interface Props{
	formData: any,
	type?:string,
	disabledLabel?: any[],
	hideLabel?: any[],
	readOnly?: boolean,
	noSave?: boolean,
	noCancel?: boolean,
}

const props = withDefaults(defineProps<Props>(),{
	formData: {},
	type:"text",
	disabledLabel: ()=>[],
	hideLabel: ()=>[],
	readOnly: false,
	noSave: false,
	noCancel: false,
})


const emits = defineEmits(['save', 'cancel'])

const Save =()=>{
	emits('save')
}

const Cancel =()=>{
	emits('cancel')
}

const isInList =(data: any,list: any[])=>{
	for(let a of list){
		if (a == data){
			return true
		}else{
			continue
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
				<el-col :span="11" style="margin: 2px;" v-show="!isInList(index,props.hideLabel)">
					<el-form-item :label="index" >
						<el-input
						:disabled="isInList(index,props.disabledLabel) || readOnly"
						v-model="props.formData[index]"
						clearable
						:type="props.type"
						autosize
						>
						</el-input>
					</el-form-item>
				</el-col>	
			</template>
			</el-row>
			<el-row>
				<el-col :span="11">
					<slot name="form-item-slot"></slot>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11" style="text-align: right; margin: 5px;" v-if="!props.noSave">
					  <el-button type="primary" @click="Save">Save</el-button>
				</el-col>
				<el-col :span="11" style="text-align: left; margin: 5px;" v-if="!props.noCancel">
					  <el-button  @click="Cancel">Cancel</el-button>
				</el-col>
			</el-row>
		</el-form>
</template>


