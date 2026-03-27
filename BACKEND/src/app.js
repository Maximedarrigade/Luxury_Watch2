import express from 'express'; 
import 'dotenv/config'; 
import authRoutes from './routes/auth.route.js'; 

const app = express(); 

app.use(express.json()); 
app.use('/api/auth', authRoutes); 

app.get('/', (req, res) => res.send('API Auth Backend fonctionne')); 

export default app; 