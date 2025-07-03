# Cross-Border Payment Frontend

A React TypeScript frontend application for the cross-border payment system between Thailand and Malaysia.

## Overview

This frontend provides an intuitive interface for:

- **Malaysian Merchants**: Generate QR codes for payments
- **Thai Customers**: Scan QR codes and make cross-border payments
- **Real-time Payment Flow**: Track payment status through blockchain verification

## Features

### 🏪 Merchant Features

- Generate QR codes for different merchants
- Visual QR code representation
- Merchant selection interface

### 🇹🇭 Thai Customer Features

- User selection with balance display
- QR code scanning interface
- Quick-fill QR codes for testing
- Real-time payment processing

### 💳 Payment Flow

- Step-by-step payment progress
- Real-time status updates
- Automatic currency conversion (THB → MYR)
- Smart contract verification
- Payment completion confirmation

### 🔧 System Features

- Backend connection status indicator
- Error handling and user feedback
- Responsive design
- Modern UI with Tailwind CSS

## Technology Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Router** for navigation

## Project Structure

```
src/
├── components/
│   ├── QRGenerator.tsx      # Merchant QR code generation
│   ├── QRScanner.tsx        # Thai customer QR scanning
│   ├── PaymentFlow.tsx      # Payment processing flow
│   └── StatusIndicator.tsx  # Backend connection status
├── services/
│   └── api.ts              # API service layer
├── types/
│   └── payment.ts          # TypeScript type definitions
├── App.tsx                 # Main application component
└── main.tsx               # Application entry point
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running on port 3000

### Installation

1. **Install Dependencies**

```bash
cd learn/learn-fe
npm install
# or
yarn install
```

2. **Start Development Server**

```bash
npm run dev
# or
yarn dev
```

3. **Build for Production**

```bash
npm run build
# or
yarn build
```

The application will be available at `http://localhost:5173`

## Usage Guide

### 1. Home Page

- Overview of the cross-border payment system
- Features explanation
- How it works section

### 2. Malaysian Merchant (Left Panel)

1. Select a merchant from the dropdown
2. Click "Generate QR Code"
3. QR code data will be displayed
4. Share the QR code with customers

### 3. Thai Customer (Right Panel)

1. Select a Thai user (Ah Kong or Somchai)
2. Enter or use quick-fill QR codes
3. Click "Scan QR Code" to initiate payment

### 4. Payment Flow

Once QR is scanned, the payment flow begins:

**Step 1: Verification**

- Data encryption and blockchain verification
- Thailand bank validates the payment data

**Step 2: Payment Input**

- Enter payment amount in THB
- See estimated MYR conversion
- Confirm payment

**Step 3: Processing**

- Cross-border transfer processing
- Real-time status updates
- Smart contract validation

**Step 4: Completion**

- Payment summary
- Transaction confirmation
- Option to start new payment

## API Integration

The frontend communicates with the backend through these endpoints:

```typescript
// Generate QR code
GET /generate-qr/:merchantId

// Scan QR code
POST /scan-qr
Body: { qrCode, thaiUserId }

// Verify Thailand data
POST /verify-thailand
Body: { sessionId, privateKey }

// Process payment
POST /thailand-pay
Body: { sessionId, amount }

// Get payment status
GET /payment-status/:sessionId
```

## Configuration

### Backend URL

Update the API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = "http://localhost:3000";
```

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_TITLE=Cross-Border Payment System
```

## Testing

### Manual Testing Flow

1. Start the backend server
2. Start the frontend application
3. Generate a QR code as a merchant
4. Scan the QR code as a Thai customer
5. Complete the payment flow

### Test Data

- **Merchants**: KL Shopping Center, Penang Food Court
- **Thai Users**: Ah Kong (฿50,000), Somchai (฿25,000)
- **QR Codes**: MY_QR_001_KL_SHOPPING, MY_QR_002_PENANG_FOOD

## Error Handling

The application handles various error scenarios:

- Backend connection failures
- Invalid QR codes
- Insufficient balances
- Payment processing errors
- Network connectivity issues

## Status Indicator

The top-right status indicator shows:

- **Green**: Backend connected
- **Red**: Backend disconnected
- **Yellow**: Checking connection

## Responsive Design

The application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile devices

## Development

### Adding New Components

1. Create component in `src/components/`
2. Add TypeScript types in `src/types/`
3. Import and use in `App.tsx`

### API Integration

1. Add new API methods in `src/services/api.ts`
2. Define TypeScript interfaces in `src/types/`
3. Use in components with proper error handling

### Styling

- Uses Tailwind CSS utility classes
- Responsive design with mobile-first approach
- Consistent color scheme and spacing

## Troubleshooting

### Common Issues

1. **Backend Connection Failed**

   - Ensure backend server is running on port 3000
   - Check CORS configuration
   - Verify API endpoints

2. **QR Scan Fails**

   - Ensure QR code format is correct
   - Check user selection
   - Verify backend merchant data

3. **Payment Processing Stuck**
   - Check smart contract deployment
   - Verify blockchain connection
   - Check backend logs

### Debug Mode

Enable debug logging by adding to console:

```javascript
localStorage.setItem("debug", "true");
```

## Production Deployment

### Build Optimization

```bash
npm run build
```

### Environment Configuration

- Set production API URLs
- Configure proper CORS settings
- Enable HTTPS
- Add error monitoring

### Performance

- Code splitting implemented
- Lazy loading for components
- Optimized bundle size
- Fast refresh in development

## Contributing

1. Follow TypeScript best practices
2. Use proper error handling
3. Add proper type definitions
4. Test all payment flows
5. Ensure responsive design

## Support

For issues or questions:

- Check the backend server status
- Review browser console errors
- Verify API connectivity
- Check network requests in DevTools
