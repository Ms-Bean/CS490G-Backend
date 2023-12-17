const sinon = require('sinon');
const mysql = require("mysql");
const conn = require("../data_layer/conn");
const messaging_data_layer = require("../data_layer/messaging");
const messaging_business_layer = require("../business_layer/messaging");
const client_coach_interaction_dependency = require("../data_layer/client_coach_interaction");
describe('messaging_business_layer', () => {
  beforeEach(() => {
  });
  afterEach(function () {
    sinon.restore();
  });

  describe("Insert message business layer", function () {
        it("should insert a message", async function () {
            // Arrange
            sinon.stub(client_coach_interaction_dependency, "check_if_client_has_hired_coach").returns(Promise.resolve(true));
            sinon.stub(messaging_data_layer, "insert_message_data_layer").returns(Promise.resolve("success"));
            // Act
            const result = await messaging_business_layer.insert_message_business_layer(1, 2, "Hello");
            // Assert
            expect(result).toBe("success");
        });
    });
    describe("Not hired message business layer", function () {
          it("should not insert the message because the client has not hired the coach", async function () {
              // Arrange
              sinon.stub(client_coach_interaction_dependency, "check_if_client_has_hired_coach").returns(Promise.resolve(false));
              sinon.stub(messaging_data_layer, "insert_message_data_layer").returns(Promise.resolve("success"));
              // Act
              try
              {
                let result = await messaging_business_layer.insert_message_business_layer(1, 2, "Hello");
                throw new Error("Should have failed to insert message");
              }
              catch(err){
                // Assert
                expect(err.message).toBe("Current user cannot message another user that's neither their coach nor client");
              }
          });
      });
      describe("get_client_coach_message_page_data_layer", function(){
        it("should give us the simulated results from the db query'", async function () {
            // Arrange
            sinon.stub(conn.con, 'query').yields(null, [{message_id: 3, sender_id: 3, receiver_id: 5, content: "Hello"}]);
            // Act
            let result = await messaging_data_layer.get_client_coach_message_page_data_layer(1, 2, 2, 2);
            
            // Assert
            expect(result[0].message_id).toBe(3);
            expect(result[0].sender_id).toBe(3);
            expect(result[0].receiver_id).toBe(5);
            expect(result[0].content).toBe('Hello');


        })
      });
});