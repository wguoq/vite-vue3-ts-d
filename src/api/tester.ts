const queryCase = {
	url: "/testcase/query/",
	method: "get",
	baseURL: "/api",
	timeout: 3000,
	params:""
}

const commitTester = {
	url: "/tester/commit/",
	method: "post",
	baseURL: "/api",
	timeout: 3000,
	data:""
}

export default {queryCase, commitTester}