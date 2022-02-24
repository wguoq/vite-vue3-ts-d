class Query{
	url="/flow/query/"
	method="get"
	baseURL="/api"
	timeout=5000
	params=""
}

class Commit{
	url="/flow/commit/"
	method="post"
	baseURL="/api"
	timeout=5000
	data=""
}

export default {Query, Commit}