import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { createProxyMiddleware } from "http-proxy-middleware";
import "secrets";
import path from "path";
import { PublicKey } from "near-api-js/lib/utils";
import { authorize, oauth_token } from "./oauth";
import { assert, getUrlParams, isPublickeyBelongAccountId } from "./utils";
import LRUCache from "lru-cache";

const COOKIE_SECRET =
  process.env.npm_config_cookie_secret || process.env.COOKIE_SECRET;

const proxy = createProxyMiddleware("ws://localhost:1234");
export const auth_map = new LRUCache({
  max: 100
});

main().catch((err) => console.error(err.message, err));

async function main() {
  const app = express();
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(session({ secret: COOKIE_SECRET || "secret" }));

  app.listen(3000, () => console.log("listening on http://127.0.0.1:3000"));

  app.use((req, res, next) => {
    if (req.headers.host.indexOf("localhost:3000") !== -1) {
      res.redirect("http://127.0.0.1:3000");
      return;
    }
    next();
  });

  app.get("/api/hello", async (req, res) => {
    res.send("hello");
  });

  app.get("/oauth/authorize", authorize)
  app.get("/oauth/token", oauth_token)

  app.post("/api/auth", near_auth);

  app.get("/", async (req, res, next) => {
    // We will server the React app build by parcel when accessing the /
    return next();
  });

  app.use(express.static(path.resolve(__dirname, "../assets")));

  if (!process.env.NODE_ENV) app.use(proxy);
  app.use(express.static(path.resolve(__dirname, "../dist")));
  app.use("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../dist/index.html"));
  });
}

export async function near_auth(req: any, res: any) {

  try {

    console.log(req.body)

    let publicKeyRaw = req.body.publicKey
    assert(publicKeyRaw!==undefined, "Failed to get publicKey in request body!")
    let publickKey = PublicKey.from(publicKeyRaw)

    let accountId = req.body.accountId
    assert(accountId!==undefined, "Failed to get accountId in request body!")

    let state = req.body.state
    assert(state!==undefined, "Failed to get state in request body!")

    let signature = Uint8Array.from(req.body.signature.split(",").map((e: string) => Number(e)))

    assert(await isPublickeyBelongAccountId(req.body.accountId, req.body.publicKey), `No matching public key(${publicKeyRaw}) of accountId(${accountId}).`)

    assert(publickKey.verify(new TextEncoder().encode(accountId + state), signature), "Failed to pass publick verify!")

    auth_map.set(req.body.state, req.body.accountId)

    // let params = getUrlParams(req.url)
    // assert(params.redirect_uri!==undefined, "The url ")

    res.json({
      auth_result: true,
    })
  } catch (e) {
    res.json({
      auth_result: false,
      reason: e.toString()
    })
  }
  // res.redirect('/');

}


