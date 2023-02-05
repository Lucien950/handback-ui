import type { NextApiRequest, NextApiResponse } from 'next'
import adminMiddleWare from 'util/adminMiddleWare'


const authUtil = async (ubcNum: number, authorization: string)=>{
	const response = await fetch(`https://cs110.students.cs.ubc.ca/handback/${ubcNum}`, {
		headers: {
			"Authorization": authorization
		}
	})
	return { responseOK: response.ok, responseStatus: response.status}
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const {authorization, ubcNum} = adminMiddleWare(req, res)
	if(!authorization || !ubcNum) return
	const {responseOK, responseStatus} = await authUtil(ubcNum, authorization)
	if (!responseOK) {
		res.status(500).send(responseStatus)
	}
	res.setHeader("Set-Cookie", `Authorization=${authorization}/${ubcNum}; Path=/`)
	res.status(200).end()
}

export {authUtil}