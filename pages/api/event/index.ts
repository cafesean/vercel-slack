import { sendChallenge } from './events_handlers/challenge'
import { app_mention } from './events_handlers/_app_mention'
import { message } from './events_handlers/message'
import { channel_created } from './events_handlers/_channel_created'
import { validateSlackRequest } from './_validate'
import { signingSecret } from './_constants'

import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        // set query params to number type
        // query: { id, max_tokens, temp },
        body: { token, challenge, type },
        method,
    } = req

    // var type = req.body.type

    if (type === "url_verification") {
        await sendChallenge(req, res)
    }

    else if (validateSlackRequest(req, signingSecret)) {
        switch(type)
        {
            case "event_callback": {
                var event_type = req.body.event.type

                switch (event_type) {
                    case "channel_created": await channel_created(req, res); break;
                    case "message": await message(req, res); break;

                    default: break;
                }
            }
            case "app_mention": await app_mention(req, res); break;
        }
    }
}