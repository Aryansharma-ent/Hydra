import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import path from 'path';
import connectDB from './config/db'
import ErrorHandler from './Middlewares/ErrorHandler'
import AuthRoutes from './Routes/AuthRoutes';
import TestRunRoutes from './Routes/TestRunRoutes'
import ProjectRoutes from './Routes/ProjectRoutes';
import billingRoutes from './Routes/BillingRoutes';
const app = express()
connectDB()
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use('/api/billing', billingRoutes);
app.use('/api/tests',TestRunRoutes)
app.use('/api/projects',ProjectRoutes)
app.use('/api/auth', AuthRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Hydra API is healthy & active' });
});

app.use(ErrorHandler)
app.listen(process.env.PORT,()=>{
    console.log(`Server is running at PORT ...... ${process.env.PORT}` )
})