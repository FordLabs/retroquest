import axios from "axios";

interface Config {
	survey_link_href: string;
}

const configurationService = {
	get(): Promise<Config> {
		return axios.get('/api/config').then(response => response.data);
	}
}

export default configurationService;
