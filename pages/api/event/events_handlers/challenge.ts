export async function sendChallenge(req:any, res:any) {

    console.log("req body challenge is:", req.body.challenge)

    res.status(200).send(req.body.challenge)
}