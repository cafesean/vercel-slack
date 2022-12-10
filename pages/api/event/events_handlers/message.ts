import { postToChannel } from "../_utils"


export async function message(req, res) {
    let event = req.body.event;
    let channel = event.channel;
    let thread = event.ts;
    let text = `Hi there! <@${event.item.user}>!`; 
    
    try {
        await postToChannel(channel, thread, res, text);
    }
    catch (e) {
        console.log(e)
    }
}
