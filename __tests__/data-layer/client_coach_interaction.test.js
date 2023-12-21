// get_requested_clients_of_coach.test.js
const user_info = require('../../data_layer/user_info');
const client_coach_interaction = require('../../data_layer/client_coach_interaction');
const { get_requested_clients_of_coach_business_layer } = require('../../business_layer/client_coach_interaction'); // Replace 'yourFileName' with the actual filename

jest.mock('../../data_layer/user_info');
jest.mock('../../data_layer/client_coach_interaction');

describe('get_requested_clients_of_coach_business_layer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should resolve with an array of clients for a valid coach', async () => {
    const coachId = 1;
    user_info.get_role.mockResolvedValue('coach');
    client_coach_interaction.get_requested_clients_of_coach_data_layer.mockResolvedValue([
      { id: 1, name: 'Client 1', username: 'client1' },
      { id: 2, name: 'Client 2', username: 'client2' },
    ]);

    const result = await get_requested_clients_of_coach_business_layer(coachId);

    expect(result).toEqual([
      { id: 1, name: 'Client 1', username: 'client1' },
      { id: 2, name: 'Client 2', username: 'client2' },
    ]);
    expect(user_info.get_role).toHaveBeenCalledWith(coachId);
    expect(client_coach_interaction.get_requested_clients_of_coach_data_layer).toHaveBeenCalledWith(coachId);
  });

  test('should reject for a non-coach user', async () => {
    const coachId = 1;
    user_info.get_role.mockResolvedValue('client');

    await expect(get_requested_clients_of_coach_business_layer(coachId)).rejects.toThrowError('Only coach can check their client requests.');
    expect(user_info.get_role).toHaveBeenCalledWith(coachId);
    expect(client_coach_interaction.get_requested_clients_of_coach_data_layer).not.toHaveBeenCalled();
  });

  // Add more test cases as needed...
});
