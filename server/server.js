import net from 'net';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { readFile, getExtName } from './utils/file.js';
import { parseURI } from './utils/http.js';
import { MIME_TYPES, STATUS_CODES } from './constants/http.js';

const { SERVER_IP, SERVER_PORT } = dotenv.config().parsed;
const DIR_NAME = dirname(fileURLToPath(import.meta.url));
const PUBLIC_PATH = `${DIR_NAME}/public`;

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
        const extname = getExtName(filePath);

        const { error, content } = await readFile(filePath);

        const [messageBody, reponseStatus] = error
            ? ['', '404']
            : [content, '200'];
        const contentLength = content ? content.length : '0';

        const headers = [
            `${httpVersion} ${reponseStatus} ${STATUS_CODES[reponseStatus]}`,
            `Content-Type: ${MIME_TYPES[extname]}`,
            `Content-Length : ${contentLength}`,
            'Connection: keep-alive',
            '',
            '',
        ].join('\r\n');

        const response = Buffer.concat([Buffer.from(headers), messageBody]);

        clientSocket.write(response);
        clientSocket.end();
    });
});
