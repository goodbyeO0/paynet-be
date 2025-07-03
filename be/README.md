# Cross-Border Payment System with Smart Contract Integration

A complete cross-border payment system that enables Thai tourists to pay Malaysian merchants using QR codes with smart contract validation and automatic fund transfers.

## 🚀 Features

- **Real Smart Contract Integration** - All transactions recorded on blockchain
- **RSA Encryption** - Secure data encryption/decryption
- **Cross-Border Payments** - Thailand ↔ Malaysia with currency conversion
- **QR Code Payments** - Simple scan-to-pay interface
- **Real-time Status Tracking** - Live payment progress updates
- **Event Listening** - Smart contract event monitoring
- **Gas Optimization** - Efficient transaction handling

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Deployed smart contract on Ethereum/Polygon/etc.
- RPC URL (Alchemy, Infura, etc.)
- Wallet private key with gas funds

## ⚙️ Setup Instructions

### 1. Quick Setup (Recommended)

```bash
# Clone and install dependencies
cd testing
npm install

# Run the interactive setup
node setup.js
```

The setup script will guide you through:

- Contract address configuration
- Private key setup
- RPC URL configuration
- Network detection

### 2. Manual Setup

1. **Configure Smart Contract**

   ```bash
   cp config.js.example config.js
   # Edit config.js with your values
   ```

2. **Update config.js**

   ```javascript
   module.exports = {
     CONTRACT_ADDRESS: "0xYourContractAddress",
     PRIVATE_KEY: "your_private_key_without_0x",
     RPC_URL: "https://your-rpc-url",
     // ... other settings
   };
   ```

3. **Ensure ABI File**
   - Place your contract ABI at `./contract/abi.json`

### 3. Start the System

```bash
# Start backend
node main.js

# Test backend (optional)
node test-backend.js

# Start frontend (in another terminal)
cd ../learn/learn-fe
npm install
npm run dev
```

## 🔧 Configuration

### Contract Configuration (config.js)

```javascript
module.exports = {
  // Your deployed smart contract address
  CONTRACT_ADDRESS: "0x1946cC6D573FDf916cc2BE7183AcB89f6a6B2193",

  // Wallet private key (deployer wallet)
  PRIVATE_KEY: "your_64_character_private_key",

  // RPC endpoint
  RPC_URL: "https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY",

  // Network information
  NETWORK: {
    name: "Sepolia Testnet",
    chainId: 11155111,
    currency: "ETH",
  },

  // Gas optimization
  GAS_SETTINGS: {
    gasLimit: 500000,
    gasPrice: null, // Auto-calculate
  },
};
```

### Supported Networks

- **Ethereum Mainnet** - Chain ID: 1
- **Sepolia Testnet** - Chain ID: 11155111
- **Polygon Mainnet** - Chain ID: 137
- **Any EVM-compatible network**

## 🏗️ Smart Contract Integration

### Required Contract Functions

Your smart contract must implement these functions:

```solidity
// Initialize payment with encrypted data
function initiatePayment(
    string memory sessionId,
    string memory merchantId,
    bytes memory hashedData,
    bytes memory encryptedData
) public;

// Confirm Thailand verification
function confirmThailandVerification(
    string memory sessionId,
    bool verified
) public;

// Process Thailand payment
function processThailandPayment(
    string memory sessionId,
    string memory thaiUserId,
    uint256 amount
) public;

// Confirm payments
function confirmThailandPayment(string memory sessionId, bool success) public;
function confirmMalaysiaPayment(string memory sessionId, string memory malayUserId, bool success) public;
```

### Events Emitted

The system listens for these events:

```solidity
event VerifyThailandData(string indexed sessionId, string merchantId, bytes hashedData, bytes encryptedData, uint256 timestamp);
event ThailandVerified(string indexed sessionId, bool verified, uint256 timestamp);
event ThailandPay(string indexed sessionId, string thaiUserId, uint256 amount, uint256 timestamp);
event PaymentCompleted(string indexed sessionId, uint256 amount, uint256 timestamp);
```

## 🎯 How It Works

### 1. QR Code Generation

- Malaysian merchant generates QR code
- QR contains merchant ID and payment details

### 2. QR Scanning & Verification

- Thai user scans QR code
- System encrypts payment data with user's public key
- Smart contract records verification request
- Thailand bank decrypts and verifies data
- Verification result recorded on blockchain

### 3. Payment Processing

- User enters payment amount
- Smart contract processes payment with amount in wei
- Thailand bank balance updated
- Malaysian merchant balance updated (with currency conversion)
- Payment completion recorded on blockchain

### 4. Event Monitoring

- Real-time smart contract event listening
- Automatic status updates
- Transaction hash tracking
- Block confirmation monitoring

## 📊 API Endpoints

### Core Endpoints

- `GET /generate-qr/:merchantId` - Generate merchant QR code
- `POST /scan-qr` - Scan QR and initiate payment
- `POST /verify-thailand` - Verify encrypted data
- `POST /thailand-pay` - Process payment
- `GET /payment-status/:sessionId` - Get payment status

### Smart Contract Endpoints

- `GET /contract-info` - Get contract connection status
- `GET /get-private-key/:userId` - Get user private key (testing only)

## 🧪 Testing

### 1. Backend Testing

```bash
# Test all endpoints
node test-backend.js

# Expected output:
✅ QR Generated: MY_QR_001_KL_SHOPPING
✅ QR Scanned successfully
✅ Private key retrieved
✅ Verification result: true
✅ Payment initiated
✅ Final Status: completed
```

### 2. Frontend Testing

1. Open `http://localhost:5173`
2. Check smart contract status indicator
3. Generate QR code as merchant
4. Scan QR code as Thai user
5. Complete payment flow

### 3. Smart Contract Verification

- Check transaction hashes on blockchain explorer
- Verify events are emitted correctly
- Monitor gas usage

## 🔍 Monitoring & Debugging

### Console Output

```bash
✅ Smart contract connected successfully
📤 Calling smart contract: initiatePayment
⏳ Waiting for transaction confirmation...
✅ Transaction confirmed: 0x1234...
🔍 Event: VerifyThailandData
💰 Event: ThailandPay
🎉 Event: PaymentCompleted
```

### Frontend Status

- **Green dot**: Smart contract connected
- **Red dot**: Smart contract disconnected
- **Yellow dot**: Connection checking

### Error Handling

- Automatic fallback to mock contract if connection fails
- Detailed error messages in console
- Transaction retry mechanisms

## 🔒 Security Considerations

### Private Key Management

- **Never commit private keys to version control**
- Use environment variables in production
- Consider using hardware wallets for mainnet

### Gas Management

- Monitor gas prices for cost optimization
- Set appropriate gas limits
- Handle failed transactions gracefully

### Data Encryption

- RSA-2048 encryption for sensitive data
- SHA-256 hashing for data integrity
- Secure key generation and storage

## 🚀 Production Deployment

### Environment Variables

```bash
export CONTRACT_ADDRESS="0xYourContractAddress"
export PRIVATE_KEY="your_private_key"
export RPC_URL="https://your-production-rpc"
```

### Docker Deployment

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "main.js"]
```

### Monitoring

- Set up transaction monitoring
- Alert on failed transactions
- Monitor gas usage and costs
- Track payment completion rates

## 📁 Project Structure

```
testing/
├── contract/
│   └── abi.json              # Smart contract ABI
├── data/
│   ├── ThaiBank.json         # Thai bank data
│   └── Maybank.json          # Malaysian bank data
├── main.js                   # Main server application
├── config.js                 # Smart contract configuration
├── setup.js                  # Interactive setup script
├── test-backend.js           # Backend testing script
└── README.md                 # This file
```

## 🛠️ Troubleshooting

### Common Issues

1. **Contract Connection Failed**

   ```
   ❌ Failed to connect to smart contract
   ```

   - Check contract address format
   - Verify RPC URL is accessible
   - Ensure private key is correct

2. **Transaction Failed**

   ```
   Error: insufficient funds for gas
   ```

   - Add ETH to wallet for gas fees
   - Reduce gas limit in config
   - Check network congestion

3. **ABI Not Found**
   ```
   Cannot find module './contract/abi.json'
   ```
   - Ensure ABI file exists at correct path
   - Verify ABI format is valid JSON

### Debug Mode

```bash
# Enable detailed logging
DEBUG=* node main.js
```

## 📞 Support

For issues or questions:

1. Check the console output for detailed error messages
2. Verify smart contract deployment
3. Test with mock contract first
4. Check network connectivity and gas balance

## 🔄 Updates

To update the system:

1. Pull latest changes
2. Update contract ABI if needed
3. Run `npm install` for new dependencies
4. Restart the server

---

**⚠️ Security Warning**: This is a demonstration system. For production use, implement additional security measures, proper key management, and comprehensive testing.
