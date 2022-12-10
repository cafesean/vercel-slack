import { postToChannel } from "../_utils"


export async function message(req, res) {
    let event = req.body.event

    try {
        await postToChannel(event.item.user, res, `Hi there! Thanks for mentioning me, <@${event.item.user}>!`)
    }
    catch (e) {
        console.log(e)
    }
}
