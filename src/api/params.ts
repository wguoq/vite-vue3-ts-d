class Query{
	service=""
	action=""
	filters={}
	page= {
		"pageSize": 10,
		"pageNumber": 1,
		"pageable": 'true'
	}
}

class Commit{
	service= ""
	action = ""
	data = ""
}

export const  query = new Query();
export const  commit = new Commit();

export default{query,commit};
