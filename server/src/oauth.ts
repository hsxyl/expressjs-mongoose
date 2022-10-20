import { auth_map } from "./index"
import { assert, getUrlParams } from "./utils"

type Authorize = {
    account_id: string,
}

export async function authorize(req: any, res: any) {

	console.log("oauth")
	console.log(req)
	let params = getUrlParams(req.url)

    assert(params.state!==undefined, "No state param in url!")
    const state = params.state

	console.log(params)

	res.send(params.state)
}

export async function oauth_token(req: any, res: any) {
	console.log("oauth_token")
	console.log(req)	

    try {
        let params = getUrlParams(req.url)
        assert(params.code!==undefined, "No code param in url!", )
        let account_id = auth_map.get(params.code)
        res.json({
            account_id
        })
    } catch(e) {
        res.status(400);
        res.send(e.toString())
    }

}

