import { postToChannel } from "../_utils"


export async function app_mention(req, res) {
    let event = req.body.event

    try {
        await postToChannel("ai", res, `Hi there! Thanks for mentioning me, <@${event.item.user}>!`)
    }
    catch (e) {
        console.log(e)
    }
}
