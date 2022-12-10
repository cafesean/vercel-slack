import { postToChannel } from "../_utils"


export async function message(req, res) {
    let user = req.body.event.user

    try {
        await postToChannel(user, res, `Hi there! Thanks for mentioning me, <@${user}>!`)
    }
    catch (e) {
        console.log(e)
    }
}
