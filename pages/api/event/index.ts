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

    let channel = app.channel;
    let thread = <string>app.thread_ts;
    let prompt =  req.body.event.text;

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
    res.status(200).send("ok");
    // res.json({ok:true}); 
    
console.log("NOT A BOT");
    
    // var event_type = app.event_type;


    const engine = "text-davinci-003";

    var temperature = new Number(process.env.TEMPERATURE);
    var tokens = new Number(process.env.MAX_TOKENS);

    const apiUrl = 'https://api.openai.com/v1/engines/' + engine + '/completions';
console.log("prompt: ", prompt);
console.log("apiUrl: ", apiUrl);
console.log("event.channel: ", event.channel);
console.log("event.ts: ", event.ts);
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
    
    const timer = new Promise((resolve, reject) => {
        // Set up the timeout
        const timer = setTimeout(() => {
            reject("timed out");
        }, 10000);


        // create promise chain for axios request
        const openai = new Promise((resolve, reject) => {
            // Set up the timeout
            //
            axios
            .post(apiUrl, data, options)
            .then(response => {
                completion = response.data.choices[0].text;
                // console.log("data: ", response.data.choices[0].text);
                resolve("success");
            })
            .catch(error => {
                console.log("in catch error");
                reject("failure");
            });
        })
        .then((result) => {
            result = new Promise((resolve, reject) => {
                try{
                    app.client.chat.postMessage({
                        channel: event.channel,
                        thread_ts: event.ts,
                        text: completion
                    });
                    console.log("Slack message sent.")
                    resolve("success");
                    // res.status(200).end("ok")
                } catch(e) {
                    console.log("catch=",e);
                    reject("failure");
                    // res.status(200).end("error");
                }
            });
            resolve("success");
        })
        .catch((error) => {
            reject("failure");
            console.log("error in catch: ", error);
            // res.status(200).end("error");
        });
    });



    // } catch(e) {
    //     console.log("catch=",e);
    //     res.status(200).end("error");
    // }
}

