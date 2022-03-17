class Query{
	url="/tester/query/"
	method="get"
	baseURL="/api"
	timeout=5000
	params={
		service:"",
		action:"",
		filters:{},
		pageSize:5,
		pageNumber:1,
	}
}

class Commit{
	url="/tester/commit/"
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