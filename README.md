
# TokenMCP - Solana Blockchain MCP Server

**TokenMCP** is a Model Context Protocol (MCP) server that exposes powerful tools for querying token, wallet, and yield data on the Solana blockchain. It supports Claude and AI agents via the MCP standard.

---

## 🚀 Features

- 🔍 **Get Wallet Balance** – Check any Solana wallet’s SOL balance via Helius RPC
- 📈 **Get Solana Token Info** – Lookup token price, FDV, and market cap via Dexscreener
- 🚀 **Get Trending Tokens** – Top Solana tokens by 24h volume using Birdeye API
- 👑 **Get Top Token Holders** – Retrieve top holders of a token using Helius + Web3
- 🧪 **Get Best Yields** – View best APYs from Solana protocols via DeFi Llama
- 😨 **Fear & Greed Index** – Check market sentiment via Alternative.me API
- 📈 **FNG Trend Analysis** – Analyze Crypto Fear & Greed Index trends over time
- ✅ **Zod Schema Validation** – All tools use strongly typed input validation
- 📦 **MCP Compliant** – Ready to connect with Claude apps using MCP SDK

---

## 🛠 Tech Stack

- **TypeScript** – Type-safe backend code
- **Zod** – Input validation
- **Solana Web3.js** – Wallet and token data
- **Dexscreener API** – Token trading info
- **Birdeye API** – Trending token stats
- **DeFi Llama API** – Yield farming data
- **Alternative.me API** – Fear & Greed Index
- **Helius RPC** – High-quality Solana RPC

---

## 📋 Requirements

- **Node.js** v16+
- **npm**
- **Birdeye API Key**
- **Helius RPC URL**

Both the **BIRDEYE_API_KEY** and **HELIUS_RPC_URL** must be saved in your `.env` file for the server to function properly.

---

## ⚙️ Tools & Descriptions

### 1. `getBalance`

- **Description**: Get the SOL balance of a given wallet.
- **Inputs**:  
  `walletAddress` – Base58 Solana wallet address.
- **Example**:  
  _"What is the balance of wallet [walletAddress]?"_

---

### 2. `GetSolanaTokenInfo`

- **Description**: Get token info (price, symbol, FDV, etc.) via Dexscreener.
- **Inputs**:  
  `contractAddress` – Solana token address.
- **Example**:  
  _"Get token info for [contractAddress]"_

---

### 3. `getTrendingTokens`

- **Description**: Top 10 Solana tokens by 24h volume via Birdeye.
- **Inputs**: None
- **Example**:  
  _"Which Solana tokens are trending today?"_

---

### 4. `getTopTokenHolders`

- **Description**: See the largest holders of a Solana token.
- **Inputs**:  
  `tokenAddress` – Mint address  
  `count` (optional) – Number of top holders (default: 5, max: 50)
- **Example**:  
  _"Show top holders for [tokenAddress]"_

---

### 5. `getBestYields`

- **Description**: Top APY pools on Solana via DeFi Llama.
- **Inputs**: None
- **Example**:  
  _"What are the best yield farming opportunities on Solana?"_

---

### 6. `getCurrentFearGreedIndex`

- **Description**: Get the current crypto Fear & Greed Index.
- **Inputs**: None
- **Example**:  
  _"What's the current market sentiment?"_

---

### 7. `analyzeFngTrend`

- **Description**: Analyze Fear & Greed Index over time.
- **Inputs**:  
  `days` – Number of days to analyze
- **Example**:  
  _"Analyze FNG trend over the last 7 days."_

---

## 📦 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/TokenMCP.git
cd TokenMCP
```

### 2. Install Dependencies

Install the required dependencies using `npm`:

```bash
npm install @modelcontextprotocol/sdk zod
npm install -D @types/node typescript

```
3. Set Up Environment Variables
🛑 IMPORTANT: You must set both BIRDEYE_API_KEY and HELIUS_RPC_URL in a .env file.
Without them, the server will fail to start.

Create a .env file in the root directory:

```env
BIRDEYE_API_KEY=your_birdeye_api_key_here
HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your_helius_key_here

```

🐦 Get your Birdeye API key here

⚡ Get your Helius RPC URL here

🧪 Run & Inspect
1. Build the project

```bash
npm run build
```

2. Inspect the MCP Server
```bash
npx @modelcontextprotocol/inspector node path/to/build/index.js
```

Replace path/to/build/index.js with the actual path to your compiled entrypoint.

🤖 Connect to Claude Desktop
To run TokenMCP tools from Claude, configure Claude Desktop with your MCP server.

Open your Claude config file:

```bash
code $env:AppData\\Claude\\claude_desktop_config.json
```

Add the following:

```json
{
  "mcpServers": {
    "TOKENMCP": {
      "command": "node",
      "args": [
        "C:\\Absolute\\Path\\To\\TokenMCP\\build\\index.js"
      ],
      "env": {
        "BIRDEYE_API_KEY": "your_birdeye_api_key_here",
        "HELIUS_RPC_URL": "your_helius_rpc_url_here"
      }
    }
  }
}
```
Save and restart Claude Desktop.

🛡️ Security Tips
.env is already gitignored – do not expose it!

Never hardcode private or API keys in your code

Use read-only public Solana wallets when querying balances


🤝 Contributions
Want to extend the server or add new tools? PRs and feedback are welcome!


📄 License
MIT – See LICENSE

✅ Final Notes
You must set both BIRDEYE_API_KEY and HELIUS_RPC_URL in your environment.

This server will not boot without them.

Run the inspector before connecting to Claude to ensure everything works.