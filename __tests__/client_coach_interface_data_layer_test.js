const chai = require('chai');
const sinon = require('sinon');
const { 
  get_clients_of_coach,
  request_coach_data_layer,
  check_if_client_coach_request_exists,
  check_if_client_has_hired_coach,
  accept_client_data_layer,
  remove_coach_data_layer
} = require('..\\data_layer\\client_coach_interaction.js'); // Replace with the correct path
const { expect } = chai;

describe('Client-Coach Data Layer Unit Tests', () => {
  let conQueryStub;

  beforeEach(() => {
    // Create a stub for con.query to simulate database queries
    conQueryStub = sinon.stub();
  });

  afterEach(() => {
    // Restore the original function after each test
    sinon.restore();
  });

  it('should get clients of a coach', async () => {
    // Arrange
    const expectedCoachId = 1;
    const expectedResult = [1, 2, 3];
    conQueryStub.yields(null, expectedResult);
    sinon.replace(get_clients_of_coach, 'con', { query: conQueryStub });

    // Act
    const result = await get_clients_of_coach(expectedCoachId);

    // Assert
    expect(result).to.deep.equal(expectedResult);
  });

  it('should request coach data layer', async () => {
    // Arrange
    const expectedCoachId = 1;
    const expectedClientId = 2;
    const expectedComment = 'Test comment';
    conQueryStub.yields(null);
    sinon.replace(request_coach_data_layer, 'con', { query: conQueryStub });

    // Act
    const resultPromise = request_coach_data_layer(expectedCoachId, expectedClientId, expectedComment);

    // Assert
    await expect(resultPromise).to.be.fulfilled;
    expect(conQueryStub.calledOnce).to.be.true;
  });

  it('should check if client-coach request exists', async () => {
    // Arrange
    const expectedCoachId = 1;
    const expectedClientId = 2;
    const expectedResult = [{ requested: 1 }];
    conQueryStub.yields(null, expectedResult);
    sinon.replace(check_if_client_coach_request_exists, 'con', { query: conQueryStub });

    // Act
    const result = await check_if_client_coach_request_exists(expectedCoachId, expectedClientId);

    // Assert
    expect(result).to.be.true;
  });

  it('should check if client has hired a coach', async () => {
    // Arrange
    const expectedCoachId = 1;
    const expectedClientId = 2;
    const expectedResult = [{ requested: 0 }];
    conQueryStub.yields(null, expectedResult);
    sinon.replace(check_if_client_has_hired_coach, 'con', { query: conQueryStub });

    // Act
    const result = await check_if_client_has_hired_coach(expectedCoachId, expectedClientId);

    // Assert
    expect(result).to.be.true;
  });

  it('should accept client data layer', async () => {
    // Arrange
    const expectedCoachId = 1;
    const expectedClientId = 2;
    conQueryStub.yields(null);
    sinon.replace(accept_client_data_layer, 'con', { query: conQueryStub });

    // Act
    const resultPromise = accept_client_data_layer(expectedCoachId, expectedClientId);

    // Assert
    await expect(resultPromise).to.be.fulfilled;
    expect(conQueryStub.calledOnce).to.be.true;
  });

  it('should remove coach data layer', async () => {
    // Arrange
    const expectedCoachId = 1;
    const expectedClientId = 2;
    conQueryStub.onCall(0).yields(null);
    conQueryStub.onCall(1).yields(null);
    conQueryStub.onCall(2).yields(null);
    sinon.replace(remove_coach_data_layer, 'con', { query: conQueryStub });

    // Act
    const resultPromise = remove_coach_data_layer(expectedClientId, expectedCoachId);

    // Assert
    await expect(resultPromise).to.be.fulfilled;
    expect(conQueryStub.callCount).to.equal(3);
  });
});
