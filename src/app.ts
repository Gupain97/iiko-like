import express from 'express'; 
import authRouter from './routes/auth'; 
import path from 'path';
// import tablesRouter from './modules/tables/tables.routes';
import ordersRoutes from './modules/orders/order.routes';
import menuRoutes from './modules/menu/menu.routes';
import adminRoutes from './admin/admin.ruotes';
import shiftsRoutes from './modules/shifts/shifts.routes';
import deliveryRoutes from './modules/delivery/delivery.routes';
import orderItemsRoutes from './modules/order-items/orderItems.routes';
import { errorHandler } from './middlewares/errorHandler';
import { pool } from './config/db';




export const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth', authRouter);

app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

// app.use('/api/tables', tablesRouter);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/shifts', shiftsRoutes);


app.use('/api/admin', adminRoutes);

app.use('/api/delivery', deliveryRoutes);

app.use('/api/order-items', orderItemsRoutes);








app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/main.html'));
});

app.get('/admin', (req, res)  => {
    res.sendFile(path.join(__dirname, '../public/html/admin.html'));
});

pool.query("SELECT NOW()")
  .then(res => console.log("DB connected:", res.rows[0]))
  .catch(err => console.error("DB error:", err));



app.use(errorHandler);

// app.get('/table', (req, res) =>{
//     res.sendFile(path.join(__dirname, '../public/html/table.html'));
// });



// app.use(express.static(path.join(__dirname, '../public')));


// app.get('/', (req, res) =>{
//     res.send("Сервер запущен");
// });

// const PORT = 3000 

// app.listen(PORT, () =>{
//     console.log("Сервер запущен на порту ${PORT}");
// });