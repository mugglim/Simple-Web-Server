import dotenv from 'dotenv';

import TCPServerSocket from './TCPServerSocket.js';

const { SERVER_IP, SERVER_PORT } = dotenv.config().parsed;

const serverSocket = new TCPServerSocket(SERVER_IP, SERVER_PORT);
