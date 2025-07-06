// Smart Contract Configuration
// Update these values with your actual deployment details

module.exports = {
    // Your deployed smart contract address
    CONTRACT_ADDRESS: "0xe7E64f18F2345427d588e3fca0d6340b91047ebF",

    // Your wallet private key (the one that deployed the contract)
    // ⚠️ NEVER commit real private keys to version control!
    PRIVATE_KEY: "",

    // RPC URL for your blockchain network
    RPC_URL: "",

    // Network information
    NETWORK: {
        name: "base",
        chainId: 84532,
        currency: "ETH"
    },

    // Gas settings (optional)
    GAS_SETTINGS: {
        gasLimit: 500000,
        gasPrice: null // Let ethers.js auto-calculate
    }
}; 