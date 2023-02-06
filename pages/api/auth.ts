import type { NextApiRequest, NextApiResponse } from 'next'
import adminMiddleWare from 'util/adminMiddleWare'
import { generateCookie } from 'util/authCookieHandling'


const authUtil = async (ubcNum: number, authorization: string)=>{
	const response = await fetch(`https://cs110.students.cs.ubc.ca/handback/${ubcNum}`, {
		headers: {
			"Authorization": authorization
		}
	})
	return { responseOK: response.ok, responseStatus: response.status}
}

export default async function Auth(req: NextApiRequest, res: NextApiResponse){
	const {authorization, ubcNum} = adminMiddleWare(req, res)
	if(!authorization || !ubcNum) return
	const {responseOK, responseStatus} = await authUtil(ubcNum, authorization)
	if (!responseOK) {
		res.status(500).send(responseStatus)
	}
	res.setHeader("Set-Cookie", generateCookie(authorization, ubcNum))
	res.status(200).end()
}

export {authUtil}