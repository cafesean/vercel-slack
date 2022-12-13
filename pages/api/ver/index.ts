import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handle(req: NextApiRequest, res: NextApiResponse) {

      // Get data from your database
      res.status(200).send("v1.0.6")  
}
