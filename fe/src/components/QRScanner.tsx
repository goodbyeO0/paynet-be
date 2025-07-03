import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore - QR Scanner library types
import QrScanner from 'qr-scanner';
import type { ScanQRResponse } from '../types/payment';

interface QRScannerProps {
    onScanSuccess: (response: ScanQRResponse, userId: string, country: string) => void;
}

export function QRScanner({ onScanSuccess }: QRScannerProps) {
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasCamera, setHasCamera] = useState(false);
    const [cameraPermission, setCameraPermission] = useState<'unknown' | 'granted' | 'denied'>('unknown');
    const [lastScannedData, setLastScannedData] = useState<any>(null);
    const [debugInfo, setDebugInfo] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const qrScannerRef = useRef<QrScanner | null>(null);

    // Available users
    const users = {
        Thailand: [
            { id: 'thai_001', name: 'Ah Kong', balance: 39880 },
            { id: 'thai_002', name: 'Somchai', balance: 15601 }
        ],
        Malaysia: [
            { id: 'malay_001', name: 'Ahmad Abdullah', balance: 10000 },
            { id: 'malay_002', name: 'Siti Nurhaliza', balance: 15000 }
        ]
    };

    const addDebugInfo = (info: string) => {
        setDebugInfo(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${info}`]);
    };

    useEffect(() => {
        const checkCameraAccess = async () => {
            try {
                addDebugInfo('Checking camera availability...');

                // Check if QrScanner has camera detection
                const hasCameraResult = await QrScanner.hasCamera();
                setHasCamera(hasCameraResult);
                addDebugInfo(`QrScanner.hasCamera(): ${hasCameraResult}`);

                // Check browser camera support
                if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
                    addDebugInfo('navigator.mediaDevices.getUserMedia is available');

                    // Check camera permission status
                    if (navigator.permissions) {
                        try {
                            const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
                            setCameraPermission(permission.state as any);
                            addDebugInfo(`Camera permission: ${permission.state}`);
                        } catch (permError) {
                            addDebugInfo('Permission API not available');
                        }
                    }

                    // Try to enumerate devices
                    try {
                        const devices = await navigator.mediaDevices.enumerateDevices();
                        const videoDevices = devices.filter(device => device.kind === 'videoinput');
                        addDebugInfo(`Found ${videoDevices.length} video devices`);

                        if (videoDevices.length > 0) {
                            setHasCamera(true);
                        }
                    } catch (enumError) {
                        addDebugInfo(`Device enumeration error: ${enumError}`);
                    }
                } else {
                    addDebugInfo('navigator.mediaDevices.getUserMedia not available');
                }

                // Check if we're on HTTPS or localhost
                const isSecureContext = window.isSecureContext;
                const protocol = window.location.protocol;
                addDebugInfo(`Secure context: ${isSecureContext}, Protocol: ${protocol}`);

            } catch (error) {
                addDebugInfo(`Camera check error: ${error}`);
                console.error('Camera check error:', error);
            }
        };

        checkCameraAccess();

        return () => {
            // Cleanup scanner on unmount
            if (qrScannerRef.current) {
                qrScannerRef.current.stop();
                qrScannerRef.current.destroy();
            }
        };
    }, []);

    const requestCameraPermission = async () => {
        try {
            addDebugInfo('Requesting camera permission...');

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment' // Prefer back camera
                }
            });

            // Stop the stream immediately, we just wanted to get permission
            stream.getTracks().forEach(track => track.stop());

            setCameraPermission('granted');
            setHasCamera(true);
            addDebugInfo('Camera permission granted');

        } catch (error) {
            setCameraPermission('denied');
            addDebugInfo(`Camera permission denied: ${error}`);
            setError('Camera permission denied. Please allow camera access and try again.');
        }
    };

    const startScanning = async () => {
        if (!selectedUser || !selectedCountry) {
            setError('Please select user and country first');
            return;
        }

        try {
            setError(null);
            addDebugInfo('Starting camera scanner...');
            addDebugInfo(`Video ref current: ${videoRef.current ? 'exists' : 'null'}`);

            // Request camera permission first if not granted
            if (cameraPermission !== 'granted') {
                await requestCameraPermission();
            }

            setIsScanning(true);

            // Wait a moment for the video element to be rendered
            await new Promise(resolve => setTimeout(resolve, 100));

            addDebugInfo(`Video ref after delay: ${videoRef.current ? 'exists' : 'null'}`);

            if (!videoRef.current) {
                addDebugInfo('Video element still not available, waiting longer...');
                await new Promise(resolve => setTimeout(resolve, 500));

                if (!videoRef.current) {
                    setError('Video element not available. Please try again.');
                    setIsScanning(false);
                    return;
                }
            }

            addDebugInfo('Video element found, initializing scanner...');
            addDebugInfo(`Video element tag: ${videoRef.current.tagName}`);
            addDebugInfo(`Video element id: ${videoRef.current.id || 'no id'}`);

            // Create QR scanner instance with more options
            qrScannerRef.current = new QrScanner(
                videoRef.current,
                (result: QrScanner.ScanResult) => {
                    addDebugInfo(`QR detected: ${result.data.substring(0, 50)}...`);
                    handleScanResult(result.data);
                },
                {
                    onDecodeError: (error: string | Error) => {
                        // Don't log every decode error as it's normal when no QR is visible
                        console.log('QR decode error:', error);
                    },
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                    preferredCamera: 'environment', // Use back camera on mobile
                    maxScansPerSecond: 5, // Limit scan frequency
                    returnDetailedScanResult: true
                }
            );

            addDebugInfo('QR Scanner instance created, starting...');
            await qrScannerRef.current.start();
            addDebugInfo('Camera started successfully');

        } catch (error) {
            console.error('Error starting scanner:', error);
            addDebugInfo(`Scanner start error: ${error}`);

            let errorMessage = 'Failed to start camera. ';

            if (error instanceof Error) {
                if (error.name === 'NotAllowedError') {
                    errorMessage += 'Camera permission denied.';
                } else if (error.name === 'NotFoundError') {
                    errorMessage += 'No camera found.';
                } else if (error.name === 'NotSupportedError') {
                    errorMessage += 'Camera not supported.';
                } else if (error.name === 'NotReadableError') {
                    errorMessage += 'Camera is being used by another application.';
                } else {
                    errorMessage += error.message;
                }
            }

            setError(errorMessage);
            setIsScanning(false);
        }
    };

    const stopScanning = () => {
        if (qrScannerRef.current) {
            qrScannerRef.current.stop();
            qrScannerRef.current.destroy();
            qrScannerRef.current = null;
        }
        setIsScanning(false);
        addDebugInfo('Camera stopped');
    };

    const handleScanResult = async (qrData: string) => {
        try {
            setIsProcessing(true);
            setError(null);
            addDebugInfo('Processing scanned QR data...');

            // Parse QR code data
            let parsedData;
            try {
                parsedData = JSON.parse(qrData);
            } catch (parseError) {
                // If it's not JSON, treat as legacy QR code
                parsedData = { qrCode: qrData };
            }

            setLastScannedData(parsedData);

            // Validate QR data
            if (parsedData.type !== 'PAYMENT_REQUEST' && !parsedData.qrCode) {
                setError('Invalid QR code format');
                setIsProcessing(false);
                return;
            }

            console.log('Scanned QR data:', parsedData);

            // Stop scanning
            stopScanning();

            // Process the scanned QR code
            const scanPayload = {
                qrCode: parsedData.qrCode || qrData,
                payerUserId: selectedUser,
                payerCountry: selectedCountry
            };

            addDebugInfo('Sending scan data to backend...');

            const response = await fetch('https://5cb83tf0-3000.asse.devtunnels.ms/scan-qr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scanPayload),
            });

            const result = await response.json();

            if (response.ok) {
                addDebugInfo('Scan successful, proceeding to payment');
                setIsProcessing(false);
                onScanSuccess(result, selectedUser, selectedCountry);
            } else {
                setError(result.error || 'Failed to process QR code');
                addDebugInfo(`Backend error: ${result.error}`);
                setIsProcessing(false);
            }
        } catch (error) {
            console.error('Error processing QR scan:', error);
            addDebugInfo(`Processing error: ${error}`);
            setError('Failed to process QR code');
            setIsProcessing(false);
        }
    };

    const testWithSampleQR = () => {
        // For testing purposes - simulate scanning a QR code
        const sampleQRData = {
            type: 'PAYMENT_REQUEST',
            merchantId: 'merchant_malay_001',
            merchantName: 'KL Shopping Center',
            country: 'Malaysia',
            currency: 'MYR',
            qrCode: 'MY_QR_001_KL_SHOPPING',
            timestamp: Date.now()
        };

        addDebugInfo('Using sample QR data for testing');
        handleScanResult(JSON.stringify(sampleQRData));
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
                <div className="text-2xl mr-2">📱</div>
                <h3 className="text-xl font-bold text-gray-800">QR Code Scanner</h3>
            </div>

            <div className="space-y-4">
                {/* Camera Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">📷 Camera Status</h4>
                    <div className="text-sm space-y-1">
                        <div>Camera Available: <span className={hasCamera ? 'text-green-600' : 'text-red-600'}>{hasCamera ? '✅ Yes' : '❌ No'}</span></div>
                        <div>Permission: <span className={cameraPermission === 'granted' ? 'text-green-600' : cameraPermission === 'denied' ? 'text-red-600' : 'text-yellow-600'}>
                            {cameraPermission === 'granted' ? '✅ Granted' : cameraPermission === 'denied' ? '❌ Denied' : '⏳ Unknown'}
                        </span></div>
                        <div>Protocol: <span className={window.location.protocol === 'https:' ? 'text-green-600' : 'text-yellow-600'}>
                            {window.location.protocol} {window.location.protocol === 'https:' ? '✅' : '⚠️'}
                        </span></div>
                    </div>
                </div>

                {/* User Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Country
                        </label>
                        <select
                            value={selectedCountry}
                            onChange={(e) => {
                                setSelectedCountry(e.target.value);
                                setSelectedUser(''); // Reset user when country changes
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Choose country...</option>
                            <option value="Thailand">🇹🇭 Thailand</option>
                            <option value="Malaysia">🇲🇾 Malaysia</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select User
                        </label>
                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            disabled={!selectedCountry}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                        >
                            <option value="">Choose user...</option>
                            {selectedCountry && users[selectedCountry as keyof typeof users]?.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} (Balance: {user.balance.toLocaleString()} {selectedCountry === 'Thailand' ? 'THB' : 'MYR'})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Camera Permission Button */}
                {cameraPermission !== 'granted' && (
                    <button
                        onClick={requestCameraPermission}
                        className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700"
                    >
                        🔓 Request Camera Permission
                    </button>
                )}

                {/* Manual Camera Test */}
                <button
                    onClick={async () => {
                        try {
                            addDebugInfo('Testing camera access manually...');
                            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                            addDebugInfo('Camera test successful!');

                            if (videoRef.current) {
                                videoRef.current.srcObject = stream;
                                addDebugInfo('Video stream attached to element');
                            }

                            // Stop after 3 seconds
                            setTimeout(() => {
                                stream.getTracks().forEach(track => track.stop());
                                if (videoRef.current) {
                                    videoRef.current.srcObject = null;
                                }
                                addDebugInfo('Camera test stream stopped');
                            }, 3000);

                        } catch (error) {
                            addDebugInfo(`Camera test failed: ${error}`);
                        }
                    }}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
                >
                    🧪 Test Camera Access (3 seconds)
                </button>

                {/* Scanner Controls */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        onClick={isScanning ? stopScanning : startScanning}
                        disabled={!selectedUser || !selectedCountry || isProcessing}
                        className={`flex-1 py-2 px-4 rounded-md font-semibold transition-colors ${isScanning
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400'
                            }`}
                    >
                        {isScanning ? '📷 Stop Scanning' : '📷 Start Camera Scanner'}
                    </button>

                    <button
                        onClick={testWithSampleQR}
                        disabled={!selectedUser || !selectedCountry || isProcessing}
                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        🧪 Test with Sample QR
                    </button>
                </div>

                {/* Loading State */}
                {isProcessing && (
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center justify-center space-x-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <div className="text-center">
                                <h4 className="font-semibold text-blue-800 mb-1">Processing QR Code...</h4>
                                <p className="text-sm text-blue-600">
                                    🔄 Validating payment data and connecting to backend
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 bg-white bg-opacity-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <span>Decrypting merchant information...</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-150"></div>
                                <span>Verifying payment details...</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse animation-delay-300"></div>
                                <span>Preparing secure payment flow...</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Camera View - Always render video element when scanning */}
                <div className="mt-4">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                        <video
                            ref={videoRef}
                            className={`w-full h-64 object-cover ${isScanning ? 'block' : 'hidden'}`}
                            playsInline
                            muted
                            autoPlay
                        />
                        {isScanning && (
                            <>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-48 h-48 border-2 border-green-400 rounded-lg opacity-75"></div>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 text-center">
                                    <p className="text-white text-sm bg-black bg-opacity-50 rounded px-2 py-1">
                                        📱 Point camera at QR code
                                    </p>
                                </div>
                            </>
                        )}
                        {!isScanning && (
                            <div className="h-64 flex items-center justify-center text-gray-500">
                                <div className="text-center">
                                    <div className="text-4xl mb-2">📷</div>
                                    <p>Camera will appear here when scanning</p>
                                </div>
                            </div>
                        )}

                        {/* Processing Overlay */}
                        {isProcessing && (
                            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                                    <h4 className="font-semibold text-lg mb-2">QR Code Detected!</h4>
                                    <p className="text-sm opacity-90">Processing payment data...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Debug Information */}
                {debugInfo.length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">🔧 Debug Info:</h4>
                        <div className="text-xs text-gray-600 space-y-1 max-h-32 overflow-y-auto">
                            {debugInfo.map((info, index) => (
                                <div key={index}>{info}</div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Last Scanned Data */}
                {lastScannedData && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Last Scanned QR:</h4>
                        <pre className="text-xs text-blue-700 overflow-x-auto">
                            {JSON.stringify(lastScannedData, null, 2)}
                        </pre>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm">❌ {error}</p>
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">📋 Troubleshooting:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Make sure you're using HTTPS (not HTTP)</li>
                        <li>• Allow camera permissions when prompted</li>
                        <li>• Try refreshing the page if camera doesn't work</li>
                        <li>• Use "Test with Sample QR" if camera isn't available</li>
                        <li>• Check if other apps are using the camera</li>
                    </ul>
                </div>
            </div>
        </div>
    );
} 