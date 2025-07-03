import React from 'react';
import { QRGenerator } from '../components/QRGenerator';

interface MerchantPageProps {
    onNavigate: (page: string) => void;
}

export function MerchantPage({ onNavigate }: MerchantPageProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
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
                                🏪 Merchant Portal
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Generate QR codes for payments</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="text-6xl mb-4">🏪</div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Merchant QR Code Generator
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Generate QR codes for your business. Accept payments from customers
                        in both Thailand and Malaysia with automatic currency conversion.
                    </p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-3xl mb-3">🌍</div>
                        <h3 className="font-semibold mb-2">Global Reach</h3>
                        <p className="text-sm text-gray-600">Accept payments from customers in Thailand and Malaysia</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-3xl mb-3">💱</div>
                        <h3 className="font-semibold mb-2">Auto Conversion</h3>
                        <p className="text-sm text-gray-600">Automatic currency conversion to your local currency</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-3xl mb-3">🔒</div>
                        <h3 className="font-semibold mb-2">Secure</h3>
                        <p className="text-sm text-gray-600">Bank-level encryption and blockchain verification</p>
                    </div>
                </div>

                {/* QR Generator */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <QRGenerator />
                </div>

                {/* Available Merchants */}
                <div className="mt-12 bg-white rounded-lg shadow-md p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Available Merchants
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Thai Merchants */}
                        <div>
                            <h4 className="text-lg font-semibold text-blue-600 mb-4">🇹🇭 Thailand</h4>
                            <div className="space-y-3">
                                <div className="border border-blue-200 rounded-lg p-4">
                                    <div className="font-medium">Bangkok Mall</div>
                                    <div className="text-sm text-gray-600">ID: merchant_thai_001</div>
                                    <div className="text-sm text-gray-600">QR: TH_QR_001_BANGKOK_MALL</div>
                                    <div className="text-sm text-green-600">Balance: 50,000 THB</div>
                                </div>
                            </div>
                        </div>

                        {/* Malaysian Merchants */}
                        <div>
                            <h4 className="text-lg font-semibold text-green-600 mb-4">🇲🇾 Malaysia</h4>
                            <div className="space-y-3">
                                <div className="border border-green-200 rounded-lg p-4">
                                    <div className="font-medium">KL Shopping Center</div>
                                    <div className="text-sm text-gray-600">ID: merchant_malay_001</div>
                                    <div className="text-sm text-gray-600">QR: MY_QR_001_KL_SHOPPING</div>
                                    <div className="text-sm text-green-600">Balance: 15.6 MYR</div>
                                </div>
                                <div className="border border-green-200 rounded-lg p-4">
                                    <div className="font-medium">Penang Food Court</div>
                                    <div className="text-sm text-gray-600">ID: merchant_malay_002</div>
                                    <div className="text-sm text-gray-600">QR: MY_QR_002_PENANG_FOOD</div>
                                    <div className="text-sm text-green-600">Balance: 2,521.87 MYR</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How to Use */}
                <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        How to Use Your QR Code
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl">1️⃣</span>
                            </div>
                            <h4 className="font-semibold mb-2">Generate QR</h4>
                            <p className="text-sm text-gray-600">Select your merchant ID and generate QR code</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl">2️⃣</span>
                            </div>
                            <h4 className="font-semibold mb-2">Display QR</h4>
                            <p className="text-sm text-gray-600">Show the QR code to your customers</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl">3️⃣</span>
                            </div>
                            <h4 className="font-semibold mb-2">Customer Scans</h4>
                            <p className="text-sm text-gray-600">Customer scans and enters payment amount</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl">4️⃣</span>
                            </div>
                            <h4 className="font-semibold mb-2">Receive Payment</h4>
                            <p className="text-sm text-gray-600">Payment processed and added to your balance</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 