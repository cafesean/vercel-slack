import type { NextApiRequest, NextApiResponse } from 'next';
import { signingSecret } from './_constants'
import { sendChallenge } from './events_handlers/challenge'
import { validateSlackRequest } from './_validate'
import { acknowledge, postToChannel } from "./_utils"
import axios from 'axios';
import dotenv from 'dotenv';
import gpt3 from '../gpt/[id]';

dotenv.config();
// export const config = {
//     api: {
//       externalResolver: true,
//     },
// }

  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        // set query params to number type
        // query: { id, max_tokens, temp },
        body: { token, challenge, type, event },
        method,
    } = req



// console.log("New event: ", req.body);
// console.log("req.body.event.bot_id = ", req.body.event.bot_id);
    // var type = req.body.type
    if (type === "url_verification") {
        await sendChallenge(req, res)
    } else if (req.body.event.bot_id == null) {

console.log("NOT A BOT");

        if (validateSlackRequest(req, signingSecret)) {
            var event_type = req.body.event.type
// console.log("\n*******************\nEvent_type= ",event_type);

                //ack within 3 seconds to avoid retries from Slack
                await acknowledge(req, res);
            if (event_type === "message") { //must be direct
                let channel = req.body.event.channel;
                let thread = req.body.event.ts;
                let prompt =  req.body.event.text;
        
// console.log("prompt= ",prompt);
// console.log("channel= ",channel);

                // let completion = await gpt3(prompt);
                const engine = "text-davinci-003";
                const paramTemp = 0.7;
                const paramToken = 300;
        
                var temperature = new Number(process.env.TEMPERATURE);
                var tokens = new Number(process.env.MAX_TOKENS);
                
                if (paramTemp < 1) {
                    temperature = paramTemp;
                }
                if (paramToken < 1000) {
                    tokens = paramToken;
                }
    
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
                    postToChannel(channel, thread, res, completion);
                    res.status(200).send("ok");
                } catch {
                    res.status(500).send("error");
                }

                res.end();
// console.log("after axios");
    
            } else {

                res.status(200).send("ok");
                
            }
        } else {

            console.log("Request no valid or is Bot message");
            res.status(200).send("ok");
        }   
    }
    console.log("IS A BOT\n***************************\n");
    res.status(200).end()
}
