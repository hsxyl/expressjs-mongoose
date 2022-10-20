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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.near_auth = exports.auth_map = void 0;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
require("secrets");
const path_1 = __importDefault(require("path"));
const utils_1 = require("near-api-js/lib/utils");
const oauth_1 = require("./oauth");
const utils_2 = require("./utils");
const lru_cache_1 = __importDefault(require("lru-cache"));
const COOKIE_SECRET = process.env.npm_config_cookie_secret || process.env.COOKIE_SECRET;
const proxy = (0, http_proxy_middleware_1.createProxyMiddleware)("ws://localhost:1234");
exports.auth_map = new lru_cache_1.default({
    max: 100
});
main().catch((err) => console.error(err.message, err));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use((0, cookie_parser_1.default)());
        app.use(body_parser_1.default.urlencoded({ extended: true }));
        app.use(body_parser_1.default.json());
        app.use((0, express_session_1.default)({ secret: COOKIE_SECRET || "secret" }));
        app.listen(3000, () => console.log("listening on http://127.0.0.1:3000"));
        app.use((req, res, next) => {
            if (req.headers.host.indexOf("localhost:3000") !== -1) {
                res.redirect("http://127.0.0.1:3000");
                return;
            }
            next();
        });
        app.get("/api/hello", (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send("hello");
        }));
        app.get("/oauth/authorize", oauth_1.authorize);
        app.get("/oauth/token", oauth_1.oauth_token);
        app.post("/api/auth", near_auth);
        app.get("/", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // We will server the React app build by parcel when accessing the /
            return next();
        }));
        app.use(express_1.default.static(path_1.default.resolve(__dirname, "../assets")));
        if (!process.env.NODE_ENV)
            app.use(proxy);
        app.use(express_1.default.static(path_1.default.resolve(__dirname, "../dist")));
        app.use("/*", (req, res) => {
            res.sendFile(path_1.default.resolve(__dirname, "../dist/index.html"));
        });
    });
}
function near_auth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(req.body);
            let publicKeyRaw = req.body.publicKey;
            (0, utils_2.assert)(publicKeyRaw !== undefined, "Failed to get publicKey in request body!");
            let publickKey = utils_1.PublicKey.from(publicKeyRaw);
            let accountId = req.body.accountId;
            (0, utils_2.assert)(accountId !== undefined, "Failed to get accountId in request body!");
            let state = req.body.state;
            (0, utils_2.assert)(state !== undefined, "Failed to get state in request body!");
            let signature = Uint8Array.from(req.body.signature.split(",").map((e) => Number(e)));
            (0, utils_2.assert)(yield (0, utils_2.isPublickeyBelongAccountId)(req.body.accountId, req.body.publicKey), `No matching public key(${publicKeyRaw}) of accountId(${accountId}).`);
            (0, utils_2.assert)(publickKey.verify(new TextEncoder().encode(accountId + state), signature), "Failed to pass publick verify!");
            exports.auth_map.set(req.body.state, req.body.accountId);
            // let params = getUrlParams(req.url)
            // assert(params.redirect_uri!==undefined, "The url ")
            res.json({
                auth_result: true,
            });
        }
        catch (e) {
            res.json({
                auth_result: false,
                reason: e.toString()
            });
        }
        // res.redirect('/');
    });
}
exports.near_auth = near_auth;
//# sourceMappingURL=index.js.map