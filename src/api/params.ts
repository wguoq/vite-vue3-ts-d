class Query{
	service=""
	action=""
	filters={}
	page= {
		"pageSize": 10,
		"pageNumber": 1,
	}
}

class Commit{
	service= ""
	action = ""
	data = ""
}

export default{Query,Commit};
