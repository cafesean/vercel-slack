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

    if (prompt.indexOf("’") != -1) {
            const result = await app.client.chat.postMessage({
            channel: event.channel,
            thread_ts: event.ts,
            text: "Single quotes (\') are not allowed."
        });
        console.log("Single quotes (\') are not allowed.");
        // res.status(200).end();
        return res.status(200).end();
    } 

    if (!validateSlackRequest(req, signingSecret)) {
        console.log("Request invalid");
        // res.status(500).end();
        return res.status(200).end();
    }
    res.status(200).send({ok: true});
    // res.json({ok:true}); 
    
console.log("NOT A BOT");
    
    // var event_type = app.event_type;


    const engine = "text-davinci-003";

    var temperature = new Number(process.env.TEMPERATURE);
    var tokens = new Number(process.env.MAX_TOKENS);

    const apiUrl = 'https://api.openai.com/v1/engines/' + engine + '/completions';

console.log("apiUrl: ", apiUrl);
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

console.log("before axios");
    try {
console.log("in try");
console.log("apiUrl:", apiUrl);
console.log("data:", data);
console.log("options:", options);
        await axios
            .post(apiUrl, data, options)
            .then(response => {
            // resultJSON["completion"] = response.data.choices[0].text 

                completion = response.data.choices[0].text;
console.log("completion:", completion);
console.log("event.channel:", event.channel);
console.log("event.ts:", event.ts);

                console.log("data: ", response.data);
            })
            .catch(error => {
                console.log("in catch error");
                res.status(200).end({ok: false});
        });

        const result = await app.client.chat.postMessage({
            channel: event.channel,
            thread_ts: event.ts,
            text: completion
        });
        console.log("done posting to channel");
        // console.log("result:", result);
        res.status(200).end({ok: true});
        // postToChannel(channel, thread, res, completion);
        // res.status(200).send("ok");
    } catch(e) {
        console.log("catch=",e);
    }  
    console.log("Completion: ", completion);
    res.status(200).end({ok: true});
}

