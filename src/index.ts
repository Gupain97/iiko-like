import { app } from './app'; 

const PORT = 3000;


app.listen(PORT, "0.0.0.0",  () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});