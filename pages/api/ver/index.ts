import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handle(req: NextApiRequest, res: NextApiResponse) {

      // Get data from your database
      res.send("v1.0.1")  
}
