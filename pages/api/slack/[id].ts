import { challenge } from './events_handlers/_challenge'
import { app_mention } from './events_handlers/_app_mention'
import { channel_created } from './events_handlers/_channel_created'
import { validateSlackRequest } from './_validate'
import { signingSecret } from './_constants'

import type { NextApiRequest, NextApiResponse } from 'next';


export default async function gptHandler(req: NextApiRequest, res: NextApiResponse) {
//   const {
//     // set query params to number type
//     query: { id, max_tokens, temp },
//     body: { prompt },
//     method,
//   } = req

    var type = req.body.type

    if (type === "url_verification") {
        await challenge(req, res)
    }

    else if (validateSlackRequest(req, signingSecret)) {

        if (type === "event_callback") {
            var event_type = req.body.event.type

            switch (event_type) {
                case "app_mention": await app_mention(req, res); break;
                case "channel_created": await channel_created(req, res); break;
                default: break;
            }

        }
        else {
            console.log("body:", req.body)
        }
    }
}