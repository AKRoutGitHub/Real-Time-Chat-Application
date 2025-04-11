const formatMessage = require('../../utils/messages');

describe('Message Formatting', () => {
    test('should format message correctly', () => {
        const username = 'testUser';
        const text = 'Hello World';
        const message = formatMessage(username, text);

        expect(message).toHaveProperty('username', username);
        expect(message).toHaveProperty('text', text);
        expect(message).toHaveProperty('time');
    });
});