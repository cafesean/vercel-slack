import { postToChannel } from "../_utils"


export async function message(req, res) {
    let user = req.body.user

    try {
        await postToChannel("ai", res, `Hi there! Thanks for mentioning me, <@${user}>!`)
    }
    catch (e) {
        console.log(e)
    }
}
