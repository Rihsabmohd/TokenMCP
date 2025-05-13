import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import dotenv from "dotenv";



dotenv.config();
const BIRDEYE_API_KEY = process.env.BIRDEYE_API_KEY;
if (!BIRDEYE_API_KEY) {
  throw new Error("Missing BIRDEYE_API_KEY in environment variables.");
}


// Create server instances
const server = new McpServer({
  name: "tokenMCP",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});




interface TrendingToken {
    address: string;
    name: string;
    symbol: string;
    price_usd: number;
    volume_usd_24h: number;
    market_cap_usd: number;
  }
  
  interface YieldPool {
    chain: string;
    project: string;
    symbol: string;
    apy: number;
    tvlUsd: number;
    url: string;
    pool: string;
  }



    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

    async function getBalance(walletAddress: string): Promise<string | null> {
        try {
          const publicKey = new PublicKey(walletAddress); // This throws if invalid
          const balanceLamports = await connection.getBalance(publicKey);
          const balanceSOL = balanceLamports / 1e9;
          return `Balance of ${walletAddress}: ${balanceSOL} SOL`;
        } catch (error) {
          console.error("Invalid wallet address or network error:", error);
          return null;
        }
      }
      
      
      
      



      server.tool(
        "getBalance",
        "get balance of a wallet",
        {
          walletAddress: z.string().describe("Base58-encoded Solana wallet address"),
        },
        async ({ walletAddress }) => {
          const balance = await getBalance(walletAddress);
      
          if (!balance) {
            return {
              content: [
                {
                  type: "text",
                  text: `Invalid or unsupported wallet address: ${walletAddress}`,
                },
              ],
            };
          }
      
          return {
            content: [
              {
                type: "text",
                text: `Successfully retrieved the balance of wallet adress: ${walletAddress}
                ${walletAddress}:{
                 balance:${balance}`
              },
            ],
          };
        }
      );


      server.tool(
        "GetSolanaTokenInfo",
        "Get Solana token relevant information using the contract address",
        {
          contractAddress: z.string().describe("Token contract address on Solana"),
        },
        async ({ contractAddress }) => {
          try {
            const response = await fetch(`https://api.dexscreener.com/token-pairs/v1/solana/${contractAddress}`);
            if (!response.ok) {
              throw new Error(`Dexscreener API error: ${response.status}`);
            }
      
            const data = await response.json();
      
            if (!Array.isArray(data) || data.length === 0) {
              return {
                content: [
                  {
                    type: "text",
                    text: `No trading pairs found for token address: ${contractAddress}`,
                  },
                ],
              };
            }
      
            // Select the pair with the highest liquidity
            const topPair = data.reduce((prev, current) => {
              const prevLiquidity = prev.liquidity?.usd || 0;
              const currentLiquidity = current.liquidity?.usd || 0;
              return currentLiquidity > prevLiquidity ? current : prev;
            });
      
            const tokenInfo = {
              address: contractAddress,
              name: topPair.baseToken?.name || "Unknown",
              symbol: topPair.baseToken?.symbol || "N/A",
              priceUsd: topPair.priceUsd || "N/A",
              fdv: topPair.fdv || "N/A",
              marketCap: topPair.marketCap || "N/A",
            };
      
            return {
              content: [
                {
                  type: "text",
                  text: [
                    `-Token Info for ${tokenInfo.name} (${tokenInfo.symbol})`,
                    `- Address: ${tokenInfo.address}`,
                    `- Symbol: ${tokenInfo.symbol}`,
                    `- Price (USD): $${Number(tokenInfo.priceUsd).toLocaleString()}`,
                    `- FDV: $${Number(tokenInfo.fdv).toLocaleString()}`,
                    `- Market Cap: $${Number(tokenInfo.marketCap).toLocaleString()}`,
                  ].join("\n"),
                },
              ],
            };
          } catch (error: unknown) {
            console.error("Dexscreener API error:", error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
              content: [
                {
                  type: "text",
                  text: `Failed to retrieve token info for ${contractAddress}: ${errorMessage}`,
                },
              ],
            };
          }
        }
      );
      
      server.tool(
        "getTrendingTokens",
        "Get top 10 Solana tokens by 24h volume using Birdeye",
        {},
        async () => {
          try {
            const response = await fetch("https://public-api.birdeye.so/defi/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=10&min_liquidity=100", {
              headers: {
                "accept": "application/json",
                "x-chain": "solana",
                "X-API-KEY": BIRDEYE_API_KEY,  // API Key for authentication
              },
            });
      
            if (!response.ok) {
              throw new Error(`Birdeye API error: ${response.status}`);
            }
      
            const data = await response.json();
            
            
            const tokens = data?.data?.tokens || [];
      
            if (!Array.isArray(tokens)) {
              throw new Error("Expected an array of tokens, but got something else.");
            }
      
            const top10 = tokens.map((token, index) => {
              return `${index + 1}. ${token.name} (${token.symbol})
            - Address: ${token.address}
            - Price: $${token.price.toFixed(4)}
            - 24h Volume: $${token.v24hUSD.toLocaleString()}
            - Market Cap: $${token.mc.toLocaleString()}
            ---`;
            });
      
            return {
              content: [
                {
                  type: "text",
                  text: `Top 10 Trending Solana Tokens by 24h Volume:\n\n${top10.join("\n")}`,
                },
              ],
            };
          } catch (error: any) {
            console.error("Error fetching trending tokens:", error);
            return {
              content: [
                {
                  type: "text",
                  text: `Failed to fetch trending tokens: ${error.message}`,
                },
              ],
            };
          }
        }
      );
      
      server.tool(
        "getBestYields",
        "Get top yield opportunities on Solana across lending and farming protocols",
        {},
        async () => {
          try {
            const response = await fetch("https://yields.llama.fi/pools");
            const data = await response.json();
      
            const solanaYields: YieldPool[] = (data.data as YieldPool[]).filter(
              (pool: YieldPool) => pool.chain === "Solana"
            );
      
            if (!solanaYields.length) {
              return {
                content: [{ type: "text", text: "No yield opportunities found on Solana at the moment." }],
              };
            }
      
            // Sort by APY descending and get top 10
            const topYields = solanaYields
              .sort((a: YieldPool, b: YieldPool) => b.apy - a.apy)
              .slice(0, 10)
              .map((pool: YieldPool, index: number) => {
                return `${index + 1}. ${pool.project} (${pool.symbol})
      - APY: ${pool.apy.toFixed(2)}%
      - TVL: $${Number(pool.tvlUsd).toLocaleString()}
      - URL: https://defillama.com/yields/pool/${pool.pool}`;
              });
      
            return {
              content: [
                {
                  type: "text",
                  text: `Top 10 Yield Opportunities on Solana:\n\n${topYields.join("\n\n")}`,
                },
              ],
            };
          } catch (error: any) {
            console.error("Error fetching yield data:", error);
            return {
              content: [{ type: "text", text: `Failed to fetch yield data: ${error.message}` }],
            };
          }
        }
      );
      
    
      


        async function main() {
            const transport = new StdioServerTransport();
            await server.connect(transport);
            console.error("TokenMCP Server running on stdio");
          }
          
          main().catch((error) => {
            console.error("Fatal error in main():", error);
            process.exit(1);
          });