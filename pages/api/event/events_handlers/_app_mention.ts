import { postToChannel } from "../_utils"


export async function app_mention(req:any, res:any) {
    let event = req.body.event;
    let channel = event.channel;
    let thread = event.ts;
    let text = `Hi there! Thanks for mentioning me, <@${event.item.user}>!`; 
    
    try {
        await postToChannel(channel, thread, res, "Sending to event.channel "+channel + " event.ts "+thread);
    }
    catch (e) {
        console.log(e);
    }

    try {
        await postToChannel(event.item.channel, event.item.ts, res, "Sending to event.item.channel "+event.item.channel + " event.item.ts "+event.item.ts);
    }
    catch (e) {
        console.log(e);
    }




}
