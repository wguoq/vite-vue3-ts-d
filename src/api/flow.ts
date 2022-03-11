class Query{
	url="/flow/query/"
	method="get"
	baseURL="/api"
	timeout=5000
	params={
		service:"",
		action:"",
		filters:{},
		pageSize:1,
		pageNumber:1,
	}
}

class Commit{
	url="/flow/commit/"
	method="post"
	baseURL="/api"
	timeout=5000
	data={
		service:"",
		action:"",
		data :{},
	}
}

export default {Query, Commit}