export const config = getConfig()

export function getConfig(env: string = process.env.NEAR_ENV) {
	switch (env) {
	  case "mainnet":
		return {
		  networkId: "mainnet",
		  nodeUrl: "https://rpc.mainnet.near.org",
		  walletUrl: "https://wallet.near.org",
		  helperUrl: "https://helper.mainnet.near.org",
		  explorerUrl: "https://explorer.mainnet.near.org",
		};
	  case "testnet":
		return {
		  networkId: "testnet",
		  nodeUrl: "https://public-rpc.blockpi.io/http/near-testnet",
  		  walletUrl: "https://wallet.testnet.near.org",
		  helperUrl: "https://helper.testnet.near.org",
		  explorerUrl: "https://explorer.testnet.near.org",
		};
	  default:
		return {
			networkId: "testnet",
			nodeUrl: "https://public-rpc.blockpi.io/http/near-testnet",
			walletUrl: "https://wallet.testnet.near.org",
			helperUrl: "https://helper.testnet.near.org",
			explorerUrl: "https://explorer.testnet.near.org",
		 
		};
	}
  }
  
  export function getNodeConfig(env: string = process.env.NODE_ENV) {
	switch (env) {
	  case "base":
		return {
		  origin: "http://127.0.0.1:3000",
		};
	  case "testnet":
		return {
		  origin: "https://testnet.superise.xyz",
		};
	  case "mainnet":
		return {
		  origin: "http://superise.xyz",
		};
	}
  }
  