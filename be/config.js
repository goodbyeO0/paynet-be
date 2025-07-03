// Smart Contract Configuration
// Update these values with your actual deployment details

module.exports = {
    // Your deployed smart contract address
    CONTRACT_ADDRESS: "",

    // Your wallet private key (the one that deployed the contract)
    // ⚠️ NEVER commit real private keys to version control!
    PRIVATE_KEY: "",

    // RPC URL for your blockchain network
    RPC_URL: "",

    // Network information
    NETWORK: {
        name: "Sepolia Testnet",
        chainId: 11155111,
        currency: "ETH"
    },

    // Gas settings (optional)
    GAS_SETTINGS: {
        gasLimit: 500000,
        gasPrice: null // Let ethers.js auto-calculate
    }
}; 