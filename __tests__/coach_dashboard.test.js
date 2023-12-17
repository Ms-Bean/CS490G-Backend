const sinon = require('sinon');
const conn = require("../data_layer/conn");
const coach_dashboard_business_layer = require("../business_layer/coach_dashboard");
const coach_dashboard_data_layer = require("../data_layer/coach_dashboard");
const user_info_data_layer = require("../data_layer/user_info");
const user_info_business_layer = require("../business_layer/user_info");
const goals_data_layer = require("../data_layer/goals");
describe('coach_dashboard', () => {
  beforeEach(() => {
  });
  afterEach(function () {
    sinon.restore();
  });

  describe("get_coach_dashboard_info_data_layer", function () {
    it("should fetch a response from database", async function () {
        sinon.stub(conn.con, "query").yields(null, "test_result")
        let result = await coach_dashboard_data_layer.get_coach_dashboard_info(1);

        expect(result).toEqual("test_result");
    });
  });

  describe("get_coach_dashboard_info_data_layer_fails", function () {
    it("should fail", async function () {
        sinon.stub(conn.con, "query").yields("err",null);
        try
        {
            let result = await coach_dashboard_data_layer.get_coach_dashboard_info(1);
        }
        catch(err)
        {
            expect(err).toBe("Something went wrong in our database.");
        }
    });
  });
  describe("getAllCoachRequest_data_layer", function () {
    it("should fetch a response from database", async function () {
        sinon.stub(conn.con, "query").yields(null, [{
            user_id: 1,
            first_name: "steve",
            last_name: "john",
            phone_number: "399-543-3535",
            email: "sdc2@njit.edu",
            availability: "Always available",
            hourly_rate: 455,
            coaching_history: "none",
            experience_level: 4,
            date: "2001-11-11"
        }])
        let result = await coach_dashboard_data_layer.get_coach_dashboard_info(1);

        expect(result).toStrictEqual([{
            user_id: 1,
            first_name: "steve",
            last_name: "john",
            phone_number: "399-543-3535",
            email: "sdc2@njit.edu",
            availability: "Always available",
            hourly_rate: 455,
            coaching_history: "none",
            experience_level: 4,
            date: "2001-11-11"
        }]);
    });
  });
  describe("getAllCoachRequest_data_layer failure", function () {
    it("should fail", async function () {
        sinon.stub(conn.con, "query").yields("err", null);
        try
        {
            let result = await coach_dashboard_data_layer.get_coach_dashboard_info(1);
            expect(1).toBe(0);
        }
        catch(err)
        {
            expect(err).toBe("Something went wrong in our database.");
        }
    });
  });
  describe("accept_coach_data_layer", function () {
    it("should fetch a response from database", async function () {
        sinon.stub(conn.con, "query").yields(null, "rows");
        let result = await coach_dashboard_data_layer.get_coach_dashboard_info(1);
        expect(result).toBe("rows");
    });
  });
  describe("accept_coach_data_layer_failure", function () {
    it("should fail", async function () {
        sinon.stub(conn.con, "query").yields("err", null);
        try
        {
            let result = await coach_dashboard_data_layer.get_coach_dashboard_info(1);
            expect(1).toBe(0);
        }
        catch(err)
        {
            expect(err).toBe("Something went wrong in our database.");
        }
    });
  });
  describe("accept_clients_data_layer", function(){
    it("should accept", async function(){
        sinon.stub(conn.con, "query").yields(null, "test_value");
        let result = await coach_dashboard_data_layer.accept_reject_clients_data_layer(1, 1, "accept");
        expect(result).toBe("test_value");
    })
  });
  describe("reject_clients_data_layer", function(){
    it("should reject", async function(){
        sinon.stub(conn.con, "query").yields(null, "test_value");
        let result = await coach_dashboard_data_layer.accept_reject_clients_data_layer(1, 1, "reject");
        expect(result).toBe("test_value");
    })
  });
  describe("accept_reject_clients_data_layer_failure", function(){
    it("should fail", async function(){
        sinon.stub(conn.con, "query").yields("err", null);
        try
        {
            let result = await coach_dashboard_data_layer.accept_reject_clients_data_layer(1, 1, "reject");
        }
        catch(err)
        {
            expect(err).toBe("Something went wrong in our database.");
        }
    })
  });
  describe("get_coach_dashboard_info_business_layer", function(){
    it("should work", async function(){
        sinon.stub(user_info_business_layer, "get_role_business_layer").returns(Promise.resolve("coach"));
        sinon.stub(coach_dashboard_data_layer, "get_coach_dashboard_info").returns(Promise.resolve("test"));
        let result = await coach_dashboard_business_layer.get_coach_dashboard_info(1);
        expect(result).toBe("test");
    })
  });
  describe("get_coach_dashboard_info_business_layer", function(){
    it("should reject because user is not a coach", async function(){
        sinon.stub(user_info_business_layer, "get_role_business_layer").returns(Promise.resolve("client"));
        sinon.stub(coach_dashboard_data_layer, "get_coach_dashboard_info").returns(Promise.resolve("test"));
        try
        {
            let result = await coach_dashboard_business_layer.get_coach_dashboard_info(1);
            expect(1).toBe(0);
        }
        catch(err)
        {
            expect(err).toBe("User is not a coach.");
        }
    })
  });
  describe("get_coach_dashboard_info_business_layer", function(){
    it("should reject because of data layer failure", async function(){
        sinon.stub(user_info_business_layer, "get_role_business_layer").returns(Promise.resolve("coach"));
        sinon.stub(coach_dashboard_data_layer, "get_coach_dashboard_info").returns(Promise.reject("err"));
        try
        {
            let result = await coach_dashboard_business_layer.get_coach_dashboard_info(1);
            expect(1).toBe(0);
        }
        catch(err)
        {
            expect(err).toBe("err");
        }
    })
  });
  describe("get_coach_dashboard_info_business_layer", function(){
    it("should reject because of data layer failure", async function(){
        sinon.stub(user_info_business_layer, "get_role_business_layer").returns(Promise.reject("err"));
        sinon.stub(coach_dashboard_data_layer, "get_coach_dashboard_info").returns(Promise.resolve("test"));
        try
        {
            let result = await coach_dashboard_business_layer.get_coach_dashboard_info(1);
            expect(1).toBe(0);
        }
        catch(err)
        {
            expect(err).toBe("err");
        }
    })
  });
});