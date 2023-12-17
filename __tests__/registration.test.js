const sinon = require('sinon');
const conn = require("../data_layer/conn");
const registration_data_layer = require("../data_layer/registration");
const registration_business_layer = require("../business_layer/registration");
const user_info_data_layer = require("../data_layer/user_info");
describe('registration', () => {
  beforeEach(() => {
  });
  afterEach(function () {
    sinon.restore();
  });

  describe("register coach business layer success", function () {
    it("should register coach using simulated data layer", async function () {
        // Arrange
        sinon.stub(registration_data_layer, "check_if_username_exists_data_layer").returns(Promise.resolve(false));
        sinon.stub(registration_data_layer, "insert_user_data_layer").returns(Promise.resolve(7));
        // Act
        const result = await registration_business_layer.insert_user_business_layer("Firstname", "LAstname", "cshhhtra", "sdc2@njit.edu", "password", "coach")
        // Assert
        console.log(result);
        expect(result.message).toBe("Successfully added user");
    });
  });
  describe("register coach business layer failure", function () {
    it("should get an error from the data layer", async function () {
        // Arrange
        sinon.stub(registration_data_layer, "check_if_username_exists_data_layer").returns(Promise.resolve(true));
        sinon.stub(registration_data_layer, "insert_user_data_layer").returns(Promise.resolve(7));
        // Act
        try
        {
          const result = await registration_business_layer.insert_user_business_layer("Firstname", "LAstname", "cshhhtra", "sdc2@njit.edu", "password", "coach")
          expect(1).toBe(0);
        }
        catch(err)
        {
          // Assert
          expect(err).toBe("That username is already taken.");
        }
    });
  });
  describe("alter account info business layer success", function () {
    it("should alter account info using simulated data layer", async function () {
        // Arrange
        sinon.stub(registration_data_layer, "alter_account_info_data_layer").returns(Promise.resolve("Information updated"));
        sinon.stub(registration_data_layer, "set_user_address_data_layer").returns(Promise.resolve("Information updated"));
        // Act
        const result = await registration_business_layer.alter_account_info_business_layer(5, "firstname", "lastname", "username", "sdc2@njit.edu", "cactus", "908-553-2352", "Adam street", "Adamsville", "NJ", "09534")
        // Assert
        expect(result).toBe("Information updated");
    });
  });
  describe("accept_client_survey_business_layer success", function(){
    it("should accept the client survey", async function (){
      //Arrange
      sinon.stub(user_info_data_layer, "get_role").returns(Promise.resolve("client"));
      sinon.stub(registration_data_layer, "accept_client_survey_data_layer").returns(Promise.resolve("test_response"));

      //Act
      const result = await registration_business_layer.accept_client_survey_business_layer(4, 5, 6, "Beginner", "$$");
      
      //Assert
      expect(result).toBe("test_response");
    })
  });
  describe("accept_client_survey_business_layer failure", function(){
    it("should reject the client survey", async function (){
      //Arrange
      sinon.stub(user_info_data_layer, "get_role").returns(Promise.resolve("coach"));
      sinon.stub(registration_data_layer, "accept_client_survey_data_layer").returns(Promise.resolve("test_response"));

      //Act
      try
      {
        const result = await registration_business_layer.accept_client_survey_business_layer(4, 5, 6, "Beginner", "$$");
        expect(1).toBe(0);
      }
      catch(err)
      {
        //Assert
        expect(err).toBe("User is not a client.");
      }
    })
  });
  describe("accept_coach_survey_business_layer success", function(){
    it("should accept the coach survey", async function (){
      //Arrange
      sinon.stub(user_info_data_layer, "get_role").returns(Promise.resolve("coach"));
      sinon.stub(registration_data_layer, "accept_coach_survey_data_layer").returns(Promise.resolve("test_response"));

      //Act
      const result = await registration_business_layer.accept_coach_survey_business_layer(1, 4, "Very available", "12", "34");
      
      //Assert
      expect(result).toBe("test_response");
    })
  });
  describe("accept_coach_survey_business_layer failure", function(){
    it("should reject the coach survey", async function (){
      //Arrange
      sinon.stub(user_info_data_layer, "get_role").returns(Promise.resolve("client"));
      sinon.stub(registration_data_layer, "accept_coach_survey_data_layer").returns(Promise.resolve("test_response"));

      //Act
      try
      {
        const result = await registration_business_layer.accept_coach_survey_business_layer(1, 4, "Very available", "12", "34");
        expect(1).toBe(0);
      }
      catch(err)
      {
        //Assert
        expect(err).toBe("User is not a coach.");
      }
    })
  });

  describe("set_user_address_business_layer", function(){
    it("should accept the address", async function(){
      //Arrange
      sinon.stub(user_info_data_layer, "get_role").returns(Promise.resolve("coach"));
      sinon.stub(registration_data_layer, "set_user_address_data_layer").returns(Promise.resolve("test_response"));

      //Act
      const result = await registration_business_layer.set_user_address_business_layer(1, "adam street", "adam city", "NJ", "50549");

      //Assert
      expect(result).toBe("test_response");
    });
  });
  describe("insert_user_data_layer", function(){
    it("should accept the user", async function(){
      //Arrange
      sinon.stub(conn.con, "query").yields(null, [{user_id: 4}]);
      sinon.stub(registration_data_layer, "set_user_address_data_layer").returns(Promise.resolve("test_response"));

      //Act
      const result = await registration_data_layer.insert_user_data_layer("Firstname", "LAstname", "cshhhtra", "sdc2@njit.edu", "password", "hash", "coach");

      //Assert
      expect(result).toBe(4);
    });
  });
  describe("insert_user_data_layer failure", function(){
    it("should reject the user", async function(){
      //Arrange
      sinon.stub(conn.con, "query").yields("error", null);
      sinon.stub(registration_data_layer, "set_user_address_data_layer").returns(Promise.resolve("test_response"));

      //Act
      try
      {
        const result = await registration_data_layer.insert_user_data_layer("Firstname", "LAstname", "cshhhtra", "sdc2@njit.edu", "password", "hash", "coach");
        expect(1).toBe(0);
      }
      catch(err)
      {
        //Assert
        expect(err).toBe("sql failure");
      }
    });
  });
  describe("alter_account_info_data_layer", function(){
    it("should accept the alteration", async function(){
      //Arrange
      sinon.stub(conn.con, "query").yields(null, null);
      //Act
        const result = await registration_data_layer. alter_account_info_data_layer(2, "name", "name", "fasdfgsdfg", "sdc2@njit.edu", "oisdfsgh443", "adfasdg", "08864");

      //Assert
      expect(result).toBe("Information updated.");
    });
  });
  describe("alter_account_info_data_layer reject", function(){
    it("should reject the alteration", async function(){
      //Arrange
      sinon.stub(conn.con, "query").yields("error", null);
      //Act
      try
      {
        const result = await registration_data_layer. alter_account_info_data_layer(2, "name", "name", "fasdfgsdfg", "sdc2@njit.edu", "oisdfsgh443", "adfasdg", "08864");
        expect(1).toBe(0);
      }
      catch(err)
      {
        //Assert
        expect(err).toBe("error");
      }
    });
  });
  describe("accept_coach_survey_data_layer reject", function(){
    it("should accept the coach survey", async function(){
      //Arrange
      sinon.stub(conn.con, "query").yields(null, null);
      //Act
      const result = await registration_data_layer.accept_coach_survey_data_layer(2, 6, "Very available", "fasdfgsdfg", "sdc2@njit.edu");
      //Assert
      expect(result).toBe("Information updated.");
    });
  });
  describe("accept_coach_survey_data_layer reject", function(){
    it("should reject the coach survey", async function(){
      //Arrange
      sinon.stub(conn.con, "query").yields("error", null);
      //Act
      try
      {
        const result = await registration_data_layer.accept_coach_survey_data_layer(2, 6, "Very available", "fasdfgsdfg", "sdc2@njit.edu");
        expect(0).toBe(1);
      }
      catch(err)
      {
        expect(err).toBe("Something went wrong in our database.");
      }
    });
  });
  describe("set_user_address_data_layer", function(){
    it("should insert the address", async function(){
      //Arrange
      sinon.stub(conn.con, "query").yields(null, null);
      //Act
      const result = await registration_data_layer.set_user_address_data_layer(2, "2032 adam street", "adam city", "NJ", "70075");
      //Assert
      expect(result).toBe("Address updated.");
    });
  });
  describe("set_user_address_data_layer failure", function(){
    it("should fail to set the address", async function(){
      //Arrange
      sinon.stub(conn.con, "query").yields("error", null);
      //Act
      try
      {
        const result = await registration_data_layer.set_user_address_data_layer(2, "2032 adam street", "adam city", "NJ", "70075");
        expect(1).toBe(0);
      }
      catch(err)
      {
        //Assert
        expect(err).toBe("error");
      }
    });
  });
  describe("check_if_username_exists_data_layer true", function(){
    it("should return true", async function(){
      sinon.stub(conn.con, "query").yields(null, [1]);

      const result = await registration_data_layer.check_if_username_exists_data_layer('steve');
      expect(result).toBe(true);
    });
  });
  describe("check_if_username_exists_data_layer false", function(){
    it("should return false", async function(){
      sinon.stub(conn.con, "query").yields(null, []);

      const result = await registration_data_layer.check_if_username_exists_data_layer('steve');
      expect(result).toBe(false);
    });
  });
  describe("check_if_username_exists_data_layer error", function(){
    it("should return error", async function(){
      sinon.stub(conn.con, "query").yields("error", null);
      try
      {
        const result = await registration_data_layer.check_if_username_exists_data_layer('steve');
        expect(1).toBe(0);
      }
      catch(err)
      {
        expect(err).toBe("error");
      }
    });
  });
});
