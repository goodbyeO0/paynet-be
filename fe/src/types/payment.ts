export interface QRData {
  merchantId: string;
  merchantName: string;
  qrCode: string;
  country: string;
  currency: string;
}

export interface PaymentSession {
  sessionId: string;
  merchantId: string;
  payerUserId: string;
  payeeUserId?: string;
  amount?: number;
  status: PaymentStatus;
  direction: PaymentDirection;
  timestamp: number;
  originBankVerified: boolean;
  destinationBankVerified: boolean;
  hashedData?: string;
  encryptedData?: string;
  completedAt?: Date;
}

export type PaymentStatus =
  | "pending_verification"
  | "verified"
  | "verification_failed"
  | "payment_processing"
  | "payment_initiated"
  | "completed"
  | "failed";

export type PaymentDirection = "THAILAND_TO_MALAYSIA" | "MALAYSIA_TO_THAILAND";

export interface ScanQRRequest {
  qrCode: string;
  payerUserId: string;
  payerCountry: string;
}

export interface ScanQRResponse {
  sessionId: string;
  merchantName: string;
  status: string;
  direction: PaymentDirection;
  transactionHash: string;
}

export interface VerifyBankRequest {
  sessionId: string;
  bankId: string;
}

export interface VerifyBankResponse {
  sessionId: string;
  verified: boolean;
  status: string;
  transactionHash: string;
}

export interface ProcessPaymentRequest {
  sessionId: string;
  amount: number;
}

export interface ProcessPaymentResponse {
  sessionId: string;
  amount: number;
  status: string;
  direction: PaymentDirection;
  transactionHash: string;
}

export interface User {
  userId: string;
  name: string;
  balance: number;
  accountNumber: string;
  phone: string;
  email: string;
}

export interface Merchant {
  merchantId: string;
  name: string;
  balance?: number;
  accountNumber?: string;
  qrCode: string;
  exchangeRate?: {
    THB_to_MYR?: number;
    MYR_to_THB?: number;
  };
}
