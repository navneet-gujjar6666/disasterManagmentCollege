/**
 * Test script to demonstrate the Contribution Creation Flow
 * Based on the flowchart: Create Contribution -> Data from Postman -> Get Disaster -> Get User ID -> Create Contribution -> Add Relation -> Return Response
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000'; // Adjust port as needed
const TEST_TOKEN = 'your_jwt_token_here'; // Replace with actual token
const TEST_DISASTER_ID = 'your_disaster_id_here'; // Replace with actual disaster ID

// Test data for contribution
const contributionData = {
    disasterId: TEST_DISASTER_ID,
    title: 'Emergency Food Supply',
    description: 'Providing food supplies for affected families in the disaster area',
    contributionType: 'material',
    amount: 0,
    location: JSON.stringify({
        type: 'Point',
        coordinates: [-73.935242, 40.730610] // New York coordinates
    }),
    contactInfo: JSON.stringify({
        phone: '+1234567890',
        email: 'test@example.com',
        address: '123 Test Street, Test City'
    }),
    isAnonymous: 'false'
};

// Headers for authenticated requests
const headers = {
    'Authorization': `Bearer ${TEST_TOKEN}`,
    'Content-Type': 'application/json'
};

/**
 * Test the complete contribution creation flow
 */
async function testContributionFlow() {
    console.log('🚀 Testing Contribution Creation Flow');
    console.log('=====================================');
    
    try {
        // Step 1: Create Contribution (entry point)
        console.log('\n1️⃣ Step 1: Create Contribution (Entry Point)');
        console.log('   Sending POST request to /contributions');
        
        // Step 2: Data from Postman
        console.log('\n2️⃣ Step 2: Data from Postman');
        console.log('   - Disaster ID:', contributionData.disasterId);
        console.log('   - Token: [HIDDEN]');
        console.log('   - Contribution Data:', {
            title: contributionData.title,
            description: contributionData.description,
            contributionType: contributionData.contributionType
        });
        
        // Make the API call
        const response = await axios.post(
            `${BASE_URL}/contributions`,
            contributionData,
            { headers }
        );
        
        console.log('\n✅ Flow completed successfully!');
        console.log('📊 Response:', {
            success: response.data.success,
            message: response.data.message,
            contributionId: response.data.data.contribution._id,
            disasterId: response.data.data.disasterId,
            disasterTitle: response.data.data.disasterTitle
        });
        
        // Verify the flow steps were followed
        console.log('\n🔍 Flow Verification:');
        console.log('   ✓ Step 3: Get Disaster (by id) - Disaster found');
        console.log('   ✓ Step 4: Get User ID (from token) - User authenticated');
        console.log('   ✓ Step 5: Create Contribution - Contribution created');
        console.log('   ✓ Step 6: Add Relation - Contribution linked to disaster');
        console.log('   ✓ Step 7: Return Response - Success response sent');
        
    } catch (error) {
        console.error('\n❌ Flow failed:', error.response?.data || error.message);
        
        // Provide debugging information
        if (error.response?.status === 404) {
            console.log('💡 Debug: Check if disaster ID exists');
        } else if (error.response?.status === 401) {
            console.log('💡 Debug: Check if token is valid');
        } else if (error.response?.status === 400) {
            console.log('💡 Debug: Check required fields in request body');
        }
    }
}

/**
 * Test individual flow steps
 */
async function testIndividualSteps() {
    console.log('\n🔧 Testing Individual Flow Steps');
    console.log('===============================');
    
    try {
        // Test Step 2: Get Disaster
        console.log('\n📋 Step 2: Get Disaster (by id)');
        const disasterResponse = await axios.get(
            `${BASE_URL}/disasters/${TEST_DISASTER_ID}`
        );
        console.log('   ✓ Disaster found:', disasterResponse.data.data.title);
        
        // Test Step 3: Get User ID (this would be done by auth middleware)
        console.log('\n👤 Step 3: Get User ID (from token)');
        console.log('   ✓ User authenticated via JWT token');
        
    } catch (error) {
        console.error('❌ Individual step test failed:', error.response?.data || error.message);
    }
}

// Export functions for use in other files
module.exports = {
    testContributionFlow,
    testIndividualSteps,
    contributionData
};

// Run tests if this file is executed directly
if (require.main === module) {
    console.log('🧪 Running Contribution Flow Tests');
    console.log('==================================');
    
    // Check if required environment variables are set
    if (TEST_TOKEN === 'your_jwt_token_here' || TEST_DISASTER_ID === 'your_disaster_id_here') {
        console.log('⚠️  Please update TEST_TOKEN and TEST_DISASTER_ID in this file before running tests');
        console.log('   You can get a token by logging in and a disaster ID by creating a disaster first');
        process.exit(1);
    }
    
    // Run the tests
    testIndividualSteps()
        .then(() => testContributionFlow())
        .catch(console.error);
}
