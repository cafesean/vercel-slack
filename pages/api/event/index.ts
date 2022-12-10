import { sendChallenge } from './events_handlers/challenge'
// import { app_mention } from './events_handlers/_app_mention'
import { validateSlackRequest } from './_validate'
import { signingSecret } from './_constants'

import type { NextApiRequest, NextApiResponse } from 'next';
import { message } from './events_handlers/message'


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
        var event_type = req.body.event.type

        switch (event_type) {
            // case "app_mention": await app_mention(req, res); break;
            // case "channel_created": await channel_created(req, res); break;
            case "message": await message(req ,res); break;
        
            default: break;
        }

    }
        // else {
        //     console.log("body:", req.body)
        // }
}