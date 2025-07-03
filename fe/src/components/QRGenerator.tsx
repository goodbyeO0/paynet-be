import React, { useState, useEffect } from 'react';
// @ts-ignore - QRCode library types
import QRCode from 'qrcode';

interface Merchant {
    merchantId: string;
    merchantName: string;
    qrCode: string;
    country: string;
    currency: string;
}

export function QRGenerator() {
    const [selectedMerchant, setSelectedMerchant] = useState<string>('');
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [merchantData, setMerchantData] = useState<Merchant | null>(null);
    const [loading, setLoading] = useState(false);

    // Available merchants
    const merchants = [
        { id: 'merchant_thai_001', name: 'Bangkok Mall', country: 'Thailand', currency: 'THB' },
        { id: 'merchant_malay_001', name: 'KL Shopping Center', country: 'Malaysia', currency: 'MYR' },
        { id: 'merchant_malay_002', name: 'Penang Food Court', country: 'Malaysia', currency: 'MYR' }
    ];

    const generateQRCode = async () => {
        if (!selectedMerchant) return;

        setLoading(true);
        try {
            // Fetch merchant data from backend
            const response = await fetch(`https://5cb83tf0-3000.asse.devtunnels.ms/generate-qr/${selectedMerchant}`);
            const data = await response.json();

            if (data.qrData) {
                setMerchantData(data.qrData);

                // Create QR code data with merchant information
                const qrData = {
                    type: 'PAYMENT_REQUEST',
                    merchantId: data.qrData.merchantId,
                    merchantName: data.qrData.merchantName,
                    country: data.qrData.country,
                    currency: data.qrData.currency,
                    qrCode: data.qrData.qrCode,
                    timestamp: Date.now()
                };

                // Generate actual QR code with embedded data
                const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
                    width: 300,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    },
                    errorCorrectionLevel: 'M'
                });

                setQrCodeUrl(qrCodeDataURL);
            }
        } catch (error) {
            console.error('Error generating QR code:', error);
            alert('Failed to generate QR code');
        } finally {
            setLoading(false);
        }
    };

    const downloadQRCode = () => {
        if (!qrCodeUrl || !merchantData) return;

        const link = document.createElement('a');
        link.download = `${merchantData.merchantId}_qr_code.png`;
        link.href = qrCodeUrl;
        link.click();
    };

    const copyQRData = () => {
        if (!merchantData) return;

        const qrData = {
            type: 'PAYMENT_REQUEST',
            merchantId: merchantData.merchantId,
            merchantName: merchantData.merchantName,
            country: merchantData.country,
            currency: merchantData.currency,
            qrCode: merchantData.qrCode,
            timestamp: Date.now()
        };

        navigator.clipboard.writeText(JSON.stringify(qrData, null, 2));
        alert('QR data copied to clipboard!');
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
                <div className="text-2xl mr-2">🏪</div>
                <h3 className="text-xl font-bold text-gray-800">Merchant QR Generator</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Merchant
                    </label>
                    <select
                        value={selectedMerchant}
                        onChange={(e) => setSelectedMerchant(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Choose a merchant...</option>
                        {merchants.map((merchant) => (
                            <option key={merchant.id} value={merchant.id}>
                                {merchant.name} ({merchant.country} - {merchant.currency})
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={generateQRCode}
                    disabled={!selectedMerchant || loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? 'Generating...' : 'Generate QR Code'}
                </button>

                {qrCodeUrl && merchantData && (
                    <div className="mt-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <h4 className="font-semibold text-green-800 mb-2">QR Code Generated!</h4>
                            <div className="space-y-1 text-sm text-green-700">
                                <p><strong>Merchant:</strong> {merchantData.merchantName}</p>
                                <p><strong>Country:</strong> {merchantData.country}</p>
                                <p><strong>Currency:</strong> {merchantData.currency}</p>
                                <p><strong>QR ID:</strong> {merchantData.qrCode}</p>
                            </div>
                        </div>

                        {/* QR Code Display */}
                        <div className="text-center bg-white border-2 border-dashed border-gray-300 rounded-lg p-6">
                            <img
                                src={qrCodeUrl}
                                alt={`QR Code for ${merchantData.merchantName}`}
                                className="mx-auto mb-4"
                            />
                            <p className="text-sm text-gray-600 mb-4">
                                QR Code for {merchantData.merchantName}
                            </p>
                            <p className="text-xs text-blue-600 mb-4">
                                Scan with Thai E-Wallet or Malaysian E-Wallet
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                <button
                                    onClick={downloadQRCode}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                                >
                                    📥 Download QR Code
                                </button>
                                <button
                                    onClick={copyQRData}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                                >
                                    📋 Copy QR Data
                                </button>
                            </div>
                        </div>

                        {/* QR Data Preview */}
                        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h5 className="font-semibold text-gray-800 mb-2">QR Code Data:</h5>
                            <pre className="text-xs text-gray-600 overflow-x-auto">
                                {JSON.stringify({
                                    type: 'PAYMENT_REQUEST',
                                    merchantId: merchantData.merchantId,
                                    merchantName: merchantData.merchantName,
                                    country: merchantData.country,
                                    currency: merchantData.currency,
                                    qrCode: merchantData.qrCode,
                                    timestamp: 'CURRENT_TIME'
                                }, null, 2)}
                            </pre>
                        </div>

                        {/* Instructions */}
                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h5 className="font-semibold text-blue-800 mb-2">📱 How to Use:</h5>
                            <ol className="text-sm text-blue-700 space-y-1">
                                <li>1. Display this QR code to your customers</li>
                                <li>2. Customers scan with their mobile camera</li>
                                <li>3. They enter payment amount and confirm</li>
                                <li>4. Payment is processed automatically</li>
                            </ol>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 