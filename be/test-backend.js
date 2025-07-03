const axios = require('axios');

const BASE_URL = 'https://5cb83tf0-3000.asse.devtunnels.ms/';

async function testBackend() {
    console.log('🧪 Testing Cross-Border Payment Backend');
    console.log('=====================================\n');

    try {
        // Test 1: Generate QR Code
        console.log('1. Testing QR Generation...');
        const qrResponse = await axios.get(`${BASE_URL}/generate-qr/merchant_malay_001`);
        console.log('✅ QR Generated:', qrResponse.data.qrData.qrCode);
        console.log('   Merchant:', qrResponse.data.qrData.merchantName);
        console.log('');

        // Test 2: Scan QR Code
        console.log('2. Testing QR Scan...');
        const scanResponse = await axios.post(`${BASE_URL}/scan-qr`, {
            qrCode: qrResponse.data.qrData.qrCode,
            thaiUserId: 'thai_001'
        });
        console.log('✅ QR Scanned successfully');
        console.log('   Session ID:', scanResponse.data.sessionId);
        console.log('   Status:', scanResponse.data.status);
        console.log('');

        const sessionId = scanResponse.data.sessionId;

        // Test 3: Get Private Key
        console.log('3. Getting Private Key for verification...');
        const keyResponse = await axios.get(`${BASE_URL}/get-private-key/thai_001`);
        console.log('✅ Private key retrieved');
        console.log('');

        // Test 4: Verify Thailand Data
        console.log('4. Testing Thailand Verification...');
        const verifyResponse = await axios.post(`${BASE_URL}/verify-thailand`, {
            sessionId: sessionId,
            privateKey: keyResponse.data.privateKey
        });
        console.log('✅ Verification result:', verifyResponse.data.verified);
        console.log('   Status:', verifyResponse.data.status);
        console.log('');

        // Test 5: Process Payment
        console.log('5. Testing Payment Processing...');
        const paymentResponse = await axios.post(`${BASE_URL}/thailand-pay`, {
            sessionId: sessionId,
            amount: 1000
        });
        console.log('✅ Payment initiated');
        console.log('   Amount:', paymentResponse.data.amount, 'THB');
        console.log('   Status:', paymentResponse.data.status);
        console.log('');

        // Test 6: Check Payment Status
        console.log('6. Checking Payment Status...');
        await new Promise(resolve => setTimeout(resolve, 4000)); // Wait for payment completion

        const statusResponse = await axios.get(`${BASE_URL}/payment-status/${sessionId}`);
        console.log('✅ Final Status:', statusResponse.data.status);
        console.log('   Thailand Verified:', statusResponse.data.thailandVerified);
        console.log('   Malaysia Verified:', statusResponse.data.malayVerified);
        console.log('');

        console.log('🎉 All tests completed successfully!');
        console.log('Backend is working correctly.');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        console.log('\nMake sure the backend server is running: node main.js');
    }
}

// Run tests
testBackend(); 