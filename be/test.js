const axios = require('axios');
const crypto = require('crypto');

// Base URL for API calls
const BASE_URL = 'https://5cb83tf0-3000.asse.devtunnels.ms/';

// Generate RSA key pair for testing
function generateKeyPair() {
    return crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
}

// Test the complete payment flow
async function testCompletePaymentFlow() {
    console.log('🚀 Starting Cross-Border Payment Flow Test');
    console.log('==========================================\n');

    try {
        // Generate key pair for Thai user (for testing)
        const { publicKey, privateKey } = generateKeyPair();

        // Step 1: Generate QR Code for Malaysian merchant
        console.log('Step 1: Generating QR Code for Malaysian merchant...');
        const qrResponse = await axios.get(`${BASE_URL}/generate-qr/merchant_malay_001`);
        const qrData = qrResponse.data.qrData;
        console.log('✅ QR Code generated:', qrData);
        console.log('');

        // Step 2: Ah Kong scans QR code with Thai e-wallet
        console.log('Step 2: Ah Kong scans QR code with Thai e-wallet...');
        const scanResponse = await axios.post(`${BASE_URL}/scan-qr`, {
            qrCode: qrData.qrCode,
            thaiUserId: 'thai_001'
        });
        const sessionId = scanResponse.data.sessionId;
        console.log('✅ QR Code scanned, session created:', sessionId);
        console.log('   Status:', scanResponse.data.status);
        console.log('');

        // Step 3: Thailand side verifies the data
        console.log('Step 3: Thailand side verifying data...');
        const verifyResponse = await axios.post(`${BASE_URL}/verify-thailand`, {
            sessionId: sessionId,
            privateKey: privateKey // In real scenario, this would be Thailand bank's private key
        });
        console.log('✅ Thailand verification:', verifyResponse.data.verified);
        console.log('   Status:', verifyResponse.data.status);
        console.log('');

        // Step 4: User inputs amount and confirms payment
        console.log('Step 4: Ah Kong inputs amount and confirms payment...');
        const paymentAmount = 1000; // 1000 THB
        const payResponse = await axios.post(`${BASE_URL}/thailand-pay`, {
            sessionId: sessionId,
            amount: paymentAmount
        });
        console.log('✅ Payment initiated:', payResponse.data.status);
        console.log('   Amount:', paymentAmount, 'THB');
        console.log('');

        // Step 5: Monitor payment status
        console.log('Step 5: Monitoring payment status...');
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
            const statusResponse = await axios.get(`${BASE_URL}/payment-status/${sessionId}`);
            const status = statusResponse.data.status;

            console.log(`   Status check ${attempts + 1}:`, status);

            if (status === 'completed') {
                console.log('✅ Payment completed successfully!');
                break;
            } else if (status === 'verification_failed' || status === 'failed') {
                console.log('❌ Payment failed!');
                break;
            }

            attempts++;
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        }

        console.log('\n🎉 Cross-Border Payment Flow Test Completed!');
        console.log('==========================================');

    } catch (error) {
        console.error('❌ Error during test:', error.response?.data || error.message);
    }
}

// Test individual endpoints
async function testIndividualEndpoints() {
    console.log('\n🔧 Testing Individual Endpoints');
    console.log('===============================\n');

    try {
        // Test QR generation
        console.log('Testing QR generation...');
        const qrResponse = await axios.get(`${BASE_URL}/generate-qr/merchant_malay_001`);
        console.log('✅ QR Generation:', qrResponse.data.qrData.merchantName);

        // Test invalid QR
        console.log('Testing invalid merchant...');
        try {
            await axios.get(`${BASE_URL}/generate-qr/invalid_merchant`);
        } catch (error) {
            console.log('✅ Invalid merchant handled:', error.response.data.error);
        }

        console.log('\n✅ All endpoint tests passed!');

    } catch (error) {
        console.error('❌ Endpoint test error:', error.response?.data || error.message);
    }
}

// Main test function
async function runTests() {
    console.log('Cross-Border Payment System Test Suite');
    console.log('======================================\n');

    // Wait for server to be ready
    console.log('Waiting for server to be ready...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test individual endpoints first
    await testIndividualEndpoints();

    // Then test complete flow
    await testCompletePaymentFlow();
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { testCompletePaymentFlow, testIndividualEndpoints }; 