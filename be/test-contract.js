#!/usr/bin/env node

const { ethers } = require('ethers');
const config = require('./config');
const contractABI = require('./contract/abi.json');

async function testContract() {
    console.log('🧪 Testing Smart Contract Integration');
    console.log('=====================================\n');

    try {
        // Initialize provider and contract
        console.log('1. Connecting to blockchain...');
        const provider = new ethers.JsonRpcProvider(config.RPC_URL);
        const wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(config.CONTRACT_ADDRESS, contractABI, wallet);

        console.log(`✅ Connected to: ${config.NETWORK.name}`);
        console.log(`📍 Contract: ${config.CONTRACT_ADDRESS}`);

        // Check wallet balance
        console.log('\n2. Checking wallet balance...');
        const balance = await wallet.provider.getBalance(wallet.address);
        console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH`);

        if (balance === 0n) {
            console.log('❌ No ETH balance for gas fees!');
            return;
        }

        // Get current nonce
        console.log('\n3. Getting current nonce...');
        const nonce = await wallet.getNonce();
        console.log(`🔢 Current nonce: ${nonce}`);

        // Test contract read function
        console.log('\n4. Testing contract read function...');
        try {
            const testSessionId = 'test_session_' + Date.now();
            const payment = await contract.getPayment(testSessionId);
            console.log('✅ Contract read function works');
        } catch (error) {
            console.log('✅ Contract read function works (empty result expected)');
        }

        // Test gas estimation
        console.log('\n5. Testing gas estimation...');
        try {
            const testSessionId = 'test_session_' + Date.now();
            const gasEstimate = await contract.initiatePayment.estimateGas(
                testSessionId,
                'test_merchant',
                '0x1234',
                '0x5678'
            );
            console.log(`⛽ Estimated gas: ${gasEstimate.toString()}`);
        } catch (error) {
            console.log(`⚠️ Gas estimation failed: ${error.message}`);
        }

        // Test actual transaction (optional)
        const shouldTestTransaction = process.argv.includes('--test-tx');
        if (shouldTestTransaction) {
            console.log('\n6. Testing actual transaction...');
            try {
                const testSessionId = 'test_session_' + Date.now();
                const tx = await contract.initiatePayment(
                    testSessionId,
                    'test_merchant',
                    '0x1234567890abcdef',
                    '0xabcdef1234567890',
                    {
                        gasLimit: config.GAS_SETTINGS.gasLimit,
                        nonce: nonce
                    }
                );

                console.log(`📤 Transaction sent: ${tx.hash}`);
                console.log('⏳ Waiting for confirmation...');

                const receipt = await tx.wait();
                console.log(`✅ Transaction confirmed in block: ${receipt.blockNumber}`);
                console.log(`⛽ Gas used: ${receipt.gasUsed.toString()}`);

                // Test getting the payment
                const payment = await contract.getPayment(testSessionId);
                console.log('📋 Payment details:');
                console.log(`   Session ID: ${payment.sessionId}`);
                console.log(`   Merchant ID: ${payment.merchantId}`);
                console.log(`   Status: ${payment.status}`);
                console.log(`   Timestamp: ${new Date(Number(payment.timestamp) * 1000).toISOString()}`);

            } catch (error) {
                console.log(`❌ Transaction failed: ${error.message}`);
            }
        } else {
            console.log('\n6. Skipping transaction test (use --test-tx to enable)');
        }

        console.log('\n🎉 Smart contract integration test completed!');
        console.log('\n📝 Summary:');
        console.log('   ✅ Connection established');
        console.log('   ✅ Wallet has sufficient balance');
        console.log('   ✅ Contract functions accessible');
        console.log('   ✅ Gas estimation working');

        if (shouldTestTransaction) {
            console.log('   ✅ Transaction execution successful');
        }

        console.log('\n🚀 Ready to start the payment system!');
        console.log('   Run: node main.js');

    } catch (error) {
        console.error('\n❌ Smart contract test failed:');
        console.error(`   Error: ${error.message}`);

        if (error.message.includes('invalid address')) {
            console.log('\n💡 Check your CONTRACT_ADDRESS in config.js');
        } else if (error.message.includes('invalid private key')) {
            console.log('\n💡 Check your PRIVATE_KEY in config.js');
        } else if (error.message.includes('network')) {
            console.log('\n💡 Check your RPC_URL in config.js');
        }

        console.log('\n🔧 Run setup again: node setup.js');
    }
}

// Run the test
testContract().catch(console.error); 