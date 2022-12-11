const axios = require('axios');
import { token } from './_constants';

export function tokenizeString(string) {
    const array = string.split(" ").filter(element => {
        return element !== ""
    })
    console.log("Tokenized version:", array)
    return array
}

export async function acknowledge(req, res) {

    const message = {
        text: "...",
        response_type: "ephemeral",
        user: req.body.event.user,
        channel: req.body.event.channel,
        thread_ts: req.body.event.ts
    }

    await axios({
        method: 'post',
        url: 'https://slack.com/api/chat.postEphemeral',
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Authorization': `Bearer ${token}` },
        data: message,
    })
        .then(response => {
            console.log("Acknowledge: ", response.data);
        })
        .catch(err => {
            console.log("axios Error:", err)
        })

}

export async function postToChannel(channelId, thread, res, payload) {

    console.log("channel:", channelId)
    // var channelId = await channelNameToId(channel)

    // console.log("ID:", channelId)

    const message = {
        channel: channelId,
        thread_ts: thread,
        text: payload,
    }

    await axios({
        method: 'post',
        url: 'https://slack.com/api/chat.postMessage',
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Authorization': `Bearer ${token}` },
        data: message,
    })
        .then(response => {
            // response.data;
            return response.data;
        })
        .catch(err => {
            console.log("axios Error:", err)
            return res.status(500).send({
                "response_type": "ephemeral",
                "text": `${err.response.data.error}`
            })
        })

}

// async function channelNameToId(channelName) {
//     var generalId
//     var id
//     await axios({
//         method: 'post',
//         url: 'https://slack.com/api/conversations.list',
//         headers: { 'Content-Type': 'application/json; charset=utf-8', 'Authorization': `Bearer ${token}` },
//     })
//         .then(response => {
//             response.data.channels.forEach(element => {

//                 if (element.name === channelName) {
//                     id = element.id
//                     return element.id
//                 }
//                 else if(element.name === "general") generalId = element.id
//             });

//             return generalId
//         })
//         .catch(err => {
//             console.log("axios Error:", err)
//         })

//         return id
// }
