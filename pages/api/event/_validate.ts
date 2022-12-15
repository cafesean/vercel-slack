
// This code snippet is based on https://github.com/antonputra/tutorials/tree/main/lessons/076
import crypto from "crypto";
// const crypto = require("crypto");

export function validateSlackRequest (req:any, signingSecret:any) {

    const requestBody = JSON.stringify(req["body"])

    const headers = req.headers

    const timestamp = headers["x-slack-request-timestamp"]
    const slackSignature = headers["x-slack-signature"]
    const baseString = 'v0:' + timestamp + ':' + requestBody
    const hmac = crypto.createHmac("sha256", signingSecret)
        .update(baseString)
        .digest("hex")
    const computedSlackSignature = "v0=" + hmac

    const isValid = computedSlackSignature === slackSignature

    return isValid;
};
