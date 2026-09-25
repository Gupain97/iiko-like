import express from 'express'; 
import authRouter from './modules/auth/auth.routes'; 
import path from 'path';
import ordersRoutes from './modules/orders/order.routes';
import menuRoutes from './modules/menu/menu.routes';
import adminRoutes from './admin/admin.ruotes';
import shiftsRoutes from './modules/shifts/shifts.routes';
import deliveryRoutes from './modules/delivery/delivery.routes';
import orderItemsRoutes from './modules/order-items/orderItems.routes';
import stopListRoutes from './modules/stop-list/stop-list.routes';
import callCenterRoutes from './intergrations/call-center/call-center.routes';
import { errorHandler } from './middlewares/errorHandler';
import { pool } from './config/db';
import  stationRoutes  from './modules/station/station.routes';
import cors from "cors"
import cookieParser from 'cookie-parser';




export const app = express();
app.use(cors({
    origin: "http://localhost:8080",
    credentials: true
}));
app.use(cookieParser());

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

app.use('/api/stop-list', stopListRoutes);

app.use('/api/station', stationRoutes);

app.use('/api/call-center', callCenterRoutes);







app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/main.html'));
});

app.get('/admin', (req, res)  => {
    res.sendFile(path.join(__dirname, '../public/html/admin.html'));
});


app.get('/station', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/station.html'));
})
pool.query("SELECT NOW()")
  .then(res => console.log("DB connected:", res.rows[0]))
  .catch(err => console.error("DB error:", err));


app.use(errorHandler);
