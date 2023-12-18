const login = require('../../data_layer/login');
const bcrypt = require('bcrypt');
const businessLayer = require('../../business_layer/login'); // Adjust the path accordingly

jest.mock('bcrypt');
jest.mock('../../data_layer/login');

describe('Login Business Layer Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should resolve with success message and user_id for a successful login', async () => {
    const username = 'testuser';
    const password = 'testpassword';

    const mockedData = {
      password_hash: 'hashed_password',
      password_salt: 'salt',
      user_id: '123',
    };

    bcrypt.compare.mockImplementation((password, hashedPassword, callback) => {
      callback(null, true);
    });

    login.login_data_layer.mockResolvedValue(mockedData);

    const result = await businessLayer.login_business_layer(username, password);

    expect(result).toEqual({
      message: 'Login successful',
      user_id: mockedData.user_id,
    });
    expect(login.login_data_layer).toHaveBeenCalledWith(username);
    expect(bcrypt.compare).toHaveBeenCalledWith(password + mockedData.password_salt, mockedData.password_hash, expect.any(Function));
  });

  test('should reject with error for a bcrypt error', async () => {
    const username = 'testuser';
    const password = 'testpassword';
    const bcryptError = new Error('Bcrypt error');

    login.login_data_layer.mockResolvedValue({
      password_hash: 'hashed_password',
      password_salt: 'salt',
      user_id: '123',
    });

    bcrypt.compare.mockImplementation((password, hashedPassword, callback) => {
      callback(bcryptError, null);
    });

    await expect(businessLayer.login_business_layer(username, password)).rejects.toThrow(bcryptError);
    expect(login.login_data_layer).toHaveBeenCalledWith(username);
    expect(bcrypt.compare).toHaveBeenCalledWith(password + 'salt', 'hashed_password', expect.any(Function));
  });
});
