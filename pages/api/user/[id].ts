import type { NextApiRequest, NextApiResponse } from 'next'

export default async function userHandler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id, b },
    body: { prompt },
    method,
  } = req

  switch (method) {
    case 'GET':
      // Get data from your database
      res.status(200).json({ id, "prompt": prompt, name2: `${id}` })
      break
    case 'POST':
      // Update or create data in your database
      res.status(200).json({ id, "prompt": prompt, name2: b || `${id}` })
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
