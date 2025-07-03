// src/components/WebhookForm.tsx
import { useState } from 'react';
import { api } from '../services/api';
import type { WebhookResponse } from '../types/webhook';

export function WebhookForm() {
    const [url, setUrl] = useState('');
    const [event, setEvent] = useState('order.created');
    const [response, setResponse] = useState<WebhookResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await api.registerWebhook({ url, event });
            setResponse(result);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setResponse(null);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Register Webhook</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Webhook URL
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="https://your-webhook-url.com"
                            required
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Event Type
                        <select
                            value={event}
                            onChange={(e) => setEvent(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="order.created">Order Created</option>
                        </select>
                    </label>
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Register Webhook
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {response && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                    <p>Webhook registered successfully!</p>
                    <p>Subscription ID: {response.subscriptionId}</p>
                </div>
            )}
        </div>
    );
}