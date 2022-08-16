import axios from "axios";

const configurationService = {
	get(){
		return axios.get('/api/config').then(response => response.data);
	}
}

export default configurationService;
