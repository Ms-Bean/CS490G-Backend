const sinon = require('sinon');
const conn = require("../data_layer/conn");
const user_info_business_layer = require("../business_layer/user_info");
const user_info_data_layer = require("../data_layer/user_info");
describe('user info', () => {
  beforeEach(() => {
  });
  afterEach(function () {
    sinon.restore();
  });

  describe("get user account info data layer success", function () {
    it("should register coach using simulated data layer", async function () {
        // Arrange
        sinon.stub(conn.con, "query").yields(null, [{
            address: "a",
            city: "b", 
            state: "c", 
            zip_code: "d", 
            phone_number: "e",
            email: "f",
            username: "g",
            first_name: "h",
            last_name: "i"
        }]);// Act
        const result = await user_info_data_layer.get_user_account_info_data_layer(1);
        // Assert
        console.log(result);
        expect(result).toStrictEqual({ 
            street_address: "a",
            city: "b",
            state: "c",
            username: "g",
            email: "f",
            phone_number: "e",
            first_name: "h",
            last_name: "i",
            zip_code: "d"
            });
    });
  });
});
