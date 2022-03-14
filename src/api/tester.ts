class Query{
	url="/testcase/query/"
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