const mongoose = require('mongoose');
const Disaster = require('../models/disaster');
require('dotenv').config();

async function addSampleData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if disasters already exist
    const existingDisasters = await Disaster.find();
    if (existingDisasters.length > 0) {
      console.log('Sample data already exists. Skipping seed.');
      process.exit(0);
    }

    // Array of sample disasters
    //node utils/addSampleData.js
    const disasters = [
      {
        title: 'Earthquake in Turkey',
        description: 'A devastating 7.8 magnitude earthquake struck Turkey affecting millions',
        type: 'earthquake',
        severity: 'critical',
        location: {
          type: 'Point',
          coordinates: [35.5007, 38.7597],
          address: 'Kahramanmaras, Turkey',
          city: 'Kahramanmaras',
          state: 'Kahramanmaras',
          country: 'Turkey'
        },
        startDate: new Date('2023-02-06T04:17:00Z'),
        endDate: new Date('2023-02-13T00:00:00Z'),
        status: 'active',
        affectedAreas: [
          {
            name: 'Kahramanmaras',
            coordinates: [35.5007, 38.7597],
            population: 2500000,
            damageLevel: 'devastating'
          },
          {
            name: 'Gaziantep',
            coordinates: [37.3833, 37.7667],
            population: 2100000,
            damageLevel: 'severe'
          }
        ],
        casualties: 50000,
        damageEstimate: 100000000,
        commonNeeds: ['food', 'water', 'shelter', 'medical', 'clothing']
      },
      {
        title: 'Flood in Nanital',
        description: 'Severe monsoon flooding affecting multiple areas in Nanital',
        type: 'flood',
        severity: 'high',
        location: {
          type: 'Point',
          coordinates: [30.1575, 71.5249],
          address: 'Jam Nagar, UK ',
          city: 'Nanital',
          state: 'Uttrakhand',
          country: 'INDIA'
        },
        startDate: new Date('2023-08-15T00:00:00Z'),
        endDate: new Date('2023-09-30T00:00:00Z'),
        status: 'active',
        affectedAreas: [
          {
            name: 'Haldwani',
            coordinates: [30.1575, 71.5249],
            population: 5000000,
            damageLevel: 'severe'
          },
          {
            name: 'Bhimtal',
            coordinates: [28.5355, 65.5597],
            population: 3000000,
            damageLevel: 'moderate'
          }
        ],
        casualties: 1500,
        damageEstimate: 2500000,
        commonNeeds: ['food', 'water', 'shelter', 'clothing', 'transportation']
      },
      {
        title: 'Tsunami in Mumbai',
        description: 'Earthquake-triggered tsunami affecting Mumbai coast',
        type: 'tsunami',
        severity: 'critical',
        location: {
          type: 'Point',
          coordinates: [-8.6705, 115.2126],
          address: 'hawa bangla, INDIA',
          city: 'Mumbai',
          state: 'Mahrastra',
          country: 'INDIA'
        },
        startDate: new Date('2023-11-08T02:04:00Z'),
        endDate: new Date('2023-11-10T00:00:00Z'),
        status: 'active',
        affectedAreas: [
          {
            name: 'panvel',
            coordinates: [-8.6705, 115.2126],
            population: 4300000,
            damageLevel: 'devastating'
          },
          {
            name: 'west_malard',
            coordinates: [-8.6500, 116.3667],
            population: 3500000,
            damageLevel: 'severe'
          }
        ],
        casualties: 2000,
        damageEstimate: 30000000,
        commonNeeds: ['food', 'water', 'shelter', 'medical', 'transportation']
      }
    ];

    // Insert all disasters
    const result = await Disaster.insertMany(disasters);
    console.log(`✓ Successfully added ${result.length} disaster(s) to the database!`);
    console.log('Sample data includes: Earthquake, Flood, Hurricane, Wildfire, Tsunami, Tornado, Volcanic Eruption, Landslide');
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample data:', error);
    process.exit(1);
  }
}

addSampleData();
