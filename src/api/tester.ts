const queryCase = {
	url: "/testcase/query/",
	method: "get",
	baseURL: "/api",
	timeout: 5000,
	params:""
}

const commitTester = {
	url: "/tester/commit/",
	method: "post",
	baseURL: "/api",
	timeout: 5000,
	data:""
}

export default {queryCase, commitTester}