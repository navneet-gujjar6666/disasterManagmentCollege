const mongoose = require('mongoose');
const RescueTeam = require('../models/rescueTeam');
require('dotenv').config();

async function seedRescueTeams() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if rescue teams already exist
    const existingTeams = await RescueTeam.find();
    if (existingTeams.length > 0) {
      console.log(`✓ Rescue teams already exist (${existingTeams.length} teams found). Skipping seed.`);
      process.exit(0);
    }

    // Array of sample rescue teams
    const rescueTeams = [
      {
        name: 'Alpha Medical Team',
        ngoName: 'International Red Cross',
        specialization: 'medical',
        memberCount: 15,
        contactPerson: 'Dr. John Smith',
        contactPhone: '+1-202-555-0001',
        contactEmail: 'alpha@redcross.org',
        location: {
          type: 'Point',
          coordinates: [-74.0060, 40.7128],
          city: 'New York',
          state: 'NY',
          country: 'USA'
        },
        equipmentList: [
          { name: 'Portable X-Ray Machine', quantity: 2, description: 'Mobile radiography unit' },
          { name: 'Defibrillators', quantity: 5, description: 'AED devices' },
          { name: 'Trauma Kits', quantity: 20, description: 'Medical emergency kits' },
          { name: 'Ambulances', quantity: 3, description: 'Emergency response vehicles' }
        ],
        availability: 'available',
        trainingCertifications: ['Advanced Trauma Life Support', 'Emergency Medicine', 'First Aid'],
        experience: 'expert'
      },
      {
        name: 'Telgu Titans',
        ngoName: 'Indian Red Cross',
        specialization: 'medical',
        memberCount: 15,
        contactPerson: 'Dr. Piyush Gurjar',
        contactPhone: '+91 98945 45238',
        contactEmail: 'piyush@6666.org',
        location: {
          type: 'Point',
          coordinates: [-74.0060, 40.7128],
          city: 'Panvel',
          state: 'Maharastra',
          country: 'INDIA'
        },
        equipmentList: [
          { name: 'Portable X-Ray Machine', quantity: 2, description: 'Mobile radiography unit' },
          { name: 'Defibrillators', quantity: 5, description: 'AED devices' },
          { name: 'Trauma Kits', quantity: 20, description: 'Medical emergency kits' },
          { name: 'Ambulances', quantity: 3, description: 'Emergency response vehicles' }
        ],
        availability: 'available',
        trainingCertifications: ['Advanced Trauma Life Support', 'Emergency Medicine', 'First Aid'],
        experience: 'expert'
      },
      {
        name: 'Chennai Thallivas',
        ngoName: 'Rescue Without Borders',
        specialization: 'search_rescue',
        memberCount: 20,
        contactPerson: 'Sahaj gurjar',
        contactPhone: '+91 8967 23452',
        contactEmail: 'sahaj@6666.org',
        location: {
          type: 'Point',
          coordinates: [-87.6298, 41.8781],
          city: '15Battaliyon',
          state: 'Madhya Pradesh',
          country: 'INDIA'
        },
        equipmentList: [
          { name: 'Search Dogs', quantity: 8, description: 'Trained rescue dogs' },
          { name: 'Rescue Drones', quantity: 3, description: 'Aerial surveillance drones' },
          { name: 'Rope & Harness Sets', quantity: 10, description: 'Climbing and rappelling gear' },
          { name: 'Metal Detectors', quantity: 6, description: 'Ground scanning equipment' },
          { name: 'Thermal Cameras', quantity: 4, description: 'Thermal imaging equipment' }
        ],
        availability: 'available',
        trainingCertifications: ['Search & Rescue Operations', 'Rope Rescue', 'Canine Handler Certification'],
        experience: 'expert'
      },
      {
        name: 'fast searchers',
        ngoName: 'World Vision International',
        specialization: 'logistics',
        memberCount: 12,
        contactPerson: 'Navneet gujjar',
        contactPhone: '+91 96917 33439',
        contactEmail: 'navneet@6666.org',
        location: {
          type: 'Point',
          coordinates: [-118.2437, 34.0522],
          city: 'Indore',
          state: 'Madhya Pradesh',
          country: 'INDIA'
        },
        equipmentList: [
          { name: 'Supply Trucks', quantity: 5, description: 'Large cargo transport vehicles' },
          { name: 'Food Storage Units', quantity: 8, description: 'Climate-controlled containers' },
          { name: 'Water Purification Systems', quantity: 4, description: 'Emergency water treatment' },
          { name: 'Generators', quantity: 6, description: 'Power generation equipment' }
        ],
        availability: 'busy',
        trainingCertifications: ['Disaster Logistics', 'Supply Chain Management', 'Warehouse Operations'],
        experience: 'intermediate'
      },
      {
        name: 'Delta Communication Network',
        ngoName: 'Emergency Communication Foundation',
        specialization: 'communication',
        memberCount: 8,
        contactPerson: 'shivanshu soni',
        contactPhone: '+91 78934 78234',
        contactEmail: 'shivanshu@6666.org',
        location: {
          type: 'Point',
          coordinates: [-77.0369, 38.9072],
          city: 'Rajgarh',
          state: 'Rajastan',
          country: 'INDIA'
        },
        equipmentList: [
          { name: 'Satellite Phones', quantity: 10, description: 'Emergency communication devices' },
          { name: 'Radio Systems', quantity: 5, description: 'Two-way radio networks' },
          { name: 'Communication Towers', quantity: 2, description: 'Mobile signal booster towers' },
          { name: 'Broadcasting Equipment', quantity: 3, description: 'Emergency alert systems' }
        ],
        availability: 'available',
        trainingCertifications: ['Radio Operations', 'Network Communications', 'Emergency Protocols'],
        experience: 'expert'
      }
    ];

    // Insert all rescue teams
    const result = await RescueTeam.insertMany(rescueTeams);
    console.log(`\n✓ Successfully added ${result.length} rescue team(s) to the database!`);
    console.log('\n📋 Rescue Teams Added:');
    result.forEach((team, index) => {
      console.log(`   ${index + 1}. ${team.name} (${team.ngoName}) - ${team.specialization}`);
    });
    console.log(`\n✅ Seeding complete! You can now assign these teams to disasters.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding rescue teams:', error.message);
    process.exit(1);
  }
}

seedRescueTeams();
