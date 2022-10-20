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
exports.oauth_token = exports.authorize = void 0;
const index_1 = require("./index");
const utils_1 = require("./utils");
function authorize(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("oauth");
        console.log(req);
        let params = (0, utils_1.getUrlParams)(req.url);
        (0, utils_1.assert)(params.state !== undefined, "No state param in url!");
        const state = params.state;
        console.log(params);
        res.send(params.state);
    });
}
exports.authorize = authorize;
function oauth_token(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("oauth_token");
        console.log(req);
        try {
            let params = (0, utils_1.getUrlParams)(req.url);
            (0, utils_1.assert)(params.code !== undefined, "No code param in url!");
            let account_id = index_1.auth_map.get(params.code);
            res.json({
                account_id
            });
        }
        catch (e) {
            res.status(400);
            res.send(e.toString());
        }
    });
}
exports.oauth_token = oauth_token;
//# sourceMappingURL=oauth.js.map