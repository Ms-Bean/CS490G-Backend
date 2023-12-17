const sinon = require('sinon');
const mysql = require("mysql");
const conn = require("../data_layer/conn");
const messaging_data_layer = require("../data_layer/messaging");
const messaging_business_layer = require("../business_layer/messaging");
const client_coach_interaction_dependency = require("../data_layer/client_coach_interaction");
describe('messaging', () => {
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
      describe("get_client_coach_message_page_data_layer success", function(){
        it("should give us the simulated results from the db query'", async function () {
            // Arrange
            sinon.stub(conn.con, 'query').yields(null, [{message_id: 3, sender_id: 3, receiver_id: 5, content: "Hello"}]);
            // Act
            let result = await messaging_data_layer.get_client_coach_message_page_data_layer(1, 2, 2, 2);
            
            // Assert
            expect(result[0].message_id).toBe(3);
            expect(result[0].sender_id).toBe(3);
            expect(result[0].receiver_id).toBe(5);
            expect(result[0].content).toBe('Hello')

        });
      });
      describe("get_client_coach_message_page_data_layer error", function(){
        it("should give us the error from the db query'", async function () {
            // Arrange
            sinon.stub(conn.con, 'query').yields("An error has occured", null);
            // Act
            try
            {
              let result = await messaging_data_layer.get_client_coach_message_page_data_layer(1, 2, 2, 2);
              throw new Error("query was supposed to fail");
            }
            catch(err)
            {
              // Assert
              expect(err).toBe("An error has occured");
            }

        });
      }); 
           
      describe("count_client_coach_messages_data_layer success", function(){
        it("should give us the simulated results from the db query'", async function () {
            // Arrange
            sinon.stub(conn.con, 'query').yields(null, [{message_count: 5}]);
            // Act
            let result;
            try{
              result = await messaging_data_layer.count_client_coach_messages_data_layer(1, 2);
              // Assert
              expect(result).toBe(5);
            }
            catch(err)
            {
              throw(err);
            }
        });
      });
      describe("count_client_coach_messages_data_layer  error", function(){
        it("should give us the error from the db query'", async function () {
            // Arrange
            sinon.stub(conn.con, 'query').yields("error",null);
            // Act
            let result;
            try{
              result = await messaging_data_layer.count_client_coach_messages_data_layer(1, 2);
              throw new Error("Should have thrown an error");
            }
            catch(err)
            {
              // Assert
              expect(err).toBe("error");
            }
        });
      });
      describe("get_client_coach_messages_business_layer success", function () {
        it("should get client_coach_messages simulation from fake data layer call", async function () {
            // Arrange
            sinon.stub(client_coach_interaction_dependency, "check_if_client_has_hired_coach").returns(Promise.resolve(true));
            sinon.stub(messaging_data_layer, "count_client_coach_messages_data_layer").returns(Promise.resolve(5));
            sinon.stub(messaging_data_layer, "get_client_coach_message_page_data_layer").returns(Promise.resolve("Test"));

            // Act
            const result = await messaging_business_layer.get_client_coach_messages_business_layer(1, 2, 5, 5);
            // Assert
            expect(result.page_info.page_num).toBe(1);
            expect(result.page_info.page_size).toBe(5);
            expect(result.page_info.has_next).toBe(false);
            expect(result.page_info.has_prev).toBe(false);
        });
      });
    describe("get_client_coach_messages_business_layer failure", function () {
      it("should get return an error because the client has not hired the coach", async function () {
          // Arrange
          sinon.stub(client_coach_interaction_dependency, "check_if_client_has_hired_coach").returns(Promise.resolve(false));
          sinon.stub(messaging_data_layer, "count_client_coach_messages_data_layer").returns(Promise.resolve(5));
          sinon.stub(messaging_data_layer, "get_client_coach_message_page_data_layer").returns(Promise.resolve("Test"));

          // Act
          try
          {
            const result = await messaging_business_layer.get_client_coach_messages_business_layer(1, 2, 5, 5);
          }
          catch(err)
          {
            expect(err.message).toBe("Current user cannot view messages from another user that's neither their coach nor client")
          }
      });
    });
    describe("get_coaches_list_of_client_business_layer success", function () {
      it("should return the data given to it by the fake data layer", async function () {
          // Arrange
          sinon.stub(client_coach_interaction_dependency, "get_coaches_of_client_data_layer").returns(Promise.resolve([4, 5, 23]));
          // Act
          const result = await messaging_business_layer.get_coaches_list_of_client_business_layer(1);
          //Assert
          expect(result).toStrictEqual([4, 5, 23]);
      });
    });
    describe("get_clients_list_of_coaches_business_layer success", function () {
      it("should return the data given to it by the fake data layer", async function () {
          // Arrange
          sinon.stub(client_coach_interaction_dependency, "get_clients_of_coach_data_layer").returns(Promise.resolve([4, 5, 23]));
          // Act
          const result = await messaging_business_layer.get_clients_list_of_coach_business_layer(1);
          //Assert
          expect(result).toStrictEqual([4, 5, 23]);
      });
    });

    describe("get_client_coach_message_page_data_layer error", function(){
      it("should give us the error from the db query'", async function () {
          // Arrange
          sinon.stub(conn.con, 'query').yields("error",null);
          // Act
          let result;
          try{
            result = await messaging_data_layer.get_client_coach_message_page_data_layer(1, 2, 3, 4);
            throw new Error("Should have thrown an error");
          }
          catch(err)
          {
            // Assert
            expect(err).toBe("error");
          }
      });
    });
    describe("get_client_coach_message_page_data_layer success", function(){
      it("should give us the result from the db query'", async function () {
          // Arrange
          sinon.stub(conn.con, 'query').yields(null,[{message_id: 5, sender_id: 3, receiver_id: 2, content: "Hello", created: "test", modified: "test"}]);
          // Act
          let result;
          result = await messaging_data_layer.get_client_coach_message_page_data_layer(1, 2, 3, 4);
          //Assert
          expect(result[0].message_id).toBe(5);
          expect(result[0].sender_id).toBe(3);
          expect(result[0].receiver_id).toBe(2);
          expect(result[0].content).toBe('Hello');
          expect(result[0].created).toBe('test');
          expect(result[0].modified).toBe('test');
    
      });
    });
    describe("count_client_coach_message_page_data_layer error", function(){
      it("should give us the error from the db query'", async function () {
          // Arrange
          sinon.stub(conn.con, 'query').yields("error",null);
          // Act
          let result;
          try{
            result = await messaging_data_layer.get_client_coach_message_page_data_layer(1, 2, 3, 4);
            throw new Error("Should have thrown an error");
          }
          catch(err)
          {
            // Assert
            expect(err).toBe("error");
          }
      });
    });
    describe("count_client_coach_messages_data_layer success", function(){
      it("should give us the result from the db query'", async function () {
          // Arrange
          sinon.stub(conn.con, 'query').yields(null,[{message_count:5}]);
          // Act
          let result;
          result = await messaging_data_layer.count_client_coach_messages_data_layer(1, 2);
          //Assert
          expect(result).toBe(5);
      });
    });
    describe("delete_messages_between_users error", function(){
      it("should give us the error from the db query'", async function () {
          // Arrange
          sinon.stub(conn.con, 'query').yields("error",null);
          // Act
          let result;
          try{
            result = await messaging_data_layer.delete_messages_between_users(1, 2);
            throw new Error("Should have thrown an error");
          }
          catch(err)
          {
            // Assert
            expect(err).toBe("error");
          }
      });
    });
    describe("delete_messages_between_users success", function(){
      it("should return nothing and produce no error'", async function () {
          // Arrange
          sinon.stub(conn.con, 'query').yields(null,null);
          // Act
          let result;
          result = await messaging_data_layer.delete_messages_between_users(1, 2);
          //Assert
          expect(result).toBe(undefined);
      });
    });
});