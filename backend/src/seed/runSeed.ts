import 'reflect-metadata';
import dotenv from 'dotenv';
import { seedDatabase } from './seedDatabase';

// Load environment variables
dotenv.config();

const runSeed = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    await seedDatabase();
    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

runSeed(); 