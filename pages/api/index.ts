import type { NextApiRequest, NextApiResponse } from 'next'
export default (req: NextApiRequest, res: NextApiResponse)=>{
	res.send("Welcome to the Handback API")
}