import { keyStores, Near, WalletConnection } from "near-api-js";
import { completeSignInWithAccessKey } from "../pages/auth";
import getConfig from "./config";

export const config = getConfig();
export const nearKeyStore = new keyStores.BrowserLocalStorageKeyStore();

export const near = new Near({
	headers: {},
	keyStore: new keyStores.BrowserLocalStorageKeyStore(),
	...config,
});


// export const wallet = new WalletConnection(
// 	near,
// 	getConfig().contractId
//   );
