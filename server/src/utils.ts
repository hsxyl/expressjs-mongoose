import { Near } from "near-api-js";
import { InMemoryKeyStore } from "near-api-js/lib/key_stores";
import { config } from "./config";


const near = new Near({
	headers: {},
	keyStore: new InMemoryKeyStore(),
	...config

})

export async function isPublickeyBelongAccountId(accountId: string, publicKey: string): Promise<boolean> {
	let account = await near.account(accountId)
	let keys = await account.getAccessKeys()
	console.log(`accountId(${accountId}) keys:`, keys)
	return keys.reduce((a,b)=> {return (a||b.public_key===publicKey)}, false)
}

export function getUrlParams(url: string) {
	try {
		let urlStr = url.split('?')[1]
		let obj: any = {};
		let paramsArr = urlStr.split('&')
		for(let i = 0,len = paramsArr.length;i < len;i++){
			let arr = paramsArr[i].split('=')
			obj[arr[0]] = arr[1];
		}
		return obj
	} catch (e) {
		throw e.toString
	}
   
}

export function assert(condition: boolean, msg: string) {
	if(!condition) {
		console.log(msg)
		throw msg
	}
}