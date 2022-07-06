import net from 'net';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { readFile, getExtName } from './utils/file.js';
import { parseURI } from './utils/http.js';
import { MIME_TYPES, STATUS_CODES } from './constants/http.js';

const DIR_NAME = dirname(fileURLToPath(import.meta.url));
const PUBLIC_PATH = `${DIR_NAME}/public`;

export default class TCPServerSocket {
    server;
    port;
    ip;

    constructor(ip, port) {
        this.port = port;
        this.ip = ip;

        this.server = net.createServer();
        this.server.listen(port, ip);

        this.server.on('listening', this.handleOnListening.bind(this));
        this.server.on('connection', this.handleOnConnection.bind(this));
    }

    handleOnListening() {
        console.log(`Server is listening on ${this.ip}:${this.port}`);
    }

    handleOnConnection(clientSocket) {
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
    }
}
