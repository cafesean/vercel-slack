import { postToChannel } from "../_utils"


export async function app_mention(req:any, res:any) {
    let event = req.body.event;
    let channel = event.channel;
    let thread = event.ts;
    let text = `Hi there! Thanks for mentioning me, <@${event.item.user}>!`; 
    
    try {
        await postToChannel(channel, thread, res, text);
    }
    catch (e) {
        console.log(e);
    }
}
