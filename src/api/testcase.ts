class Query{
	url="/testcase/query/"
	method="get"
	baseURL="/api"
	timeout=5000
	params={
		repo:"",
		action:"filter",
		filters:{},
		pageSize:5,
		pageNumber:1,
	}
}

class Commit{
	url="/testcase/commit/"
	method="post"
	baseURL="/api"
	timeout=5000
	data={
		repo:"",
		action:"",
		data :{},
		condition:[],
	}
}

export default {Query, Commit}