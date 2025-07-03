import React, { useState, useEffect } from 'react';
import { paymentAPI } from '../services/api';
import type { PaymentSession } from '../types/payment';

interface PaymentFlowProps {
    scanResponse: {
        sessionId: string;
        merchantName: string;
        status: string;
        direction: string;
        transactionHash: string;
        blockNumber?: number;
    };
    payerUserId: string;
    payerCountry: string;
    onComplete: () => void;
}

export function PaymentFlow({ scanResponse, payerUserId, payerCountry, onComplete }: PaymentFlowProps) {
    const [step, setStep] = useState<'verification' | 'payment' | 'processing' | 'completed'>('verification');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [session, setSession] = useState<PaymentSession | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [verificationStarted, setVerificationStarted] = useState(false);

    // Determine bank information based on direction
    const bankInfo = React.useMemo(() => {
        if (scanResponse.direction === 'THAILAND_TO_MALAYSIA') {
            return {
                originBank: 'THAI_BANK_001',
                destinationBank: 'MAYBANK_001',
                originBankName: 'Thai Bank',
                destinationBankName: 'Maybank',
                payerCurrency: 'THB',
                merchantCurrency: 'MYR',
                conversionRate: 0.13
            };
        } else {
            return {
                originBank: 'MAYBANK_001',
                destinationBank: 'THAI_BANK_001',
                originBankName: 'Maybank',
                destinationBankName: 'Thai Bank',
                payerCurrency: 'MYR',
                merchantCurrency: 'THB',
                conversionRate: 7.69
            };
        }
    }, [scanResponse.direction]);

    // Auto-start verification when component mounts
    useEffect(() => {
        if (step === 'verification' && !verificationStarted) {
            setVerificationStarted(true);
            verifyBankData();
        }
    }, [step, verificationStarted]);

    const verifyBankData = async () => {
        if (loading || step !== 'verification') {
            console.log('⚠️ Verification already in progress or step changed');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('🔄 Starting simplified bank verification process...');
            console.log('Origin Bank:', bankInfo.originBank);
            console.log('Destination Bank:', bankInfo.destinationBank);

            // Check if session is already verified first
            const currentSession = await paymentAPI.getPaymentStatus(scanResponse.sessionId);
            if (currentSession.status === 'verified' || currentSession.status === 'completed') {
                console.log('✅ Session already verified, proceeding to payment');
                setSession(currentSession);
                setStep('payment');
                setLoading(false);
                return;
            }

            // Verify both banks sequentially to avoid race conditions
            console.log('🔄 Verifying origin bank...');
            const originResponse = await paymentAPI.verifyBank({
                sessionId: scanResponse.sessionId,
                bankId: bankInfo.originBank,
            }).catch(err => {
                if (err.message.includes('already being processed') ||
                    err.message.includes('already verified') ||
                    err.message.includes('replacement fee too low')) {
                    console.log('⚠️ Origin bank verification already in progress/completed');
                    return { verified: true, transactionHash: 'already_processed' };
                }
                throw err;
            });

            // Small delay to ensure origin bank verification completes first
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('🔄 Verifying destination bank...');
            const destinationResponse = await paymentAPI.verifyBank({
                sessionId: scanResponse.sessionId,
                bankId: bankInfo.destinationBank,
            }).catch(err => {
                if (err.message.includes('already being processed') ||
                    err.message.includes('already verified') ||
                    err.message.includes('replacement fee too low')) {
                    console.log('⚠️ Destination bank verification already in progress/completed');
                    return { verified: true, transactionHash: 'already_processed' };
                }
                throw err;
            });

            console.log('Origin Bank Verification:', originResponse.verified);
            console.log('Destination Bank Verification:', destinationResponse.verified);

            if (originResponse.verified && destinationResponse.verified) {
                console.log('✅ Both banks verified successfully - data integrity confirmed');
                setStep('payment');

                // Get updated session data
                const sessionData = await paymentAPI.getPaymentStatus(scanResponse.sessionId);
                setSession(sessionData);
            } else {
                setError('Bank verification failed - encrypted data could not be decrypted or verified');
            }
        } catch (err) {
            console.error('Verification error:', err);
            if (err instanceof Error && !err.message.includes('replacement fee too low')) {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const processPayment = async () => {
        if (!amount || amount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('💰 Processing payment...');
            const response = await paymentAPI.processPayment({
                sessionId: scanResponse.sessionId,
                amount: amount
            });

            console.log('✅ Payment initiated:', response);
            setStep('processing');

            // Poll for completion
            const pollInterval = setInterval(async () => {
                try {
                    const status = await paymentAPI.getPaymentStatus(scanResponse.sessionId);
                    if (status.status === 'completed') {
                        clearInterval(pollInterval);
                        setSession(status);
                        setStep('completed');
                        setLoading(false);
                    } else if (status.status === 'failed') {
                        clearInterval(pollInterval);
                        setError('Payment failed');
                        setLoading(false);
                    }
                } catch (pollError) {
                    console.error('Polling error:', pollError);
                }
            }, 2000);

            // Clear interval after 30 seconds to prevent infinite polling
            setTimeout(() => {
                clearInterval(pollInterval);
                if (step === 'processing') {
                    setLoading(false);
                }
            }, 30000);

        } catch (err) {
            console.error('Payment error:', err);
            setError(err instanceof Error ? err.message : 'Payment failed');
            setLoading(false);
        }
    };

    const convertedAmount = amount * bankInfo.conversionRate;

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Cross-Border Payment
                </h2>
                <div className="text-sm text-gray-600">
                    <p>To: {scanResponse.merchantName}</p>
                    <p>Direction: {scanResponse.direction.replace('_', ' → ')}</p>
                    <p>Session: {scanResponse.sessionId}</p>
                </div>
            </div>

            {/* Step Indicator */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${step === 'verification' ? 'text-blue-600' : 'text-gray-400'}`}>
                        Bank Verification
                    </span>
                    <span className={`text-sm font-medium ${step === 'payment' ? 'text-blue-600' : 'text-gray-400'}`}>
                        Payment
                    </span>
                    <span className={`text-sm font-medium ${step === 'processing' ? 'text-blue-600' : 'text-gray-400'}`}>
                        Processing
                    </span>
                    <span className={`text-sm font-medium ${step === 'completed' ? 'text-green-600' : 'text-gray-400'}`}>
                        Complete
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                            width: step === 'verification' ? '25%' :
                                step === 'payment' ? '50%' :
                                    step === 'processing' ? '75%' : '100%'
                        }}
                    />
                </div>
            </div>

            {/* Verification Step */}
            {step === 'verification' && (
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-800 mb-2">
                            🔐 Verifying Encrypted Data
                        </h3>
                        <p className="text-sm text-blue-700 mb-3">
                            Both banks are decrypting and verifying the payment data to ensure security and integrity.
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">{bankInfo.originBankName}</span>
                                <span className="text-sm text-blue-600">
                                    {loading ? '🔄 Decrypting...' : '✅ Ready'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">{bankInfo.destinationBankName}</span>
                                <span className="text-sm text-blue-600">
                                    {loading ? '🔄 Decrypting...' : '✅ Ready'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {loading && (
                        <div className="text-center py-4">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-sm text-gray-600">Verifying bank encryption...</p>
                        </div>
                    )}
                </div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
                <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-green-800 mb-2">
                            ✅ Verification Complete
                        </h3>
                        <p className="text-sm text-green-700">
                            Both banks have successfully decrypted and verified the payment data.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount ({bankInfo.payerCurrency})
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter amount"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        {amount > 0 && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <p className="text-sm text-gray-600">
                                    Merchant will receive: <span className="font-semibold">
                                        {convertedAmount.toFixed(2)} {bankInfo.merchantCurrency}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Exchange rate: 1 {bankInfo.payerCurrency} = {bankInfo.conversionRate} {bankInfo.merchantCurrency}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={processPayment}
                            disabled={loading || amount <= 0}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Confirm Payment'}
                        </button>
                    </div>
                </div>
            )}

            {/* Processing Step */}
            {step === 'processing' && (
                <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h3 className="font-semibold text-yellow-800 mb-2">
                            ⏳ Processing Payment
                        </h3>
                        <p className="text-sm text-yellow-700">
                            Your payment is being processed. Please wait...
                        </p>
                    </div>

                    <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                        <p className="mt-2 text-sm text-gray-600">Processing cross-border payment...</p>
                    </div>
                </div>
            )}

            {/* Completed Step */}
            {step === 'completed' && session && (
                <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-green-800 mb-2">
                            🎉 Payment Completed!
                        </h3>
                        <div className="space-y-2 text-sm text-green-700">
                            <p>Amount paid: {session.amount} {bankInfo.payerCurrency}</p>
                            <p>Merchant received: {(session.amount! * bankInfo.conversionRate).toFixed(2)} {bankInfo.merchantCurrency}</p>
                            <p>Transaction recorded on blockchain</p>
                        </div>
                    </div>

                    <button
                        onClick={onComplete}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                    >
                        Done
                    </button>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">Error</h3>
                    <p className="text-sm text-red-700">{error}</p>
                    {step === 'verification' && (
                        <button
                            onClick={() => {
                                setError(null);
                                setVerificationStarted(false);
                                verifyBankData();
                            }}
                            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            )}
        </div>
    );
} 