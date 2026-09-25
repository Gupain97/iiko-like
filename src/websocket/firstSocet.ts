import { WebSocketServer } from 'ws';


export const wss = new WebSocketServer({port: 3001});
export const deliveryWss = new WebSocketServer({port: 3002});


export class WebSocketService {
    constructor (
        private readonly wss: WebSocketServer
    ) {}

    sendMessage(message: string) {
        this.wss.clients.forEach(client => {
            client.send(message);
            
        })
    }
}

wss.on('connection', (ws) => {
    console.log('connecting wss on 3001');
    ws.send('hello from backend');
})