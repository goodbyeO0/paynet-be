import { useState, useEffect } from 'react';
import { paymentAPI } from '../services/api';

export function StatusIndicator() {
    const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
    const [lastChecked, setLastChecked] = useState<Date | null>(null);

    useEffect(() => {
        checkBackendStatus();

        // Check status every 30 seconds
        const interval = setInterval(checkBackendStatus, 30000);

        return () => clearInterval(interval);
    }, []);

    const checkBackendStatus = async () => {
        try {
            // Try to generate a QR for a test merchant to check if backend is running
            await paymentAPI.generateQR('merchant_malay_001');
            setBackendStatus('connected');
            setLastChecked(new Date());
        } catch (error) {
            setBackendStatus('disconnected');
            setLastChecked(new Date());
        }
    };

    const getStatusColor = () => {
        switch (backendStatus) {
            case 'connected': return 'bg-green-500';
            case 'disconnected': return 'bg-red-500';
            case 'checking': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = () => {
        switch (backendStatus) {
            case 'connected': return 'Backend Connected';
            case 'disconnected': return 'Backend Disconnected';
            case 'checking': return 'Checking Connection...';
            default: return 'Unknown Status';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-3 border">
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
                    <span className="text-sm font-medium text-gray-700">
                        {getStatusText()}
                    </span>
                </div>
                {lastChecked && (
                    <div className="text-xs text-gray-500 mt-1">
                        Last checked: {lastChecked.toLocaleTimeString()}
                    </div>
                )}
                {backendStatus === 'disconnected' && (
                    <div className="text-xs text-red-600 mt-1">
                        Make sure the backend server is running on port 3000
                    </div>
                )}
            </div>
        </div>
    );
} 