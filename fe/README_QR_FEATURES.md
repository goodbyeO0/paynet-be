# 📱 Real QR Code Features

## Overview

The cross-border payment system now supports **real QR code generation** and **camera-based QR scanning** for a complete mobile payment experience.

## 🏪 Merchant QR Generator

### Features

- **Real QR Code Generation**: Creates actual QR codes with embedded merchant data
- **Downloadable QR Codes**: Merchants can download PNG files of their QR codes
- **Data Preview**: Shows the exact JSON data embedded in the QR code
- **Multi-Country Support**: Supports both Thai and Malaysian merchants

### QR Code Data Structure

```json
{
  "type": "PAYMENT_REQUEST",
  "merchantId": "merchant_malay_001",
  "merchantName": "KL Shopping Center",
  "country": "Malaysia",
  "currency": "MYR",
  "qrCode": "MY_QR_001_KL_SHOPPING",
  "timestamp": 1703123456789
}
```

### How to Use

1. Go to **Merchant Portal** page
2. Select a merchant from the dropdown
3. Click **"Generate QR Code"**
4. Download or display the generated QR code
5. Customers can scan with their mobile cameras

## 📱 Customer QR Scanner

### Features

- **Camera-Based Scanning**: Uses device camera to scan QR codes
- **Real-Time Detection**: Automatically detects and processes QR codes
- **Multi-Format Support**: Handles both new JSON format and legacy formats
- **User Selection**: Choose country and user before scanning
- **Test Mode**: Sample QR for testing without camera

### Camera Permissions

- The scanner requires camera permissions
- Works best with back camera on mobile devices
- Includes visual scan region highlighting

### How to Use

1. Go to **Customer Portal** page
2. Select your country (Thailand/Malaysia)
3. Select your user account
4. Click **"Start Camera Scanner"**
5. Point camera at merchant's QR code
6. Follow payment flow after successful scan

## 🔧 Technical Implementation

### Dependencies Added

```bash
npm install qrcode qr-scanner
```

### QR Code Generation

- Uses `qrcode` library for generating PNG images
- 300x300 pixel resolution with error correction
- Base64 data URLs for immediate display

### Camera Scanning

- Uses `qr-scanner` library for camera access
- Supports both front and back cameras
- Automatic QR code detection and parsing

### Data Flow

1. **Merchant**: Generate QR → Display to customer
2. **Customer**: Scan QR → Parse data → Send to backend
3. **Backend**: Process payment request → Verify banks → Complete payment

## 📱 Mobile Experience

### For Merchants

- Generate QR codes on any device
- Download QR codes for printing/display
- Share QR codes digitally

### For Customers

- Open website on mobile browser
- Grant camera permissions
- Scan merchant QR codes directly
- Complete payments on mobile

## 🛠️ Testing

### Without Camera

- Use **"Test with Sample QR"** button
- Simulates scanning a Malaysian merchant QR
- Tests the complete payment flow

### With Camera

- Open on mobile device
- Grant camera permissions
- Scan generated QR codes
- Test real scanning experience

## 🔒 Security Features

### QR Code Security

- Timestamp validation
- Type verification (`PAYMENT_REQUEST`)
- Merchant ID validation
- Country/currency verification

### Camera Security

- No QR data stored locally
- Immediate processing and cleanup
- Camera access only when scanning

## 🌍 Cross-Border Support

### Thailand → Malaysia

- Thai users scan Malaysian merchant QR codes
- Automatic THB to MYR conversion
- Thai Bank verification

### Malaysia → Thailand

- Malaysian users scan Thai merchant QR codes
- Automatic MYR to THB conversion
- Maybank verification

## 📋 Supported Merchants

### Thailand 🇹🇭

- **Bangkok Mall** (`merchant_thai_001`)
  - QR: `TH_QR_001_BANGKOK_MALL`
  - Currency: THB

### Malaysia 🇲🇾

- **KL Shopping Center** (`merchant_malay_001`)

  - QR: `MY_QR_001_KL_SHOPPING`
  - Currency: MYR

- **Penang Food Court** (`merchant_malay_002`)
  - QR: `MY_QR_002_PENANG_FOOD`
  - Currency: MYR

## 🚀 Getting Started

1. **Start Backend**: `cd testing && npm start`
2. **Start Frontend**: `cd learn/learn-fe && npm run dev`
3. **Open on Mobile**: Navigate to the local URL on your phone
4. **Test Flow**:
   - Generate QR as merchant
   - Scan QR as customer
   - Complete payment

## 📱 Best Practices

### For Merchants

- Display QR codes prominently
- Ensure good lighting for scanning
- Test QR codes before use

### For Customers

- Hold phone steady when scanning
- Ensure good lighting
- Point camera directly at QR code
- Wait for automatic detection

The system now provides a complete mobile payment experience with real QR codes and camera scanning! 🎉
