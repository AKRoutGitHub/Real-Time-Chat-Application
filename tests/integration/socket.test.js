const io = require('socket.io-client');

describe('Socket.IO Chat', () => {
    let clientSocket;

    beforeEach((done) => {
        clientSocket = io('http://localhost:3000');
        clientSocket.on('connect', done);
    });

    afterEach(() => {
        clientSocket.close();
    });

    test('should join chat room', (done) => {
        clientSocket.emit('joinRoom', { username: 'testUser', room: 'TestRoom' });
        clientSocket.on('message', (message) => {
            expect(message.text).toContain('Welcome');
            done();
        });
    });
});