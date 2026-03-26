import { app } from './app'; 

const PORT = 3000;


app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});