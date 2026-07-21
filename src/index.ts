import { app } from './app'; 
import './websocket/firstSocet';

const PORT = 3000;


app.listen(PORT, "0.0.0.0",  () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});


// wss.on('connection', (ws) => {
//     console.log('ws connected');
//     ws.send('hello from server');
// })