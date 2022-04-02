class Query{
	url="/tester/query/"
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
	url="/tester/commit/"
	method="post"
	baseURL="/api"
	timeout=5000
	data={
		repo:"",
		action:"",
		data :{},
	}
}

export default {Query, Commit}