https://sepolia.basescan.org/address/0xe7e64f18f2345427d588e3fca0d6340b91047ebf

# Cross-Border Payment System Backend

## Overview

This backend system powers a cross-border payment platform that enables secure QR-based payments between Thailand and Malaysia. The system uses blockchain technology (Ethereum smart contracts) for verification and transparency, while maintaining traditional banking operations for actual fund transfers.

## Architecture

### Core Components

1. **Express.js API Server** - RESTful API endpoints for payment operations
2. **Smart Contract Integration** - Ethereum blockchain for verification and audit trails
3. **RSA Encryption** - Bank-level security for sensitive data
4. **In-Memory Session Management** - Active payment session tracking
5. **File-Based Bank Data** - JSON files simulating bank databases

### Technology Stack

- **Node.js** with Express.js
- **Ethers.js** for blockchain interaction
- **Crypto** module for RSA encryption/decryption
- **CORS** for cross-origin requests
- **File System** for data persistence

## System Flow

### 1. QR Code Generation Flow

```
Merchant Request → Bank Data Lookup → QR Code Generation → Response
```

**Endpoint**: `GET /generate-qr/:merchantId`

**Process**:

1. Lookup merchant in Thai Bank or Malaysian Bank data
2. Generate QR code with merchant information
3. Return QR data including merchant details and country info

### 2. Payment Initiation Flow

```
QR Scan → Merchant/Payer Validation → Session Creation → Smart Contract Call → Verification Ready
```

**Endpoint**: `POST /scan-qr`

**Process**:

1. **QR Code Validation**: Find merchant by QR code in both bank databases
2. **Payer Validation**: Verify payer exists and has sufficient balance
3. **Payment Direction**: Determine Thailand→Malaysia or Malaysia→Thailand
4. **Data Encryption**: Encrypt verification data with both banks' public keys
5. **Session Creation**: Generate unique session ID and store encrypted data
6. **Smart Contract**: Call appropriate initiation function on blockchain
7. **Response**: Return session ID and verification status

### 3. Bank Verification Flow

```
Bank Verification Request → Data Decryption → Integrity Check → Smart Contract Update → Verification Complete
```

**Endpoint**: `POST /verify-bank`

**Process**:

1. **Session Lookup**: Find active session by ID
2. **Bank Identification**: Determine if origin or destination bank
3. **Data Decryption**: Attempt to decrypt using bank's private key
4. **Integrity Verification**: Successful decryption = data integrity confirmed
5. **Smart Contract Update**: Record verification result on blockchain
6. **Status Update**: Mark bank as verified in session
7. **Completion Check**: If both banks verified, mark session as ready for payment

### 4. Payment Processing Flow

```
Payment Request → Balance Check → Smart Contract Call → Fund Transfer → Completion
```

**Endpoint**: `POST /process-payment`

**Process**:

1. **Session Validation**: Ensure both banks have verified the transaction
2. **Balance Check**: Verify payer has sufficient funds
3. **Smart Contract**: Record payment initiation on blockchain
4. **Async Processing**: Trigger 3-second delayed completion
5. **Fund Transfer**: Deduct from payer, add to merchant (with currency conversion)
6. **Final Confirmation**: Update smart contract with completion status

### 5. Status Monitoring Flow

```
Status Request → Session Lookup → Current State → Response
```

**Endpoint**: `GET /payment-status/:sessionId`

**Process**:

1. Lookup session by ID
2. Return current verification and payment status
3. Include bank verification states and completion timestamp

## Security Model

### Encryption Strategy

- **RSA-2048 Encryption**: Each bank has public/private key pairs
- **Dual Encryption**: Data encrypted separately for each bank
- **Integrity Verification**: Successful decryption proves data hasn't been tampered with
- **No Hash Verification**: Simplified from previous version - decryption success is sufficient

### Session Management

- **Unique Session IDs**: Time-based + random component
- **In-Memory Storage**: Fast access for active sessions
- **Processing Locks**: Prevent concurrent verification attempts
- **Status Tracking**: Comprehensive state management

## Data Structure

### Bank Data Files

Located in `/data/` directory:

- `ThaiBank.json` - Thai bank users and merchants
- `Maybank.json` - Malaysian bank users and merchants

**Structure**:

```json
{
  "bankName": "Thai Bank",
  "country": "Thailand",
  "currency": "THB",
  "bankKeys": {
    "publicKey": "-----BEGIN PUBLIC KEY-----...",
    "privateKey": "-----BEGIN PRIVATE KEY-----...",
    "bankId": "THAI_BANK_001"
  },
  "users": [
    {
      "userId": "thai_001",
      "name": "Ah Kong",
      "balance": 29980,
      "accountNumber": "TH001234567890",
      "phone": "+66812345678",
      "email": "ahkong@thaibank.com"
    }
  ],
  "merchants": [
    {
      "merchantId": "merchant_thai_001",
      "name": "Bangkok Mall",
      "balance": 50000,
      "qrCode": "TH_QR_001_BANGKOK_MALL",
      "exchangeRate": {
        "MYR_to_THB": 7.69
      }
    }
  ]
}
```

### Session Data Structure

```javascript
{
  sessionId: "session_1234567890_abc123",
  merchantId: "merchant_thai_001",
  payerUserId: "thai_001",
  payerCountry: "Thailand",
  merchantCountry: "Malaysia",
  timestamp: 1234567890,
  originEncryptedData: "base64-encrypted-data",
  destinationEncryptedData: "base64-encrypted-data",
  status: "pending_verification|verified|completed|failed",
  direction: "THAILAND_TO_MALAYSIA|MALAYSIA_TO_THAILAND",
  originBank: "THAI_BANK_001",
  destinationBank: "MAYBANK_001",
  originBankVerified: true|false|null,
  destinationBankVerified: true|false|null,
  amount: 100.00,
  completedAt: "2024-01-01T00:00:00.000Z"
}
```

## API Endpoints

### 1. Generate QR Code

```
GET /generate-qr/:merchantId
```

**Response**:

```json
{
  "qrData": {
    "merchantId": "merchant_thai_001",
    "merchantName": "Bangkok Mall",
    "qrCode": "TH_QR_001_BANGKOK_MALL",
    "country": "Thailand",
    "currency": "THB"
  }
}
```

### 2. Scan QR Code

```
POST /scan-qr
Body: {
  "qrCode": "TH_QR_001_BANGKOK_MALL",
  "payerUserId": "thai_001",
  "payerCountry": "Thailand"
}
```

**Response**:

```json
{
  "sessionId": "session_1234567890_abc123",
  "merchantName": "Bangkok Mall",
  "status": "verification_pending",
  "direction": "THAILAND_TO_MALAYSIA",
  "transactionHash": "0x...",
  "blockNumber": 12345
}
```

### 3. Bank Verification

```
POST /verify-bank
Body: {
  "sessionId": "session_1234567890_abc123",
  "bankId": "THAI_BANK_001"
}
```

**Response**:

```json
{
  "sessionId": "session_1234567890_abc123",
  "verified": true,
  "status": "verified",
  "transactionHash": "0x...",
  "blockNumber": 12346
}
```

### 4. Process Payment

```
POST /process-payment
Body: {
  "sessionId": "session_1234567890_abc123",
  "amount": 100.00
}
```

**Response**:

```json
{
  "sessionId": "session_1234567890_abc123",
  "amount": 100.0,
  "status": "payment_initiated",
  "direction": "THAILAND_TO_MALAYSIA",
  "transactionHash": "0x...",
  "blockNumber": 12347
}
```

### 5. Payment Status

```
GET /payment-status/:sessionId
```

**Response**:

```json
{
  "sessionId": "session_1234567890_abc123",
  "merchantId": "merchant_thai_001",
  "payerUserId": "thai_001",
  "amount": 100.0,
  "status": "completed",
  "direction": "THAILAND_TO_MALAYSIA",
  "timestamp": 1234567890,
  "originBankVerified": true,
  "destinationBankVerified": true,
  "completedAt": "2024-01-01T00:00:00.000Z"
}
```

### 6. Contract Information

```
GET /contract-info
```

**Response**:

```json
{
  "contractAddress": "0x...",
  "network": "Sepolia Testnet",
  "isConnected": true
}
```

### 7. Debug Session (Development)

```
GET /debug-session/:sessionId
```

**Response**:

```json
{
  "sessionId": "session_1234567890_abc123",
  "status": "completed",
  "direction": "THAILAND_TO_MALAYSIA",
  "originBank": "THAI_BANK_001",
  "destinationBank": "MAYBANK_001",
  "originBankVerified": true,
  "destinationBankVerified": true,
  "originBankProcessing": false,
  "destinationBankProcessing": false,
  "payerCountry": "Thailand",
  "merchantCountry": "Malaysia",
  "amount": 100.0,
  "timestamp": 1234567890
}
```

## Smart Contract Integration

### Contract Events Monitored

1. **VerifyThailandData** - Thailand bank verification initiated
2. **ThailandVerified** - Thailand bank verification completed
3. **ThailandPay** - Thailand payment processed
4. **VerifyMalaysiaData** - Malaysia bank verification initiated
5. **MalaysiaVerified** - Malaysia bank verification completed
6. **MalaysiaPay** - Malaysia payment processed
7. **PaymentCompleted** - Full payment cycle completed

### Contract Functions Called

1. **initiateThailandToMalaysiaPayment** - Start TH→MY payment
2. **initiateMalaysiaToThailandPayment** - Start MY→TH payment
3. **confirmThailandVerification** - Thai bank verification result
4. **confirmMalaysiaVerification** - Malaysian bank verification result
5. **processThailandPayment** - Process Thai payment
6. **processMalaysiaPayment** - Process Malaysian payment
7. **confirmOriginBankPayment** - Confirm origin bank transfer
8. **confirmDestinationBankPayment** - Confirm destination bank transfer

## Currency Conversion

### Exchange Rates (Simulated)

- **THB to MYR**: 1 THB = 0.13 MYR
- **MYR to THB**: 1 MYR = 7.69 THB

### Conversion Logic

```javascript
if (direction === "THAILAND_TO_MALAYSIA") {
  convertedAmount = amount * 0.13; // THB to MYR
} else {
  convertedAmount = amount * 7.69; // MYR to THB
}
```

## Setup and Configuration

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Smart Contract

Edit `config.js`:

```javascript
module.exports = {
  CONTRACT_ADDRESS: "0x...", // Your deployed contract address
  PRIVATE_KEY: "0x...", // Your wallet private key
  RPC_URL: "https://...", // Ethereum RPC URL
  // ... other settings
};
```

### 3. Prepare Bank Data

Ensure `data/ThaiBank.json` and `data/Maybank.json` exist with:

- Bank keys (public/private key pairs)
- User accounts with balances
- Merchant accounts with QR codes

### 4. Start Server

```bash
npm start          # Production
npm run dev        # Development with nodemon
```

## Testing

### Available Test Scripts

```bash
npm test           # Run main test suite
node test-api.js   # Test API endpoints
node test-contract.js  # Test smart contract integration
node test-backend.js   # Test backend functionality
```

### Test Users

- **Thai User**: `thai_001` (Ah Kong) - Balance: 29,980 THB
- **Malaysian User**: `malay_001` (Ahmad) - Balance: 15,000 MYR

### Test Merchants

- **Thai Merchant**: `merchant_thai_001` (Bangkok Mall)
- **Malaysian Merchant**: `merchant_malay_001` (KL Shopping Center)

## Error Handling

### Common Error Responses

- **404**: Session/Merchant/User not found
- **400**: Invalid request data or insufficient balance
- **429**: Concurrent processing attempt
- **500**: Server/blockchain/encryption errors

### Error Recovery

- Automatic retry for blockchain transaction failures
- Processing locks to prevent race conditions
- Graceful degradation when smart contract calls fail
- Comprehensive logging for debugging

## Security Considerations

### Production Deployment

1. **Environment Variables**: Move sensitive config to env vars
2. **HTTPS Only**: Enable SSL/TLS for all communications
3. **Rate Limiting**: Implement API rate limiting
4. **Input Validation**: Add comprehensive input sanitization
5. **Database Security**: Replace file-based storage with secure database
6. **Key Management**: Use hardware security modules for private keys
7. **Audit Logging**: Implement comprehensive audit trails

### Current Security Features

- RSA-2048 encryption for sensitive data
- Blockchain immutability for transaction records
- Session-based processing with unique IDs
- Concurrent processing protection
- Input validation and error handling

## Monitoring and Logging

### Log Events

- Smart contract interactions
- Payment processing stages
- Bank verification results
- Error conditions and recovery
- Performance metrics

### Event Monitoring

- Real-time blockchain event listening
- Payment completion tracking
- System health monitoring
- Transaction audit trails

## Performance Considerations

### Optimization Features

- In-memory session storage for fast access
- Async payment processing to prevent blocking
- Efficient encryption/decryption operations
- Minimal blockchain calls to reduce gas costs

### Scalability Notes

- Current implementation uses in-memory storage (not suitable for production clusters)
- File-based bank data should be replaced with database for production
- Consider implementing caching layer for frequently accessed data
- Smart contract gas optimization for high-volume scenarios

## Troubleshooting

### Common Issues

1. **Smart Contract Connection Failed**

   - Check `config.js` settings
   - Verify RPC URL accessibility
   - Confirm contract address and ABI

2. **Bank Verification Failed**

   - Verify bank keys in data files
   - Check encryption/decryption logic
   - Confirm session data integrity

3. **Payment Processing Stuck**

   - Check session status via debug endpoint
   - Verify both banks completed verification
   - Check blockchain transaction status

4. **Balance Issues**
   - Verify user balance in bank data files
   - Check currency conversion logic
   - Confirm payment completion process

### Debug Endpoints

- `GET /debug-session/:sessionId` - Detailed session information
- `GET /contract-info` - Smart contract connection status
- `GET /get-bank-private-key/:bankId` - Bank key verification (dev only)

## Development Guidelines

### Code Structure

- Modular function design
- Comprehensive error handling
- Detailed logging and monitoring
- Clear separation of concerns

### Testing Strategy

- Unit tests for core functions
- Integration tests for API endpoints
- Smart contract interaction tests
- End-to-end payment flow tests

### Documentation

- Inline code comments
- API documentation
- Flow diagrams
- Security considerations

This backend system provides a robust foundation for cross-border payments with blockchain verification, bank-level security, and comprehensive monitoring capabilities.
