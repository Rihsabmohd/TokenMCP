

# TokenMCP - Solana Blockchain MCP Server

**TokenMCP** is a Model Context Protocol (MCP) server implementation for interacting with the Solana blockchain. This server exposes tools to work with Solana wallets, transactions, and token-related data.

## 🚀 Features

* **Get Wallet Balance**: Retrieve the balance of a Solana wallet.
* **Get Solana Token Info**: Fetch relevant token information such as price, market cap, and liquidity for Solana tokens.
* **Get Trending Tokens**: Retrieve the top 10 trending Solana tokens based on 24h volume, using the Birdeye API.
* **MCP Compliant**: Fully compatible with the Model Context Protocol, allowing seamless integration into compatible clients.
* **Schema Validation**: Tools are defined using `Zod` for strict input validation.

## 🔧 Technologies Used

* **Solana Web3.js SDK** – Interaction with the Solana blockchain.
* **Model Context Protocol (MCP)** – Standard protocol for defining and exposing tools.
* **Zod** – Type-safe schema validation.
* **TypeScript** – Strongly typed and modern tooling for development.

## 📋 Requirements

* **Node.js** v16+ (preferably LTS)
* **Yarn** or **npm** (for package management)
* **Birdeye API Key** (for fetching trending tokens)

## 🚀 Getting Started

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/TokenMCP
cd TokenMCP
```

### 2. Install Dependencies

Install the required dependencies using `npm` or `yarn`:

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory of the project and add your environment variables. This includes the Birdeye API key, which is required for the `getTrendingTokens` tool.

#### Example `.env` file:

```plaintext
BIRDEYE_API_KEY=your_birdeye_api_key_here
```

You can obtain the API key by signing up on [Birdeye](https://bds.birdeye.so/).

### 4. Build the MCP Server

Build the server with the following command:

```bash
npm run build
```

### 5. Run the Server

Start the MCP server with:

```bash
npm start
```

The server will now be running and will listen for requests via the Model Context Protocol.

## ⚙️ Tools & Their Descriptions

### 1. **getBalance**

* **Description**: Fetch the SOL balance of a wallet.
* **Inputs**:

  * `walletAddress` (string) – The wallet address in Base58 format.
* **Example Usage**:

  * `"What is the balance of wallet [walletAddress]?"`

### 2. **GetSolanaTokenInfo**

* **Description**: Retrieve relevant information for a Solana token using its contract address.
* **Inputs**:

  * `contractAddress` (string) – The token's contract address on Solana.
* **Example Usage**:

  * `"What is the information for token [contractAddress]?"`

### 3. **getTrendingTokens**

* **Description**: Retrieve the top 10 trending Solana tokens by 24-hour volume using the Birdeye API.
* **Inputs**: None
* **Example Usage**:

  * `"What are the top 10 trending Solana tokens?"`

#### **Important: Get Birdeye API Key**

To use the `getTrendingTokens` tool, you must obtain an API key from Birdeye:

1. Visit [Birdeye API](https://bds.birdeye.so/) to sign up and generate an API key.
2. Once you have the API key, add it to the `.env` file as shown in the **Set Up Environment Variables** section above.

## 🔧 API Usage

### Example Request for `getBalance`:

```json
{
  "tool": "getBalance",
  "params": {
    "walletAddress": "your_wallet_address"
  }
}
```

### Example Request for `GetSolanaTokenInfo`:

```json
{
  "tool": "GetSolanaTokenInfo",
  "params": {
    "contractAddress": "your_token_contract_address"
  }
}
```

### Example Request for `getTrendingTokens`:

```json
{
  "tool": "getTrendingTokens",
  "params": {}
}
```

## 🛡️ Security Considerations

* **Private Keys**: Always protect your private keys. Ensure they are stored securely and never exposed in your code or publicly.
* **Environment Variables**: Store sensitive data like API keys in environment variables. Never hardcode sensitive information in the source code.

## 🤝 Contributing

This project is open for contributions from the community. If you have any suggestions or improvements, feel free to submit a pull request or open an issue.

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

### Final Notes:

* Be sure to replace `your_wallet_address` and `your_token_contract_address` with actual addresses when using the tools.
* Make sure your `.env` file is added to `.gitignore` to prevent accidentally committing sensitive information like your API key.
