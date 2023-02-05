import type { NextApiRequest, NextApiResponse } from 'next'
import adminMiddleWare from 'util/adminMiddleWare'

export default async (req: NextApiRequest, res: NextApiResponse) => {
	console.log("reached auth")
	const { ubcNum, authorization } = adminMiddleWare(req, res)
	if(!(ubcNum && authorization)) return
	// console.log(res.locals.authorization, res.locals.ubcNum)
	const response = await fetch(`https://cs110.students.cs.ubc.ca/handback/${ubcNum}`, {
		headers: {
			"Authorization": authorization
		}
	})
	if (!response.ok) {
		res.status(500).send(response.status)
	}
	res.status(200).end()
}