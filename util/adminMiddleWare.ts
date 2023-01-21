import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
	const { authorization } = req.headers
	const { ubcNum } = req.query
	if (!authorization || typeof authorization != "string") {
		res.status(500).send("Authorization not Provided. Please provide the Base64 Encoding of CWL/PASSWORD")
		return {authorization: null, ubcNum: null}
	}
	if (!ubcNum || typeof ubcNum != "string") {
		res.status(500).send("UBC Student Number not Provided. Please send UBC number in Header")
		return {authorization: null, ubcNum: null}
	}
	// console.log(authorization, ubcnum)
	return {
		authorization, ubcNum: parseInt(ubcNum)
	}
}