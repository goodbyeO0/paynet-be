import React, { useState } from 'react';
import { QRScanner } from '../components/QRScanner';
import { PaymentFlow } from '../components/PaymentFlow';
import type { ScanQRResponse } from '../types/payment';

interface CustomerPageProps {
    onNavigate: (page: string) => void;
}

export function CustomerPage({ onNavigate }: CustomerPageProps) {
    const [scanResponse, setScanResponse] = useState<ScanQRResponse | null>(null);
    const [payerUserId, setPayerUserId] = useState<string>('');
    const [payerCountry, setPayerCountry] = useState<string>('');

    const handleScanSuccess = (response: ScanQRResponse, userId: string, country: string) => {
        setScanResponse(response);
        setPayerUserId(userId);
        setPayerCountry(country);
    };

    const handlePaymentComplete = () => {
        onNavigate('success');
    };

    const handleBackToScan = () => {
        setScanResponse(null);
        setPayerUserId('');
        setPayerCountry('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => onNavigate('home')}
                                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                            >
                                ← Back to Home
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900">
                                👤 Customer Portal
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Scan & Pay</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!scanResponse ? (
                    <>
                        {/* Hero Section */}
                        <div className="text-center mb-12">
                            <div className="text-6xl mb-4">👤</div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Scan & Pay
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Scan merchant QR codes to make secure cross-border payments.
                                Pay merchants in Thailand or Malaysia with automatic currency conversion.
                            </p>
                        </div>

                        {/* Benefits */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                                <div className="text-3xl mb-3">⚡</div>
                                <h3 className="font-semibold mb-2">Fast & Easy</h3>
                                <p className="text-sm text-gray-600">Simple QR code scanning for instant payments</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                                <div className="text-3xl mb-3">🔐</div>
                                <h3 className="font-semibold mb-2">Secure</h3>
                                <p className="text-sm text-gray-600">Bank-level encryption and blockchain verification</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                                <div className="text-3xl mb-3">💱</div>
                                <h3 className="font-semibold mb-2">Auto Convert</h3>
                                <p className="text-sm text-gray-600">Automatic currency conversion at real-time rates</p>
                            </div>
                        </div>

                        {/* QR Scanner */}
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <QRScanner onScanSuccess={handleScanSuccess} />
                        </div>

                        {/* Available Users */}
                        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                Available Users
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Thai Users */}
                                <div>
                                    <h4 className="text-lg font-semibold text-blue-600 mb-4">🇹🇭 Thailand</h4>
                                    <div className="space-y-3">
                                        <div className="border border-blue-200 rounded-lg p-4">
                                            <div className="font-medium">Ah Kong</div>
                                            <div className="text-sm text-gray-600">ID: thai_001</div>
                                            <div className="text-sm text-gray-600">Account: TH001234567890</div>
                                            <div className="text-sm text-green-600">Balance: 39,880 THB</div>
                                        </div>
                                        <div className="border border-blue-200 rounded-lg p-4">
                                            <div className="font-medium">Somchai</div>
                                            <div className="text-sm text-gray-600">ID: thai_002</div>
                                            <div className="text-sm text-gray-600">Account: TH001234567891</div>
                                            <div className="text-sm text-green-600">Balance: 15,601 THB</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Malaysian Users */}
                                <div>
                                    <h4 className="text-lg font-semibold text-green-600 mb-4">🇲🇾 Malaysia</h4>
                                    <div className="space-y-3">
                                        <div className="border border-green-200 rounded-lg p-4">
                                            <div className="font-medium">Ahmad Abdullah</div>
                                            <div className="text-sm text-gray-600">ID: malay_001</div>
                                            <div className="text-sm text-gray-600">Account: MY001234567890</div>
                                            <div className="text-sm text-green-600">Balance: 10,000 MYR</div>
                                        </div>
                                        <div className="border border-green-200 rounded-lg p-4">
                                            <div className="font-medium">Siti Nurhaliza</div>
                                            <div className="text-sm text-gray-600">ID: malay_002</div>
                                            <div className="text-sm text-gray-600">Account: MY001234567891</div>
                                            <div className="text-sm text-green-600">Balance: 15,000 MYR</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* How to Pay */}
                        <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                How to Make a Payment
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                        <span className="text-xl">1️⃣</span>
                                    </div>
                                    <h4 className="font-semibold mb-2">Select User</h4>
                                    <p className="text-sm text-gray-600">Choose your user ID and country</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                        <span className="text-xl">2️⃣</span>
                                    </div>
                                    <h4 className="font-semibold mb-2">Scan QR Code</h4>
                                    <p className="text-sm text-gray-600">Scan the merchant's QR code</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                        <span className="text-xl">3️⃣</span>
                                    </div>
                                    <h4 className="font-semibold mb-2">Enter Amount</h4>
                                    <p className="text-sm text-gray-600">Enter the payment amount</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                        <span className="text-xl">4️⃣</span>
                                    </div>
                                    <h4 className="font-semibold mb-2">Confirm Payment</h4>
                                    <p className="text-sm text-gray-600">Review and confirm your payment</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Payment Flow */}
                        <div className="mb-6">
                            <button
                                onClick={handleBackToScan}
                                className="text-gray-600 hover:text-gray-900 text-sm font-medium mb-4"
                            >
                                ← Back to Scanner
                            </button>
                        </div>
                        <PaymentFlow
                            scanResponse={scanResponse}
                            payerUserId={payerUserId}
                            payerCountry={payerCountry}
                            onComplete={handlePaymentComplete}
                        />
                    </>
                )}
            </main>
        </div>
    );
} 