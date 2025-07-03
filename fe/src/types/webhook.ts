// src/types/webhook.ts
export interface WebhookRegistration {
  url: string;
  event: string;
}

export interface WebhookResponse {
  message: string;
  subscriptionId: string;
  url: string;
  event: string;
}

export interface OrderSimulation {
  amount: number;
}

export interface OrderResponse {
  message: string;
  order: {
    orderId: string;
    amount: number;
    status: string;
    timestamp: string;
  };
}
