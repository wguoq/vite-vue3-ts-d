class FieldInfo{
	url="/testcase/fields"
	method="get"
	baseURL="/api"
	timeout=5000
	params={
		repo:"",
		replaced: 0,
	}
}

class Query{
	url="/testcase/query"
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
	url="/testcase/save"
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
	url="/testcase/commit"
	method="post"
	baseURL="/api"
	timeout=5000
	data={
		action:"",
		data :{},
	}
}

export default {FieldInfo, Query, Save, Commit}