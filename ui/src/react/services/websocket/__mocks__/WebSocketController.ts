export const mockClient = {
  activate: jest.fn(),
  deactivate: jest.fn().mockResolvedValue({}),
  subscribe: jest.fn(),
};

const WebSocketController = {
  getClient: () => mockClient,
};

export default WebSocketController;
