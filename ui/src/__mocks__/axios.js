const axios = {
	get: jest.fn(),
	post: jest.fn(),
	put: jest.fn(),
	delete: jest.fn(),
	interceptors: {
		request: {
			use: jest.fn(),
		},
		response: {
			use: jest.fn(),
		},
	},
};

export default axios;
