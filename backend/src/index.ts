import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import areaRoutes from './routes/areas';
import processRoutes from './routes/processes';
import { initializeDatabase } from './config/database';
import { seedDatabase } from './seed/seedDatabase';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/areas', areaRoutes);
app.use('/api/processes', processRoutes);

// Database Console Endpoints
app.get('/db/state', async (req, res) => {
  try {
    const { AppDataSource } = await import('./config/database');
    const areaRepository = AppDataSource.getRepository('Area');
    const processRepository = AppDataSource.getRepository('Process');
    
    const areas = await areaRepository.find({ relations: ['processes'] });
    const processes = await processRepository.find({ relations: ['area', 'parent', 'children'] });
    
    res.status(200).json({ areas, processes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get database state' });
  }
});

app.post('/db/seed', async (req, res) => {
  try {
    await seedDatabase();
    res.status(200).json({ message: 'Database seeded with sample data.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed database' });
  }
});

// Start the server
const startServer = async () => {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log('📊 Database console endpoints:');
      console.log(`  GET /db/state`);
      console.log(`  POST /db/seed`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

