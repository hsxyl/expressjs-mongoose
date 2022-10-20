import { Near, WalletConnection } from "near-api-js";
import { config, nearKeyStore } from "./global";


const PENDING_ACCESS_KEY_PREFIX = 'pending_key';

export class MyNearWallet extends WalletConnection {

	constructor(near: Near, appKeyPrefix: string | null) {
		super(near, appKeyPrefix)
	}

	async _completeSignInWithAccessKey() {
        const currentUrl = new URL(window.location.href);
        const publicKey = currentUrl.searchParams.get('public_key') || '';
        const allKeys = (currentUrl.searchParams.get('all_keys') || '').split(',');
        const accountId = currentUrl.searchParams.get('account_id') || '';
        // TODO: Handle errors during login
        if (accountId) {
            this._authData = {
                accountId,
                allKeys
            };
            window.localStorage.setItem(this._authDataKey, JSON.stringify(this._authData));
            if (publicKey) {
                await this._moveKeyFromTempToPermanent(accountId, publicKey);
            }
        }
        currentUrl.searchParams.delete('public_key');
        currentUrl.searchParams.delete('all_keys');
        currentUrl.searchParams.delete('account_id');
        currentUrl.searchParams.delete('meta');
        currentUrl.searchParams.delete('transactionHashes');
        window.history.replaceState({}, document.title, currentUrl.toString());
    }

	async _moveKeyFromTempToPermanent(accountId: string, publicKey: string): Promise<void> {
        const keyPair = await this._keyStore.getKey(this._networkId, PENDING_ACCESS_KEY_PREFIX + publicKey);
        await this._keyStore.setKey(this._networkId, accountId, keyPair);
		console.log("hi")
		console.log(this._networkId, accountId, keyPair);
		
		await nearKeyStore.setKey(this._networkId,accountId,keyPair);
        await this._keyStore.removeKey(this._networkId, PENDING_ACCESS_KEY_PREFIX + publicKey);
    }
}