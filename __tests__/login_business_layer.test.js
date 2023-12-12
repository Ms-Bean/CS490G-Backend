const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const bcrypt = require('bcrypt');

const loginBusinessLayer = require('..\\business_layer\\login.js');

chai.use(chaiAsPromised);
const { expect } = chai;

// Mocking the data layer
const loginDataLayer = require('..\\data_layer\\login');
const sinonLogin = sinon.stub(loginDataLayer, 'login_data_layer');

// Test data
const userData = {
  username: 'testUser',
  password: 'testPassword',
  password_hash: '$2b$10$EXAMPLE_HASH',
  password_salt: '$2b$10$EXAMPLE_SALT',
  user_id: '123456789',
};

describe('login_business_layer', () => {
  beforeEach(() => {
    sinonLogin.reset();
  });

  it('should resolve with success message and user_id on successful login', async () => {
    // Mocking the login data layer response
    sinonLogin.resolves(userData);

    // Stubbing bcrypt.compare to resolve with true
    sinon.stub(bcrypt, 'compare').yields(null, true);

    // Call the login_business_layer function
    const result = await loginBusinessLayer(userData.username, userData.password);

    // Assert the result
    expect(result).to.deep.equal({
      message: 'Login successful',
      user_id: userData.user_id,
    });
  });

  it('should reject with "Invalid credentials" on unsuccessful login', async () => {
    // Mocking the login data layer response
    sinonLogin.resolves(userData);

    // Stubbing bcrypt.compare to resolve with false
    sinon.stub(bcrypt, 'compare').yields(null, false);

    // Call the login_business_layer function
    await expect(loginBusinessLayer(userData.username, userData.password)).to.be.rejectedWith('Invalid username, or password');
  });

  it('should reject with an error message on data layer error', async () => {
    // Mocking the login data layer response
    sinonLogin.rejects('Data layer error');

    // Call the login_business_layer function
    await expect(loginBusinessLayer(userData.username, userData.password)).to.be.rejectedWith('Data layer error');
  });
});
