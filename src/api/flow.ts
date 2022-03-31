class Query{
	url="/flow/query/"
	method="get"
	baseURL="/api"
	timeout=5000
	params={
		repo:"",
		action:"",
		filters:{},
		pageSize:5,
		pageNumber:1,
	}
}

class Commit{
	url="/flow/commit/"
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