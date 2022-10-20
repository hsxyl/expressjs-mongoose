"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assert = exports.getUrlParams = exports.isPublickeyBelongAccountId = void 0;
const near_api_js_1 = require("near-api-js");
const key_stores_1 = require("near-api-js/lib/key_stores");
const config_1 = require("./config");
const near = new near_api_js_1.Near(Object.assign({ headers: {}, keyStore: new key_stores_1.InMemoryKeyStore() }, config_1.config));
function isPublickeyBelongAccountId(accountId, publicKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let account = yield near.account(accountId);
        let keys = yield account.getAccessKeys();
        return keys.reduce((a, b) => { return (a || b.public_key === publicKey); }, false);
    });
}
exports.isPublickeyBelongAccountId = isPublickeyBelongAccountId;
function getUrlParams(url) {
    let urlStr = url.split('?')[1];
    let obj = {};
    let paramsArr = urlStr.split('&');
    for (let i = 0, len = paramsArr.length; i < len; i++) {
        let arr = paramsArr[i].split('=');
        obj[arr[0]] = arr[1];
    }
    return obj;
}
exports.getUrlParams = getUrlParams;
function assert(condition, msg) {
    if (!condition) {
        console.log(msg);
        throw msg;
    }
}
exports.assert = assert;
//# sourceMappingURL=utils.js.map