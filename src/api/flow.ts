class FieldInfo{
	url="/flow/fields"
	method="get"
	baseURL="/api"
	timeout=5000
	params={
		repo:"",
		replaced: 0,
	}
}

class Query{
	url="/flow/query"
	method="post"
	baseURL="/api"
	timeout=5000
	data={
		repo:"",
		filters:{},
		replaced: 0,
		pageSize:5,
		pageNumber:1,
	}
}

class Save{
	url="/flow/save"
	method="post"
	baseURL="/api"
	timeout=5000
	data={
		repo:"",
		action:"",
		data: {},
		is_group:0,
		condition:[],
	}
}

class Commit{
	url="/flow/commit"
	method="post"
	baseURL="/api"
	timeout=5000
	data={
		action:"",
		data :{},
	}
}

export default {FieldInfo, Query, Save, Commit}