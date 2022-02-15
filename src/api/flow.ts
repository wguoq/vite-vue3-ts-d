const query = {
	url: "/flow/query/",
	method: "get",
	baseURL: "/api",
	timeout: 3000,
	params:""
}

const commit = {
	url: "/flow/commit/",
	method: "post",
	baseURL: "/api",
	timeout: 3000,
	data:""
}

export default {query, commit}