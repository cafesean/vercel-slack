import type { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';
// import { FastifyInstance } from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

export default async function gptHandler(req: NextApiRequest, res: NextApiResponse) {
  const {
    // set query params to number type
    query: { id, max_tokens, temp },
    body: { prompt },
    method,
  } = req

  switch (method) {
    case 'GET':
      // Get data from your database
      res.status(200).json({ id: `${id}`, max_tokens: `${max_tokens}`, temperature: `${temp}` })
      break
    
    
    case 'POST':
        var resultJSON = {};
        
        const engine = id;
        const paramTemp = new Number(temp);
        const paramToken = new Number(max_tokens);

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

        // var completion = "";
        await axios
          .post(apiUrl, data, options)
          .then(response => {
            resultJSON["completion"] = response.data.choices[0].text 

            res.status(200).json( resultJSON );
          })
          .catch(error => {
            res.status(400).json(error);
        });
        // return JSON.stringify(resultJSON);

      // Update or create data in your database
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
