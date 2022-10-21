export default function getConfig(env: string = "testnet") {
	switch (env) {
	  case "production":
	  case "mainnet":
		return {
		  networkId: "mainnet",
		  nodeUrl: "https://rpc.mainnet.near.org",
		  walletUrl: "https://wallet.near.org",
		  helperUrl: "https://helper.mainnet.near.org",
		  explorerUrl: "https://explorer.mainnet.near.org",
		  indexerUrl: "https://indexer.ref-finance.net",
		  contractId: "a.testnet",
		  authUrl: "http://127.0.0.1:3000"		  
		};
	  case "development":
	  case "testnet":
		return {
		  networkId: "testnet",
		  // nodeUrl: "https://rpc.testnet.near.org",
		  nodeUrl: "https://public-rpc.blockpi.io/http/near-testnet",
		  walletUrl: "https://wallet.testnet.near.org",
		  helperUrl: "https://helper.testnet.near.org",
		  explorerUrl: "https://explorer.testnet.near.org",
		  contractId: "a.testnet",
		  authUrl: "http://127.0.0.1:3000"
		};
	  default:
		return {
			networkId: "testnet",
			// nodeUrl: "https://rpc.testnet.near.org",
			nodeUrl: "https://public-rpc.blockpi.io/http/near-testnet",
			walletUrl: "https://wallet.testnet.near.org",
			helperUrl: "https://helper.testnet.near.org",
			explorerUrl: "https://explorer.testnet.near.org",
			indexerUrl: "https://testnet-indexer.ref-finance.com",
			contractId: "a.testnet",
			authUrl: "http://127.0.0.1:3000"
		};
	}
  }