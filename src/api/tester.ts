class Query{
	url="/testcase/query/"
	method="get"
	baseURL="/api"
	timeout=5000
	params=""
}

class Commit{
	url="/tester/commit/"
	method="post"
	baseURL="/api"
	timeout=5000
	data=""
}

export default {Query, Commit}