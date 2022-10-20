import { InMemorySigner, utils } from "near-api-js";
import { useEffect, useState } from "react";
import { config, nearKeyStore, wallet } from "../near/global";
import axios from 'axios';
import getConfig from "../near/config";

const PENDING_ACCESS_KEY_PREFIX = 'pending_key';

completeSignInWithAccessKey()

export default function Auth() {

	let [accounts, setAccounts] = useState<string[]>([]);

	console.log("env", process.env.NEAR_ENV)
	console.log(config.networkId)

	useEffect(() => {
		nearKeyStore.getAccounts(config.networkId).then(s => {
			console.log(s)
			setAccounts(s)
		})
	}, [])


	return (<div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
		<div style={{ border: "solid 1px", width: "30%", height: "30%" }}>
			<div style={{ overflow: "scroll", width: "90%", height: "80%" }}>
				{
					accounts.map(e =>
						<div onClick={() => { auth(e); }} key={e} style={{ border: "solid 1px", borderLeft: "none", borderRight: "none", margin: "5px" }}>
							{e}
						</div>)
				}
			</div>

			<button onClick={e => importAccount()}>
				import
			</button>

		</div>

	</div>)
}

async function auth(accountId: string) {


	try {

		console.log({ "accountId": accountId })

		let params = getUrlParams(window.location.href)
		assert(params.state !== undefined, "Failed to get state from url");

		console.log("state", params.state)

		assert(params.redirect_uri!== undefined, "Failed to get redirect_uri from url");
		console.log("state", params.redirect_uri)

		const keyPair = await nearKeyStore.getKey(config.networkId, accountId);
		console.log("keyPair", keyPair)

		const signature = keyPair.sign(new TextEncoder().encode(accountId+params.state))

		const signature_string = signature.signature.join(",")

		console.log("signature", signature.signature)
		// console.log("signature, join", signature.signature.join(","))

		// axios.post(`${config.authUrl}/api/auth`, {
		// 	accountId,
		// 	signature: signature_string,
		// 	msg: accountId,
		// 	publicKey: signature.publicKey.toString()
		// }).then(res => {
		// 	console.log("res.data", res.data);
		// 	if (!res.data.auth_result) {
		// 		throw res.data.reason
		// 	}
		// }).catch((err)=>{})

		let res = await axios.post(`${config.authUrl}/api/auth`, {
			accountId,
			signature: signature_string,
			msg: accountId,
			state: params.state,
			publicKey: signature.publicKey.toString()
		});
		console.log("res.data", res.data);
		if (!res.data.auth_result) {
			throw res.data.reason
		}

		window.location.href = `${params.redirect_uri}?code=${params.state}&state=${params.state}`

		
	} catch (err) {
		console.log("err", err)
		alert(err)
	}

	// signer.signMessage()
}

async function importAccount() {
	const currentUrl = new URL(window.location.href);
	const newUrl = new URL(config.walletUrl + '/login/');
	newUrl.searchParams.set('success_url', currentUrl.href);
	newUrl.searchParams.set('failure_url', currentUrl.href);

	newUrl.searchParams.set('contract_id', config.contractId);
	const accessKey = utils.KeyPair.fromRandom('ed25519');
	newUrl.searchParams.set('public_key', accessKey.getPublicKey().toString());
	await nearKeyStore.setKey(config.networkId, PENDING_ACCESS_KEY_PREFIX + accessKey.getPublicKey(), accessKey);

	window.location.assign(newUrl.toString());
}

// async function completeSignInWithAccessKey() {
// 	const currentUrl = new URL(window.location.href);
// 	const publicKey = currentUrl.searchParams.get('public_key') || '';
// 	const allKeys = (currentUrl.searchParams.get('all_keys') || '').split(',');
// 	const accountId = currentUrl.searchParams.get('account_id') || '';
// }

export async function completeSignInWithAccessKey() {
	const currentUrl = new URL(window.location.href);
	const publicKey = currentUrl.searchParams.get('public_key') || '';
	const allKeys = (currentUrl.searchParams.get('all_keys') || '').split(',');
	const accountId = currentUrl.searchParams.get('account_id') || '';

	// TODO: Handle errors during login
	if (accountId) {
		let authData = {
			accountId,
			allKeys
		};
		if (publicKey) {
			await moveKeyFromTempToPermanent(accountId, publicKey);
		}
	}
	currentUrl.searchParams.delete('public_key');
	currentUrl.searchParams.delete('all_keys');
	currentUrl.searchParams.delete('account_id');
	currentUrl.searchParams.delete('meta');
	currentUrl.searchParams.delete('transactionHashes');
	window.history.replaceState({}, document.title, currentUrl.toString());
}

export async function moveKeyFromTempToPermanent(accountId: string, publicKey: string): Promise<void> {
	const keyPair = await nearKeyStore.getKey(config.networkId, PENDING_ACCESS_KEY_PREFIX + publicKey);
	await nearKeyStore.setKey(config.networkId, accountId, keyPair);
	console.log("hi")
	console.log(config.networkId, accountId, keyPair);

	await nearKeyStore.setKey(config.networkId, accountId, keyPair);
	await nearKeyStore.removeKey(config.networkId, PENDING_ACCESS_KEY_PREFIX + publicKey);
}

export function getUrlParams(url: string) {
	let urlStr = url.split('?')[1]
	let obj: any = {};
	let paramsArr = urlStr.split('&')
	for (let i = 0, len = paramsArr.length; i < len; i++) {
		let arr = paramsArr[i].split('=')
		obj[arr[0]] = arr[1];
	}
	return obj
}

export function assert(condition: boolean, msg: string) {
	if (!condition) {
		console.log(msg)
		throw msg
	}
}