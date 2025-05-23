import axios from 'axios';
// import { FastifyInstance } from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

export default async function gpt3(prompt) {
console.log("in gpt3");
        // var resultJSON = {};
        
        // const engine = id;
        // const paramTemp = new Number(temp);
        // const paramToken = new Number(max_tokens);

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
        // console.log("apiUrl = ", apiUrl);
        // console.log("tokens = ", tokens);
        // console.log("prompt = ", prompt);
        // console.log("temperature = ", temperature);
        // console.log("options = ", options);
        var completion = "";
        await axios
          .post(apiUrl, data, options)
          .then(response => {
            // resultJSON["completion"] = response.data.choices[0].text 
            completion = response.data.choices[0].text 
            return( completion );
          })
          .catch(error => {
            return(error);
        });
        // return JSON.stringify(resultJSON);
}
