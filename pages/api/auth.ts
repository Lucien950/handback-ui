import type { NextApiRequest, NextApiResponse } from 'next'
import auth from 'types/auth'
import adminMiddleWare from 'util/adminMiddleWare'
import { generateCookie } from 'util/authCookieHandling'


const authUtil = async (auth: auth)=>{
	const response = await fetch(`https://cs110.students.cs.ubc.ca/handback/${auth.ubcNum}`, {
		headers: {
			"Authorization": auth.authorization
		}
	})
	return { responseOK: response.ok, responseStatus: response.status}
}

export default async function Auth(req: NextApiRequest, res: NextApiResponse){
	const auth = adminMiddleWare(req, res)
	if(!auth) return

	const {responseOK, responseStatus} = await authUtil(auth)
	if (!responseOK) {
		res.status(500).send(responseStatus)
	}
	res.setHeader("Set-Cookie", generateCookie(auth))
	res.status(200).end()
}

export {authUtil}