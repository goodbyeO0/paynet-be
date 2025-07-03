// src/services/api.ts
import axios from "axios";
import type {
  QRData,
  ScanQRRequest,
  ScanQRResponse,
  VerifyBankRequest,
  VerifyBankResponse,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  PaymentSession,
} from "../types/payment";

const API_BASE_URL = "https://5cb83tf0-3000.asse.devtunnels.ms/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const paymentAPI = {
  // Generate QR code for merchant
  generateQR: async (merchantId: string): Promise<{ qrData: QRData }> => {
    const response = await api.get(`/generate-qr/${merchantId}`);
    return response.data;
  },

  // Scan QR code and initiate payment
  scanQR: async (data: ScanQRRequest): Promise<ScanQRResponse> => {
    const response = await api.post("/scan-qr", data);
    return response.data;
  },

  // Verify bank data (supports both Thai Bank and Maybank)
  verifyBank: async (data: VerifyBankRequest): Promise<VerifyBankResponse> => {
    try {
      const response = await api.post("/verify-bank", data);
      return response.data;
    } catch (error: any) {
      // Handle 429 (already processing) as success - let status polling handle it
      if (error.response?.status === 429) {
        console.log("⚠️ Verification already in progress, continuing...");
        return {
          sessionId: data.sessionId,
          verified: true,
          status: "verified",
          transactionHash: "processing",
        };
      }
      throw error;
    }
  },

  // Process payment (bidirectional)
  processPayment: async (
    data: ProcessPaymentRequest
  ): Promise<ProcessPaymentResponse> => {
    const response = await api.post("/process-payment", data);
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (sessionId: string): Promise<PaymentSession> => {
    const response = await api.get(`/payment-status/${sessionId}`);
    return response.data;
  },

  // Get bank private key for testing (in real app, this would be securely managed)
  getBankPrivateKey: async (
    bankId: string
  ): Promise<{ privateKey: string }> => {
    const response = await api.get(`/get-bank-private-key/${bankId}`);
    return response.data;
  },

  // Get contract info
  getContractInfo: async (): Promise<{
    contractAddress: string;
    network: string;
    isConnected: boolean;
  }> => {
    const response = await api.get("/contract-info");
    return response.data;
  },
};

// Error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
);

export default api;
