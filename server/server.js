const fs = require('fs').promises;
const net = require('net');
const path = require('path');
const { SERVER_IP, SERVER_PORT } = require('dotenv').config().parsed;
const { MIME_TYPES, STATUS_CODES } = require('./constants/http.js');
const { readFile } = require('./utils/file.js');
const { parseURI } = require('./utils/http.js');

const PUBLIC_PATH = `${__dirname}/public`;

// (1) socket()
const server = net.createServer();

// (2) bind() and listen() and accept() waiting client .....
server.listen(SERVER_PORT, SERVER_IP);

server.on('listening', () => {
    console.log(`Server is listening on ${SERVER_IP}:${SERVER_PORT}`);
});

// (3) connect() from client
server.on('connection', clientSocket => {
    clientSocket.on('data', async data => {
        const requestHeader = data.toString('utf-8');
        const [method, requestURI, httpVersion] = requestHeader
            .split('\r\n')[0]
            .split(' ');

        const filePath = parseURI({ PUBLIC_PATH, requestURI });
        const extname = path.extname(filePath).toLocaleLowerCase();

        const { error, content } = await readFile(filePath);

        const messageBody = error ? '' : content;
        const reponseStatus = error ? '404' : '200';
        const contentLength = content.length;

        const responseHeader = [
            `${httpVersion} ${reponseStatus} ${STATUS_CODES[reponseStatus]}`,
            `Content-Type: ${MIME_TYPES[extname]}`,
            `Content-Length : ${contentLength}`,
            'Connection: keep-alive',
            '',
            '',
        ].join('\r\n');

        clientSocket.write(responseHeader);
        clientSocket.write(messageBody);
        clientSocket.end();
    });
});
