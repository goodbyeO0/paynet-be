import React from 'react';
import { StatusIndicator } from '../components/StatusIndicator';
import { ContractInfo } from '../components/ContractInfo';

interface HomePageProps {
    onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            {/* Status Indicator */}
            <StatusIndicator />

            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <h1 className="text-3xl font-bold text-gray-900">
                                🌏 Cross-Border Payment System
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">🇹🇭 Thailand ↔️ Malaysia 🇲🇾</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Seamless Cross-Border Payments
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Experience secure, blockchain-verified payments between Thailand and Malaysia.
                        Bidirectional payments with bank-level encryption and real-time currency conversion.
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-4xl mb-4">🏦</div>
                        <h3 className="text-lg font-semibold mb-2">Bank-Level Security</h3>
                        <p className="text-gray-600">RSA-2048 encryption with separate keys for each bank</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-4xl mb-4">↔️</div>
                        <h3 className="text-lg font-semibold mb-2">Bidirectional Payments</h3>
                        <p className="text-gray-600">Support for Thailand → Malaysia AND Malaysia → Thailand</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-4xl mb-4">💱</div>
                        <h3 className="text-lg font-semibold mb-2">Auto Currency Conversion</h3>
                        <p className="text-gray-600">Automatic conversion between THB and MYR with real-time rates</p>
                    </div>
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Merchant Card */}
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                        <div className="text-6xl mb-4">🏪</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">I'm a Merchant</h3>
                        <p className="text-gray-600 mb-6">
                            Generate QR codes for customers to scan and pay.
                            Accept payments from both Thai and Malaysian customers.
                        </p>
                        <button
                            onClick={() => onNavigate('merchant')}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Generate QR Code
                        </button>
                    </div>

                    {/* Customer Card */}
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                        <div className="text-6xl mb-4">👤</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">I'm a Customer</h3>
                        <p className="text-gray-600 mb-6">
                            Scan merchant QR codes to make payments.
                            Pay merchants in any country with automatic currency conversion.
                        </p>
                        <button
                            onClick={() => onNavigate('customer')}
                            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                            Scan & Pay
                        </button>
                    </div>
                </div>

                {/* Payment Direction Info */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-12">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Supported Payment Directions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Thailand to Malaysia */}
                        <div className="border-2 border-blue-200 rounded-lg p-6">
                            <div className="text-center">
                                <div className="text-4xl mb-3">🇹🇭 → 🇲🇾</div>
                                <h4 className="font-semibold text-lg mb-2">Thailand to Malaysia</h4>
                                <p className="text-gray-600 text-sm mb-3">Thai customers paying Malaysian merchants</p>
                                <div className="bg-blue-50 p-2 rounded">
                                    <div className="text-sm font-medium">Exchange Rate: 1 THB = 0.13 MYR</div>
                                </div>
                            </div>
                        </div>

                        {/* Malaysia to Thailand */}
                        <div className="border-2 border-green-200 rounded-lg p-6">
                            <div className="text-center">
                                <div className="text-4xl mb-3">🇲🇾 → 🇹🇭</div>
                                <h4 className="font-semibold text-lg mb-2">Malaysia to Thailand</h4>
                                <p className="text-gray-600 text-sm mb-3">Malaysian customers paying Thai merchants</p>
                                <div className="bg-green-50 p-2 rounded">
                                    <div className="text-sm font-medium">Exchange Rate: 1 MYR = 7.69 THB</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div className="mb-12">
                    <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        How It Works
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📱</span>
                            </div>
                            <h4 className="font-semibold mb-2">1. Scan QR Code</h4>
                            <p className="text-sm text-gray-600">Customer scans merchant's QR code from any country</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🔐</span>
                            </div>
                            <h4 className="font-semibold mb-2">2. Bank Verification</h4>
                            <p className="text-sm text-gray-600">Banks decrypt and verify data through blockchain</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">💰</span>
                            </div>
                            <h4 className="font-semibold mb-2">3. Process Payment</h4>
                            <p className="text-sm text-gray-600">User enters amount and confirms payment</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">✅</span>
                            </div>
                            <h4 className="font-semibold mb-2">4. Complete Transfer</h4>
                            <p className="text-sm text-gray-600">Funds transferred with automatic currency conversion</p>
                        </div>
                    </div>
                </div>

                {/* Bank Information */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                        Supported Banks & Merchants
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="text-center">
                            <h4 className="text-xl font-semibold mb-4 text-blue-600">🇹🇭 Thailand</h4>
                            <div className="space-y-3">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <strong className="text-blue-800">Thai Bank</strong>
                                    <div className="text-sm text-gray-600 mt-1">
                                        <div>👤 Users: Ah Kong, Somchai</div>
                                        <div>🏪 Merchant: Bangkok Mall</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <h4 className="text-xl font-semibold mb-4 text-green-600">🇲🇾 Malaysia</h4>
                            <div className="space-y-3">
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <strong className="text-green-800">Maybank</strong>
                                    <div className="text-sm text-gray-600 mt-1">
                                        <div>👤 Users: Ahmad Abdullah, Siti Nurhaliza</div>
                                        <div>🏪 Merchants: KL Shopping Center, Penang Food Court</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Smart Contract Status */}
                <ContractInfo />
            </main>
        </div>
    );
} 