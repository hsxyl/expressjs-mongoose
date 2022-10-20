import { keyStores, Near, WalletConnection } from "near-api-js";
import getConfig from "./config";
import { MyNearWallet } from "./mynearwallet";

export const config = getConfig();
export const nearKeyStore = new keyStores.BrowserLocalStorageKeyStore();

export const near = new Near({
	headers: {},
	keyStore: new keyStores.BrowserLocalStorageKeyStore(),
	...config,
});


export const wallet = new MyNearWallet(
	near,
	getConfig().contractId
  );