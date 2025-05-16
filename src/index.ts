import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { Connection, PublicKey, clusterApiUrl, ParsedAccountData } from "@solana/web3.js";
import dotenv from "dotenv";



dotenv.config();

const BIRDEYE_API_KEY = process.env.BIRDEYE_API_KEY;
const HELIUS_RPC_URL = process.env.HELIUS_RPC_URL;

if (!BIRDEYE_API_KEY || !HELIUS_RPC_URL) {
  const missingKeys = [
    !BIRDEYE_API_KEY && "BIRDEYE_API_KEY",
    !HELIUS_RPC_URL && "HELIUS_RPC_URL",
  ].filter(Boolean);

  throw new Error(`Missing required environment variable(s): ${missingKeys.join(", ")}`);
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



  interface YieldPool {
    chain: string;
    project: string;
    symbol: string;
    apy: number;
    tvlUsd: number;
    url: string;
    pool: string;
  }



    const connection = new Connection(HELIUS_RPC_URL, 'confirmed');

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
        "getTopTokenHolders",
        "Get top N holders of a Solana token by contract address, along with their percentage ownership",
        {
          tokenAddress: z
            .string()
            .describe("The token contract address (mint address) on Solana."),
          count: z
            .number()
            .int()
            .min(1)
            .max(50)
            .optional()
            .describe("Number of top holders to return. Defaults to 5."),
        },
        async ({ tokenAddress, count }) => {
          try {
            const mint = new PublicKey(tokenAddress);
            const largestAccounts = await connection.getTokenLargestAccounts(mint);
            const tokenSupplyInfo = await connection.getParsedAccountInfo(mint);
            const topCount = count ?? 5;
      
            // Get total supply
            let totalSupply = 0;
            if (
              tokenSupplyInfo.value &&
              "data" in tokenSupplyInfo.value &&
              (tokenSupplyInfo.value.data as ParsedAccountData).parsed
            ) {
              const parsedData = (tokenSupplyInfo.value.data as ParsedAccountData).parsed;
              totalSupply = Number(parsedData.info.supply);
            }
      
            // Format holders
            const topHolders = largestAccounts.value.slice(0, topCount).map((account, i) => {
              const balance = Number(account.amount);
              const percent = totalSupply > 0 ? ((balance / totalSupply) * 100).toFixed(2) : "0.00";
              return `${i + 1}. ${account.address}
        - Amount: ${balance}
        - Ownership: ${percent}%`;
            });
      
            return {
              content: [
                {
                  type: "text",
                  text: `Top ${topCount} Holders for Token ${tokenAddress}:\n\n${topHolders.join("\n\n")}`,
                },
              ],
            };
          } catch (error: any) {
            console.error("Error fetching top token holders:", error);
            return {
              content: [
                {
                  type: "text",
                  text: `Failed to fetch token holders: ${error.message}`,
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
      
      server.tool(
        "getCurrentFearGreedIndex",
        "Get the current Crypto Fear & Greed Index, including value and classification.",
        {},
        async () => {
          const API_URL = "https://api.alternative.me/fng/?limit=1";
      
          try {
            const res = await fetch(API_URL);
      
            if (!res.ok) {
              return {
                content: [
                  {
                    type: "text",
                    text: `Error fetching current FNG: HTTP ${res.status} - ${res.statusText}`,
                  },
                ],
              };
            }
      
            const json = await res.json();
            const data = json.data?.[0];
      
            if (!data || !data.timestamp || !data.value || !data.value_classification) {
              return {
                content: [
                  {
                    type: "text",
                    text: "Error: Unexpected response format from FNG API.",
                  },
                ],
              };
            }
      
            const timestamp = new Date(parseInt(data.timestamp) * 1000); // Convert seconds to ms
      
            return {
              content: [
                {
                  type: "text",
                  text:
                    `Crypto Fear & Greed Index (as of ${timestamp.toUTCString()}):\n` +
                    `Value: ${data.value}\n` +
                    `Classification: ${data.value_classification}`,
                },
              ],
            };
          } catch (error: any) {
            return {
              content: [
                {
                  type: "text",
                  text: `Unexpected error: ${error.message}`,
                },
              ],
            };
          }
        }
      );

      server.tool(
        "analyzeFngTrend",
        "Analyze Crypto Fear & Greed Index trend over a number of days.",
        {
          days: z
            .number()
            .int()
            .min(1)
            .describe("Number of days to analyze (must be a positive integer)."),
        },
        async ({ days }) => {
          const API_URL = `https://api.alternative.me/fng/?limit=${days}`;
      
          try {
            const res = await fetch(API_URL);
      
            if (!res.ok) {
              return {
                content: [
                  {
                    type: "text",
                    text: `Error fetching data for analysis: HTTP ${res.status} - ${res.statusText}`,
                  },
                ],
              };
            }
      
            const json = await res.json();
            const data: any[] = json.data;
      
            if (!data || data.length === 0) {
              return {
                content: [
                  {
                    type: "text",
                    text: "Error: No data available for analysis.",
                  },
                ],
              };
            }
      
            const values = data.map((entry) => parseInt(entry.value));
            const totalEntries = values.length;
      
            const sum = values.reduce((acc, val) => acc + val, 0);
            const avg = sum / totalEntries;
      
            const latestValue = values[0];
            const oldestValue = values[totalEntries - 1];
      
            let trend = "stable";
            if (latestValue > oldestValue) trend = "rising";
            else if (latestValue < oldestValue) trend = "falling";
      
            const latest = data[0];
            const latestTimestamp = new Date(parseInt(latest.timestamp) * 1000);
      
            const result = [
              `Fear & Greed Index Analysis (${days} days):`,
              `Latest Value: ${latest.value} (${latest.value_classification}) at ${latestTimestamp.toUTCString()}`,
              `Average Value: ${avg.toFixed(1)}`,
              `Trend: ${trend}`,
              `Data points analyzed: ${totalEntries}`,
            ];
      
            return {
              content: [
                {
                  type: "text",
                  text: result.join("\n"),
                },
              ],
            };
          } catch (error: any) {
            return {
              content: [
                {
                  type: "text",
                  text: `Unexpected error during analysis: ${error.message}`,
                },
              ],
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