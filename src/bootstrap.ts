import { deliveryWss, WebSocketService, wss } from './websocket/firstSocet';

export const webSocketService = new WebSocketService(wss);
export const deliveryWebSocketService = new WebSocketService(deliveryWss)

