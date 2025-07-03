import { useState, useEffect } from 'react';
import { paymentAPI } from '../services/api';

interface ContractInfo {
    contractAddress: string;
    network: string;
    isConnected: boolean;
}

export function ContractInfo() {
    const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchContractInfo();
    }, []);

    const fetchContractInfo = async () => {
        try {
            setLoading(true);
            const data = await paymentAPI.getContractInfo();
            setContractInfo(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch contract information');
            console.error('Contract info error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                    <div className="text-red-600 mr-2">⚠️</div>
                    <div>
                        <p className="text-red-800 font-medium">Contract Connection Error</p>
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!contractInfo) return null;

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <span className="mr-2">⛓️</span>
                        Smart Contract Status
                        <div className={`ml-3 w-3 h-3 rounded-full ${contractInfo.isConnected ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                    </h3>
                    <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Network:</span> {contractInfo.network}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Contract:</span>
                            <span className="font-mono text-xs ml-1">
                                {contractInfo.contractAddress.slice(0, 6)}...{contractInfo.contractAddress.slice(-4)}
                            </span>
                        </p>
                        <p className="text-sm">
                            <span className="font-medium">Status:</span>
                            <span className={`ml-1 ${contractInfo.isConnected ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {contractInfo.isConnected ? 'Connected' : 'Disconnected'}
                            </span>
                        </p>
                    </div>
                </div>

                <button
                    onClick={fetchContractInfo}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                    Refresh
                </button>
            </div>

            {contractInfo.isConnected && (
                <div className="mt-3 p-2 bg-green-50 rounded-md">
                    <p className="text-green-800 text-sm">
                        ✅ Bidirectional payments supported - All transactions recorded on blockchain
                    </p>
                </div>
            )}

            {!contractInfo.isConnected && (
                <div className="mt-3 p-2 bg-yellow-50 rounded-md">
                    <p className="text-yellow-800 text-sm">
                        ⚠️ Using mock contract - transactions won't be recorded on blockchain
                    </p>
                </div>
            )}
        </div>
    );
} 