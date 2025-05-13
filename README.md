

# TokenMCP - Solana Blockchain MCP Server

**TokenMCP** is a Model Context Protocol (MCP) server that exposes powerful tools for querying token and yield data on the Solana blockchain. 


## 🚀 Features

- 🔍 **Get Wallet Balance** – Check any Solana wallet’s SOL balance
- 📈 **Get Solana Token Info** – Lookup token price, market cap, and liquidity
- 🚀 **Get Trending Tokens** – Top Solana tokens by 24h volume using Birdeye
- 🧪 **Get Best Yields** – View best APYs from Solana protocols via DeFi Llama
- ✅ **Zod Schema Validation** – Every tool uses strongly typed validation
- 📦 **MCP Compliant** – Fully integrated with the Model Context Protocol standard

---


## 📦 Tech Stack

**Solana Web3.js** – Blockchain interaction

**Zod** – Schema validation

**TypeScript** – Type-safe code

**Birdeye API** – Token data

**DeFi Llama API** – Yield opportunities

**MCP SDK** – Protocol interface for Claude and AI agents

## 📋 Requirements

* **Node.js** v16+ (preferably LTS)
* **npm** (for package management)
* **Birdeye API Key** (for fetching trending tokens)

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


### 4.  **getBestYields**
Description: Retrieve the top 10 highest-yielding farming and lending pools on the Solana blockchain using DeFi Llama.

Inputs: None

Example Usage:

"What are the top yield farming opportunities on Solana right now?"

"Show me the best APY pools available on Solana."



## 🚀 Getting Started

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/Rihsabmohd/TokenMCP.git
cd TokenMCP
```

### 2. Install Dependencies

Install the required dependencies using `npm` or `yarn`:

```bash
npm install @modelcontextprotocol/sdk zod
npm install -D @types/node typescript

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

### 5. Inspect the server

Inspect the MCP server and check if the tools are working properly:

```bash
npx @modelcontextprotocol/inspector node path/to/server/index.js...
```

replace ```path/to/server/index.js``` with the absolute path of your index.js

### 🤖 Connecting your server to Claude Desktop

You can connect TokenMCP to Claude Desktop (or any Claude app supporting MCP) to run these tools directly from your chat.

First, make sure you have Claude for Desktop installed. 
We’ll need to configure Claude for Desktop for whichever MCP servers you want to use. To do this, open your Claude for Desktop App configuration at 

```bash 
  code $env:AppData\Claude\claude_desktop_config.json
```
open the claude_desktop_config.json file and paste this 

```json
{
    "mcpServers": {
        "TOKENMCP": {
            "command": "node",
            "args": [
                "C:\\Users\\HP\\Desktop\\Regen\\Solana\\TokenMCP\\build\\index.js"
            ],
            "env":{
                "BIRDEYE_API_KEY":"your_birdeye_api_key_here"
            }
        }
    }
}
```
This tells Claude for Desktop:

There’s an MCP server named “TOKENMCP”
Launch it by running node /ABSOLUTE/PATH/TO/PARENT/FOLDER/TokenMCP/build/index.js
Save the file, and restart Claude for Desktop.




## 🛡️ Security Tips
Keep your .env file secret (it's gitignored).

Never commit your API keys or wallet private keys.

Use read-only wallets for balance queries when possible.

## 🤝 Contributing

This project is open for contributions from the community. If you have any suggestions or improvements, feel free to submit a pull request or open an issue.

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

### Final Notes:

* Be sure to replace `your_wallet_address` and `your_token_contract_address` with actual addresses when using the tools.
* Make sure your `.env` file is added to `.gitignore` to prevent accidentally committing sensitive information like your API key.
