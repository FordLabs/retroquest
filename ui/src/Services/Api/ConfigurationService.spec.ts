import axios from 'axios';

import configurationService from './ConfigurationService';

describe('the configuration service', () => {
	it('should perform a GET to /api/config', async () => {
		let value = { data: { propertyName: 'propertyValue' } };
		axios.get = jest.fn().mockResolvedValue(value);
		await configurationService
			.get()
			.then((result) => expect(result).toEqual(value.data));
		expect(axios.get).toHaveBeenCalledWith('/api/config');
	});
});
