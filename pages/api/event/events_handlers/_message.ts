import { postToChannel } from "../_utils"


export async function message(req, res) {
    let event = req.body.event;
    let channel = event.channel;
    let thread = event.ts;
    let text = `In message! <@${event.user}>!`; 
    
    try {
        await postToChannel(channel, thread, res, "In Message. Sending to event.channel "+channel + " event.ts "+thread);
    }
    catch (e) {
        console.log(e);
    }

    try {
        await postToChannel(event.item.channel, event.item.ts, res, "In Message. Sending to event.item.channel "+event.item.channel + " event.item.ts "+event.item.ts);
    }
    catch (e) {
        console.log(e);
    }
}
