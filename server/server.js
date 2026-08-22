import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

import sequelize from './config/database.js';
import { User, Trip, ItinerarySection, Activity, Post } from './models/index.js';

import authRoutes from './routes/auth.js';
import tripRoutes from './routes/trips.js';
import communityRoutes from './routes/community.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'GlobalTrotter Backend is running' });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/admin', adminRoutes);

// Seeding function
const seedDatabase = async () => {
  try {
    const userCount = await User.count();
    if (userCount > 0) {
      console.log('Database already seeded. Skipping...');
      return;
    }

    console.log('Seeding database with mock data...');

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('password123', 10);

    // Create Users
    const admin = await User.create({
      username: 'admin',
      password: adminPassword,
      first_name: 'System',
      last_name: 'Administrator',
      email: 'admin@globaltrotter.com',
      phone: '+15550199',
      city: 'London',
      is_admin: true,
      additional_info: 'GlobalTrotter Site Admin. Handles platform content and user management.',
      photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
    });

    const john = await User.create({
      username: 'john',
      password: userPassword,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@globaltrotter.com',
      phone: '+15550188',
      city: 'New York',
      is_admin: false,
      additional_info: 'Adventure seeker, photographer, and budget backpacker! Always looking for the next hidden gem.',
      photo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    });

    const alice = await User.create({
      username: 'alice',
      password: userPassword,
      first_name: 'Alice',
      last_name: 'Smith',
      email: 'alice@globaltrotter.com',
      phone: '+33019876',
      city: 'Paris',
      is_admin: false,
      additional_info: 'Museum lover and foodie. I travel to eat and explore historical architecture.',
      photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    });

    // Create Trips for John
    // 1. Ongoing trip (Today is 2026-08-22)
    const tripNYC = await Trip.create({
      title: 'NYC Getaway',
      destination_place: 'New York',
      start_date: '2026-08-20',
      end_date: '2026-08-25',
      userId: john.id
    });

    // 2. Upcoming trip
    const tripParis = await Trip.create({
      title: 'Paris Art & Culture',
      destination_place: 'Paris',
      start_date: '2026-09-10',
      end_date: '2026-09-15',
      userId: john.id
    });

    // 3. Completed trip
    const tripGoa = await Trip.create({
      title: 'Goa Beach Getaway',
      destination_place: 'Goa',
      start_date: '2026-05-15',
      end_date: '2026-05-25',
      budget: 35000.00,
      userId: john.id
    });

    // Create Trips for Alice
    const tripSwiss = await Trip.create({
      title: 'Swiss Alps Hiking',
      destination_place: 'Interlaken',
      start_date: '2026-07-01',
      end_date: '2026-07-08',
      userId: alice.id
    });

    // Create Itinerary Sections (Screen 5) for John's NYC Getaway
    await ItinerarySection.bulkCreate([
      {
        tripId: tripNYC.id,
        title: 'Delta Air Flight',
        description: 'Flight DL102 from LAX to JFK. Departs 8:00 AM, arrives 4:30 PM.',
        start_date: '2026-08-20',
        end_date: '2026-08-20',
        budget: 450.00
      },
      {
        tripId: tripNYC.id,
        title: 'Row NYC Hotel Lodging',
        description: 'Times Square boutique hotel. Room 1402. Check-in 3:00 PM.',
        start_date: '2026-08-20',
        end_date: '2026-08-25',
        budget: 800.00
      },
      {
        tripId: tripNYC.id,
        title: 'Sightseeing & Museum Passes',
        description: 'MET museum entry, Top of the Rock, and Broadway tickets for Wicked.',
        start_date: '2026-08-21',
        end_date: '2026-08-24',
        budget: 350.00
      }
    ]);

    // Create Itinerary Sections for John's Paris Trip
    await ItinerarySection.bulkCreate([
      {
        tripId: tripParis.id,
        title: 'Air France Flight',
        description: 'JFK to CDG overnight flight.',
        start_date: '2026-09-10',
        end_date: '2026-09-11',
        budget: 650.00
      },
      {
        tripId: tripParis.id,
        title: 'Le Marais Boutique Hotel',
        description: 'Cozy flat booking in central Paris.',
        start_date: '2026-09-11',
        end_date: '2026-09-15',
        budget: 900.00
      }
    ]);

    // Create Activities (Screen 9) for NYC Getaway
    await Activity.bulkCreate([
      {
        tripId: tripNYC.id,
        day_number: 1,
        activity_name: 'Airport Transfer & Check-in',
        expense: 45.00,
        order: 1
      },
      {
        tripId: tripNYC.id,
        day_number: 1,
        activity_name: 'Dinner at Times Square Diner',
        expense: 65.00,
        order: 2
      },
      {
        tripId: tripNYC.id,
        day_number: 2,
        activity_name: 'Central Park Walking Tour',
        expense: 0.00,
        order: 1
      },
      {
        tripId: tripNYC.id,
        day_number: 2,
        activity_name: 'MET Museum Visit',
        expense: 30.00,
        order: 2
      },
      {
        tripId: tripNYC.id,
        day_number: 2,
        activity_name: 'Dinner at Carmine\'s Italian',
        expense: 80.00,
        order: 3
      },
      {
        tripId: tripNYC.id,
        day_number: 3,
        activity_name: 'Empire State Building Observatory',
        expense: 48.00,
        order: 1
      },
      {
        tripId: tripNYC.id,
        day_number: 3,
        activity_name: 'Wicked Broadway Show',
        expense: 145.00,
        order: 2
      },
      {
        tripId: tripNYC.id,
        day_number: 4,
        activity_name: 'Brooklyn Bridge Walk',
        expense: 0.00,
        order: 1
      },
      {
        tripId: tripNYC.id,
        day_number: 4,
        activity_name: 'Grimaldi\'s Pizza Lunch',
        expense: 25.00,
        order: 2
      }
    ]);

    // Create Activities for Goa Beach Getaway
    await Activity.bulkCreate([
      {
        tripId: tripGoa.id,
        day_number: 1,
        activity_name: 'Baga Beach Sunset Walk',
        expense: 1500.00,
        order: 1
      },
      {
        tripId: tripGoa.id,
        day_number: 2,
        activity_name: 'Dudhsagar Waterfalls Tour',
        expense: 3500.00,
        order: 1
      },
      {
        tripId: tripGoa.id,
        day_number: 3,
        activity_name: 'Se Cathedral & Old Goa',
        expense: 1200.00,
        order: 1
      }
    ]);

    // Create Activities for Swiss Alps Hiking
    await Activity.bulkCreate([
      {
        tripId: tripSwiss.id,
        day_number: 1,
        activity_name: 'Train to Grindelwald',
        expense: 75.00,
        order: 1
      },
      {
        tripId: tripSwiss.id,
        day_number: 2,
        activity_name: 'Paragliding in Interlaken',
        expense: 220.00,
        order: 1
      },
      {
        tripId: tripSwiss.id,
        day_number: 3,
        activity_name: 'First Cliff Walk Hike',
        expense: 0.00,
        order: 1
      }
    ]);

    // Create Community Posts (Screen 10)
    await Post.bulkCreate([
      {
        content: 'Just got back from paragliding in Interlaken! Honestly, flying over those Swiss lakes with snowy peaks in the background is a core memory unlocked. Absolutely recommended!',
        activity_or_place: 'Paragliding in Interlaken',
        userId: john.id,
        createdAt: new Date(Date.now() - 3600000 * 2) // 2 hours ago
      },
      {
        content: 'Spent an entire afternoon wandering the Louvre in Paris. Pro-tip: Book the 9 AM slot to see the Winged Victory of Samothrace and Mona Lisa before the main crowds arrive!',
        activity_or_place: 'Louvre Art Museum, Paris',
        userId: alice.id,
        createdAt: new Date(Date.now() - 3600000 * 24) // 1 day ago
      },
      {
        content: 'Times Square is crowded but there is nothing like the energy of Broadway. Wicked was fantastic! Make sure to book ticket lotteries in advance for discounts.',
        activity_or_place: 'Broadway Show, New York',
        userId: john.id,
        createdAt: new Date(Date.now() - 3600000 * 48) // 2 days ago
      },
      {
        content: 'Exploring the old historic temples of Kyoto. Fushimi Inari shrine is best visited at sunrise (around 5:30 AM). The path is completely empty and peaceful.',
        activity_or_place: 'Fushimi Inari Shrine, Kyoto',
        userId: alice.id,
        createdAt: new Date(Date.now() - 3600000 * 72) // 3 days ago
      }
    ]);

    console.log('Database seeding finished successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Database check and startup
const startServer = async () => {
  try {
    // 1. Create DB if not exists
    console.log('Checking MySQL server connection...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    console.log(`Ensuring database "${process.env.DB_NAME}" exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    await connection.end();

    // 2. Connect via Sequelize & Sync Tables
    console.log('Connecting via Sequelize...');
    await sequelize.authenticate();
    console.log('Sequelize connected successfully.');

    await sequelize.sync({ force: false, alter: true });
    console.log('Sequelize models synchronized.');

    // 3. Run seeds
    await seedDatabase();

    // 4. Start listening
    app.listen(PORT, () => {
      console.log(`===================================================`);
      console.log(`   GlobalTrotter backend listening on port ${PORT} `);
      console.log(`===================================================`);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
};

startServer();
