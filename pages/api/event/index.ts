import type { NextApiRequest, NextApiResponse } from 'next';
import { signingSecret } from './_constants'
import { sendChallenge } from './events_handlers/challenge'
import { validateSlackRequest } from './_validate'
import { acknowledge, postToChannel } from "./_utils"

const { App } = require('@slack/bolt');
import axios from 'axios';
import dotenv from 'dotenv';
import gpt3 from '../gpt/[id]';

dotenv.config();
// export const config = {
//     api: {
//       externalResolver: true,
//     },
// }
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    socketMode: false,
    appToken: process.env.SLACK_APP_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        // set query params to number type
        // query: { id, max_tokens, temp },
        body: { token, challenge, type, event },
        method,
    } = req;
    res.json({ok:true}); 
    
    console.log("app.event('message', async ({ event, say }) => {");
    console.log("event:", event);
    console.log("event.type:", event.type);
    console.log("event.channel:", event.channel);
    console.log("event.ts:", event.ts);

    let channel = app.channel;
    let thread = app.thread_ts;
    let prompt =  req.body.event.text;

// console.log("app.bot_id=null:", app.bot_id==null);
// console.log("app.event_type:", app.event_type);
// console.log("app.event:", JSON.stringify(app.event));
    // var type = req.body.type
    if (type === "url_verification") {
        await sendChallenge(req, res)
        return;
    } else if (app.bot_id!=null || event.type != "message") {
        console.log("IS A BOT or NOT A MESSAGE\n***************************\n");
        // res.status(200).end();
        return;
    }

    if (req.body.event.text.indexOf("’") != -1) {
            const result = await app.client.chat.postMessage({
            channel: event.channel,
            thread_ts: event.ts,
            text: "Single quotes (\') are not allowed."
        });
        
        // res.status(200).end();
        return;
    } 

    if (!validateSlackRequest(req, signingSecret)) {
        console.log("Request invalid");
        // res.status(500).end();
        return;
    }

console.log("NOT A BOT");

    var event_type = app.event_type;


    const engine = "text-davinci-003";

    var temperature = new Number(process.env.TEMPERATURE);
    var tokens = new Number(process.env.MAX_TOKENS);

    const apiUrl = 'https://api.openai.com/v1/engines/' + engine + '/completions';

    const data = {
        prompt: prompt,
        max_tokens: tokens,
        temperature: temperature,
    };
    const options = {
        headers: {
        "Content-Type": `application/json`,
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
        }
    };

    var completion = "";

    try {
        await axios
            .post(apiUrl, data, options)
            .then(response => {
            // resultJSON["completion"] = response.data.choices[0].text 

                completion = response.data.choices[0].text;
            })
            .catch(error => {
            return(error);
        });
        const result = await app.client.chat.postMessage({
            channel: event.channel,
            thread_ts: event.ts,
            text: completion
        });

        // postToChannel(channel, thread, res, completion);
        // res.status(200).send("ok");
    } catch {
        // res.status(500).send("error");
    }  
    // res.end;
}

