import { sendChallenge } from './events_handlers/challenge'
// import { app_mention } from './events_handlers/_app_mention'
import { validateSlackRequest } from './_validate'
import { signingSecret } from './_constants'
import type { NextApiRequest, NextApiResponse } from 'next';
// import { message } from './events_handlers/_message'
import { postToChannel } from "./_utils"
import { gpt3 } from "../gpt/[id]"
import { equal } from 'assert';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        // set query params to number type
        // query: { id, max_tokens, temp },
        body: { token, challenge, type, event },
        method,
    } = req

    // var type = req.body.type

    if (type === "url_verification") {
        await sendChallenge(req, res)
    }

    else if (validateSlackRequest(req, signingSecret)) {

        // if (type === "event_callback") {
        if (event_type === "message") { //must be direct
            var event_type = req.body.event.type


            // let event = req.body.event;
            let channel = req.body.event.channel;
            let thread = req.body.event.ts;
            let prompt = req.body.event.text;
            // let text = `In message! <@${event.user}>!`; 
            


            try {
                let completion = await gpt3(prompt);

                await postToChannel(channel, thread, res, "Asking GPT-3 for completion of: "+prompt);
                await postToChannel(channel, thread, res, completion);
            }
            catch (e) {
                console.log(e);
            }
        }
        res.end;




        // switch (event_type) {
        //     // case "app_mention": await app_mention(req, res); break;
        //     // case "channel_created": await channel_created(req, res); break;
        //     case "message": await message(req, res); break;
        
        //     default: break;
        // }

    }
        // else {
        //     console.log("body:", req.body)
        // }
}