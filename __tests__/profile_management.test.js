const sinon = require('sinon');
const conn = require("../data_layer/conn");
const profile_management_data_layer = require("../data_layer/profile_management");
const profile_management_business_layer = require("../business_layer/profile_management");
const user_info_data_layer = require("../data_layer/user_info");
describe('messaging', () => {
  beforeEach(() => {
  });
  afterEach(function () {
    sinon.restore();
  });

  describe("get_profile_info business layer coach success", function () {
    it("should get profile info from simulated data layer", async function () {
        // Arrange
        sinon.stub(user_info_data_layer, "get_role").returns(Promise.resolve("coach"));
        sinon.stub(profile_management_data_layer, "get_client_profile_info").returns(Promise.resolve("test_response_1"));
        sinon.stub(profile_management_data_layer, "get_coach_profile_info").returns(Promise.resolve("test_response_2"));
        // Act
        const result = await profile_management_business_layer.get_profile_info(1);
        // Assert
        console.log(result);
        expect(result).toStrictEqual({
          "client_profile_info": "test_response_1", 
          "coach_profile_info": "test_response_2"
        });
    });
  });
  describe("get_profile_info business layer coach failure", function () {
    it("should return an error due to invalid role", async function () {
        // Arrange
        sinon.stub(user_info_data_layer, "get_role").returns(Promise.resolve("invalid_role"));
        sinon.stub(profile_management_data_layer, "get_client_profile_info").returns(Promise.resolve("test_response_1"));
        sinon.stub(profile_management_data_layer, "get_coach_profile_info").returns(Promise.resolve("test_response_2"));
        // Act
        try
        {
          const result = await profile_management_business_layer.get_profile_info(1);
          expect(1).toBe(0);
        }
        catch(err)
        {
          // Assert
          expect(err).toBe("User is not a client or coach");
        }
    });
  });

  describe("set_profile_info business layer coach success", function () {
    it("should set profile info using simulated data layer", async function () {
        // Arrange
        sinon.stub(user_info_data_layer, "get_role").returns(Promise.resolve("coach"));
        sinon.stub(profile_management_data_layer, "set_client_profile_info").returns(Promise.resolve());
        // Act
        const result = await profile_management_business_layer.set_profile_info(1, "http://link.png", "hello", 5, 5, 4, "sickness", 45, "to eat", 44, "today", "not", 55, "yes", 1, 0);
        // Assert
        expect(result).toBe("Information updated");
    });
  });
  describe("set_profile_info business layer coach failure", function () {
    it("should return an error due to not having anything to update", async function () {
        // Arrange
        sinon.stub(user_info_data_layer, "get_role").returns(Promise.resolve("coach"));
        sinon.stub(profile_management_data_layer, "set_client_profile_info").returns(Promise.resolve());
        // Act
        try
        {
          const result = await profile_management_business_layer.set_profile_info();
          expect(1).toBe(0);
        }
        catch(err)
        {
          // Assert
          expect(err).toBe("Invalid input");
        }
    });
  });

  describe("get_client_profile_info data layer success", function(){
    it("should return client profile info", async function () {
        // Arrange
        sinon.stub(conn.con, 'query').yields(null,[{
          about_me: "test_1",
          experience_level: 2,
          height: 3,
          weight: 4,
          medical_conditions: "test_5",
          budget: 6,
          goals: "test_7",
          target_weight: 8,
          pfp_link: "http://test_9.co",
          birthday: "2000-10-10"
        }]);
        // Act
        let result;
        result = await profile_management_data_layer.get_client_profile_info(1);
        //Assert
        expect(result).toStrictEqual({
          about_me: "test_1",
          experience_level: 2,
          height: 3,
          weight: 4,
          medical_conditions: "test_5",
          budget: 6,
          goals: "test_7",
          target_weight: 8,
          pfp_link: "http://test_9.co",
          birthday: "2000-10-10"
        });
    });
  });
  describe("get_client_profile_info data layer failure", function(){
    it("should return an sql error", async function () {
        // Arrange
        sinon.stub(conn.con, 'query').yields("error", null);
        // Act
        let result;
        try
        {
          result = await profile_management_data_layer.get_client_profile_info(1);
          expect(1).toBe(0);
        }
        catch(err)
        {
          //Assert
          expect(err).toBe("sql failure");
        }
    });
  });

  describe("get_coach_profile_info data layer success", function(){
    it("should return coach profile info", async function () {
        // Arrange
        sinon.stub(conn.con, 'query').yields(null,[{
          availability: "available on tuesdays except holidays",
          hourly_rate: 255,
          coaching_history: "good at squats",
          accepting_new_clients: 1,
          experience_level: 5,
          paypal_link: "http://link.com"
        }]);
        // Act
        let result;
        result = await profile_management_data_layer.get_coach_profile_info(1);
        //Assert
        expect(result).toStrictEqual({
          availability: "available on tuesdays except holidays",
          hourly_rate: 255,
          coaching_history: "good at squats",
          accepting_new_clients: 1,
          experience_level: 5,
          paypal_link: "http://link.com"
        });
    });
  });  

  describe("get_coach_profile_info data layer failure", function(){
    it("should return an sql error", async function () {
        // Arrange
        sinon.stub(conn.con, 'query').yields("error", null);
        // Act
        let result;
        try
        {
          result = await profile_management_data_layer.get_coach_profile_info(1);
          expect(1).toBe(0);
        }
        catch(err)
        {
          //Assert
          expect(err).toBe("sql failure");
        }
    });
  });

  describe("set_coach_profile_info data layer success", function(){
    it("should return 'Coach profile updated'", async function () {
        // Arrange
        sinon.stub(conn.con, 'query').yields(null,null);
        // Act
        let result;
        result = await profile_management_data_layer.set_coach_profile_info(
        1, 
        "available on tuesdays except holidays",255, 
        "good at squats",
        1,
        5,
        "http://link.com");
        //Assert
        expect(result).toBe("Coach profile updated");
    });
  });  
  describe("set_coach_profile_info data layer failure", function(){
    it("should return 'sql failure'", async function () {
        // Arrange
        sinon.stub(conn.con, 'query').yields("some error",null);
        // Act
        let result;
        try
        {
          result = await profile_management_data_layer.set_coach_profile_info(
          1, 
          "available on tuesdays except holidays",255, 
          "good at squats",
          1,
          5,
          "http://link.com");
          expect(1).toBe(0);
        }
        catch(err)
        {
        //Assert
        expect(err).toBe("sql failure");
        }
    });
  });  
  describe("set_cleint_profile_info data layer success", function(){
    it("should return 'Client profile updated'", async function () {
      // Arrange
      sinon.stub(conn.con, 'query').yields(null,null);
      // Act
      let result;
      result = await profile_management_data_layer.set_client_profile_info(
      1, 
      "available on tuesdays except holidays",
      1,
      5,
      5,
      "sick",
      54,
      "to get strong",
      544,
      '2000-10-10',
      'http://image.com/image.jpg'
      );
      expect(result).toBe("Client profile updated");
    });
  });  
  describe("set_cleint_profile_info data layer failure", function(){
    it("should return 'sql failure'", async function () {
      // Arrange
      sinon.stub(conn.con, 'query').yields("some error",null);
      // Act
      let result;
      try
      {
        result = await profile_management_data_layer.set_client_profile_info(
        1, 
        "available on tuesdays except holidays",
        1,
        5,
        5,
        "sick",
        54,
        "to get strong",
        544,
        '2000-10-10',
        'http://image.com/image.jpg'
        );
        expect(1).toBe(0);
      }
      catch(err)
      {
        expect(err).toBe("sql failure");
      }
    });
  });  
});