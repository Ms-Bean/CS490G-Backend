const assert = require('assert');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const {
  get_clients_of_coach,
  request_coach_data_layer,
  check_if_client_coach_request_exists,
  check_if_client_has_hired_coach,
  accept_client_data_layer,
  remove_coach_data_layer
} = require('./your-module'); // Replace with the correct path

chai.use(chaiAsPromised);
const { expect } = chai;

describe('Unit Tests for your-module', () => {
  // Mock the database connection
  const mockCon = {
    query: sinon.stub()
  };

  // Replace the actual connection with the mock connection
  before(() => {
    sinon.replace(require('./conn'), 'con', mockCon);
  });

  // Restore the original connection after all tests
  after(() => {
    sinon.restore();
  });

  it('get_clients_of_coach should return an array of client IDs', async () => {
    // Arrange
    const coachId = 1;
    const expectedResult = [1, 2, 3];
    mockCon.query.withArgs(sinon.match.any, [coachId]).yields(null, expectedResult);

    // Act
    const result = await get_clients_of_coach(coachId);

    // Assert
    assert.deepStrictEqual(result, expectedResult);
    console.log('get_clients_of_coach passed successfully.');
  });

  it('request_coach_data_layer should resolve when the query is successful', async () => {
    // Arrange
    const coachId = 1;
    const clientId = 2;
    mockCon.query.yields(null);

    // Act & Assert
    await expect(request_coach_data_layer(coachId, clientId)).to.be.fulfilled;
    assert.strictEqual(mockCon.query.calledOnce, true);
    console.log('request_coach_data_layer passed successfully.');
  });

  it('check_if_client_coach_request_exists should return true when a request exists', async () => {
    // Arrange
    const coachId = 1;
    const clientId = 2;
    const expectedResult = [{ requested: 1 }];
    mockCon.query.withArgs(sinon.match.any, [coachId, clientId]).yields(null, expectedResult);

    // Act
    const result = await check_if_client_coach_request_exists(coachId, clientId);

    // Assert
    assert.strictEqual(result, true);
    console.log('check_if_client_coach_request_exists passed successfully.');
  });

  it('check_if_client_has_hired_coach should return true when a client has hired a coach', async () => {
    // Arrange
    const coachId = 1;
    const clientId = 2;
    const expectedResult = [{ requested: 0 }];
    mockCon.query.withArgs(sinon.match.any, [coachId, clientId]).yields(null, expectedResult);

    // Act
    const result = await check_if_client_has_hired_coach(coachId, clientId);

    // Assert
    assert.strictEqual(result, true);
    console.log('check_if_client_has_hired_coach passed successfully.');
  });

  it('accept_client_data_layer should resolve when the query is successful', async () => {
    // Arrange
    const coachId = 1;
    const clientId = 2;
    mockCon.query.yields(null);

    // Act & Assert
    await expect(accept_client_data_layer(coachId, clientId)).to.be.fulfilled;
    assert.strictEqual(mockCon.query.calledOnce, true);
    console.log('accept_client_data_layer passed successfully.');
  });

  it('remove_coach_data_layer should resolve when all queries are successful', async () => {
    // Arrange
    const coachId = 1;
    const clientId = 2;
    mockCon.query.onCall(0).yields(null);
    mockCon.query.onCall(1).yields(null);
    mockCon.query.onCall(2).yields(null);

    // Act & Assert
    await expect(remove_coach_data_layer(clientId, coachId)).to.be.fulfilled;
    assert.strictEqual(mockCon.query.callCount, 3);
    console.log('remove_coach_data_layer passed successfully.');
  });
});
