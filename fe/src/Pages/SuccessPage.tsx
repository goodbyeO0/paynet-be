import React from 'react';

interface SuccessPageProps {
    onNavigate: (page: string) => void;
}

export function SuccessPage({ onNavigate }: SuccessPageProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-3xl font-bold text-gray-900">
                                🌏 Cross-Border Payment System
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-green-600 font-medium">Payment Successful!</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Success Animation */}
                <div className="text-center mb-12">
                    <div className="relative">
                        <div className="text-8xl mb-6 animate-bounce">🎉</div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 bg-green-200 rounded-full opacity-20 animate-ping"></div>
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold text-green-800 mb-4">
                        Payment Successful!
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Your cross-border payment has been completed successfully.
                        The transaction has been verified and recorded on the blockchain.
                    </p>
                </div>

                {/* Success Details */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Transaction Complete</h3>
                        <p className="text-gray-600">Your payment has been processed and the merchant has been notified.</p>
                    </div>

                    {/* Transaction Flow */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="text-center">
                            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="text-sm font-medium">QR Scanned</div>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="text-sm font-medium">Banks Verified</div>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="text-sm font-medium">Payment Processed</div>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="text-sm font-medium">Funds Transferred</div>
                        </div>
                    </div>
                </div>

                {/* Security Features */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Security Features Used
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-4xl mb-3">🔐</div>
                            <h4 className="font-semibold mb-2">RSA-2048 Encryption</h4>
                            <p className="text-sm text-gray-600">Bank-level encryption for data protection</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-3">⛓️</div>
                            <h4 className="font-semibold mb-2">Blockchain Verification</h4>
                            <p className="text-sm text-gray-600">Transaction recorded on Ethereum blockchain</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-3">🏦</div>
                            <h4 className="font-semibold mb-2">Multi-Bank Verification</h4>
                            <p className="text-sm text-gray-600">Both origin and destination banks verified</p>
                        </div>
                    </div>
                </div>

                {/* What's Next */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        What Happens Next?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start space-x-3">
                            <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-sm font-bold text-green-600">1</span>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Merchant Notification</h4>
                                <p className="text-sm text-gray-600">The merchant has been notified of your payment and will process your order.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-sm font-bold text-green-600">2</span>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Blockchain Record</h4>
                                <p className="text-sm text-gray-600">Your transaction is permanently recorded on the blockchain for transparency.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-sm font-bold text-green-600">3</span>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Balance Updated</h4>
                                <p className="text-sm text-gray-600">Your account balance has been updated and the merchant's balance increased.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-sm font-bold text-green-600">4</span>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Receipt Available</h4>
                                <p className="text-sm text-gray-600">Transaction details are available for your records.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="text-center space-y-4">
                    <div className="space-x-4">
                        <button
                            onClick={() => onNavigate('customer')}
                            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                            Make Another Payment
                        </button>
                        <button
                            onClick={() => onNavigate('home')}
                            className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                    <p className="text-sm text-gray-500">
                        Thank you for using our cross-border payment system!
                    </p>
                </div>

                {/* Fun Stats */}
                <div className="mt-12 bg-white rounded-lg shadow-md p-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                        🎯 Did You Know?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="text-2xl font-bold text-blue-600">⚡</div>
                            <div className="text-sm text-gray-600">Your payment was processed in seconds using blockchain technology</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-600">🌍</div>
                            <div className="text-sm text-gray-600">Cross-border payments made simple with automatic currency conversion</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-purple-600">🔒</div>
                            <div className="text-sm text-gray-600">Your transaction is secured with the same encryption banks use</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 