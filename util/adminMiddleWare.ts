import { NextApiRequest, NextApiResponse } from 'next'
import auth from 'types/auth'

export default (req: NextApiRequest, res: NextApiResponse): auth | null => {
	const { authorization } = req.headers
	const { ubcNum } = req.query
	if (!authorization || typeof authorization != "string") {
		res.status(500).send("Authorization not Provided. Please provide the Base64 Encoding of CWL/PASSWORD")
		return null
	}
	if (!ubcNum || typeof ubcNum != "string") {
		res.status(500).send("UBC Student Number not Provided. Please send UBC number in Header")
		return null
	}
	// console.log(authorization, ubcnum)
	return {
		authorization, ubcNum: parseInt(ubcNum)
	}
}