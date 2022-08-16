import configurationService from "./ConfigurationService";
import axios from "axios";

describe('the configuration service', () => {
	it('should perform a GET to /api/config', () => {
		let value = {data:{propertyName:"propertyValue"}};
		axios.get = jest.fn().mockResolvedValue(value);
		configurationService.get().then(result => expect(result).toEqual(value.data));
		expect(axios.get).toHaveBeenCalledWith('/api/config');
	});
})
