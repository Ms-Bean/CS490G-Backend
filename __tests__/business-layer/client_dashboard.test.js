const dataLayer = require('../../data_layer/client_dashboard');
const businessLayer = require('../../business_layer/client_dashboard');

jest.mock('../../data_layer/client_dashboard');

describe('Client Dashboard Business Layer Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Add more tests for different scenarios, such as permission checks, invalid client IDs, etc.

  test('get_client_target_weight_business_layer - Success', async () => {
    const clientId = '789';
    const expectedTargetWeight = 150;

    // Mocking the data layer function
    dataLayer.get_client_target_weight.mockResolvedValue(expectedTargetWeight);

    const result = await businessLayer.get_client_target_weight_business_layer(clientId);

    expect(result).toEqual(expectedTargetWeight);
    expect(dataLayer.get_client_target_weight).toHaveBeenCalledWith(clientId);
  });

  test('get_client_target_weight_business_layer - Error', async () => {
    const clientId = 'invalidClientId';
    const expectedErrorMessage = 'Some error';
  
    // Mocking the data layer function
    dataLayer.get_client_target_weight.mockRejectedValue(new Error(expectedErrorMessage));
  
    try {
      await businessLayer.get_client_target_weight_business_layer(clientId);
      // If the promise is resolved, fail the test
      fail('Expected promise to be rejected');
    } catch (error) {
      // Check if the error message contains the expected substring
      expect(error.message).toContain(expectedErrorMessage);
      expect(dataLayer.get_client_target_weight).toHaveBeenCalledWith(clientId);
    }
  });
  // Add more tests for different scenarios, if needed
});
