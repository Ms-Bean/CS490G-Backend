const messaging = require('../../data_layer/messaging');
const clientCoachInteraction = require('../../data_layer/client_coach_interaction');
const messagingBusinessLayer = require('../../business_layer/messaging'); // Assuming your business layer functions are in a file named messaging.js

jest.mock('../../data_layer/messaging');
jest.mock('../../data_layer/client_coach_interaction');

describe('Messaging Business Layer Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('insert_message_business_layer', () => {
    test('should insert a message successfully', async () => {
      const currentUserId = 1;
      const recipientId = 2;
      const content = 'Hello, how are you?';
      clientCoachInteraction.check_if_client_has_hired_coach.mockResolvedValue(true);
      messaging.insert_message_data_layer.mockResolvedValue('Message sent successfully');

      const result = await messagingBusinessLayer.insert_message_business_layer(currentUserId, recipientId, content);

      expect(result).toBe('Message sent successfully');
      expect(clientCoachInteraction.check_if_client_has_hired_coach).toHaveBeenCalledWith(currentUserId, recipientId);
      expect(messaging.insert_message_data_layer).toHaveBeenCalledWith(currentUserId, recipientId, content);
    });

    test('should reject for invalid current user id', async () => {
      const currentUserId = 'invalidId';

      await expect(messagingBusinessLayer.insert_message_business_layer(currentUserId, 2, 'Hello')).rejects.toThrow('Invalid user id');
    });

    test('should reject for invalid recipient id', async () => {
      const currentUserId = 1;
      const recipientId = 'invalidId';

      await expect(messagingBusinessLayer.insert_message_business_layer(currentUserId, recipientId, 'Hello')).rejects.toThrow('Invalid recipient id');
    });

    test('should reject for empty message content', async () => {
      const currentUserId = 1;
      const recipientId = 2;

      await expect(messagingBusinessLayer.insert_message_business_layer(currentUserId, recipientId, '')).rejects.toThrow('Cannot send empty message');
    });

    test('should reject if current user cannot message recipient', async () => {
      const currentUserId = 1;
      const recipientId = 2;
      clientCoachInteraction.check_if_client_has_hired_coach.mockResolvedValue(false);

      await expect(messagingBusinessLayer.insert_message_business_layer(currentUserId, recipientId, 'Hello')).rejects.toThrow("Current user cannot message another user that's neither their coach nor client");
      expect(clientCoachInteraction.check_if_client_has_hired_coach).toHaveBeenCalledWith(currentUserId, recipientId);
    });
    describe('get_client_coach_messages_business_layer', () => {
        test('should get client-coach messages successfully', async () => {
          const currentUserId = 1;
          const otherUserId = 2;
          const pageSize = 10;
          const pageNum = 1;
          const expectedMessageCount = 20;
          const expectedPageCount = 2;
          const expectedMessages = [{ id: 1, content: 'Hello' }, { id: 2, content: 'Hi' }];
    
          clientCoachInteraction.check_if_client_has_hired_coach.mockResolvedValue(true);
          messaging.count_client_coach_messages_data_layer.mockResolvedValue(expectedMessageCount);
          messaging.get_client_coach_message_page_data_layer.mockResolvedValue(expectedMessages);
    
          const result = await messagingBusinessLayer.get_client_coach_messages_business_layer(
            currentUserId,
            otherUserId,
            pageSize,
            pageNum
          );
    
          expect(result).toEqual({
            page_info: {
              page_num: pageNum,
              page_size: pageSize,
              page_count: expectedPageCount,
              has_next: true,
              has_prev: false,
            },
            messages: expectedMessages,
          });
          expect(clientCoachInteraction.check_if_client_has_hired_coach).toHaveBeenCalledWith(currentUserId, otherUserId);
          expect(messaging.count_client_coach_messages_data_layer).toHaveBeenCalledWith(currentUserId, otherUserId);
          expect(messaging.get_client_coach_message_page_data_layer).toHaveBeenCalledWith(
            currentUserId,
            otherUserId,
            pageSize,
            pageNum
          );
        });
    });
    
    

    // Add more tests for different scenarios, such as error cases, if needed
  });
});
