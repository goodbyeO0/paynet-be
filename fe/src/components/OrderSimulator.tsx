// src/components/OrderSimulator.tsx
import { useState } from 'react';
import { api } from '../services/api';
import type { OrderResponse } from '../types/webhook';

export function OrderSimulator() {
    const [amount, setAmount] = useState(100);
    const [response, setResponse] = useState<OrderResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await api.simulateOrder({ amount });
            setResponse(result);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setResponse(null);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Simulate Order</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Order Amount
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            min="1"
                            required
                        />
                    </label>
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Simulate Order
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {response && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                    <p>Order created successfully!</p>
                    <p>Order ID: {response.order.orderId}</p>
                    <p>Amount: ${response.order.amount}</p>
                    <p>Status: {response.order.status}</p>
                    <p>Timestamp: {new Date(response.order.timestamp).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
}