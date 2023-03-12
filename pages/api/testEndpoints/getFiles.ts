import type { NextApiRequest, NextApiResponse } from 'next'
import adminMiddleWare from 'util/adminMiddleWare'
import { getTableLinks } from 'util/getGrades/siteFunctions'

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const auth = adminMiddleWare(req, res)
	if (!auth) return
	const { path } = req.query
	if (!path || typeof path != "string") {
		res.status(500).send("Path not provided in Body")
		return
	}
	if (path.includes(".")) {
		res.status(500).send("Folder navigation or files are not allowed through this endpoint")
		return
	}
	const links = await getTableLinks(auth, path)
	res.status(200).send(links)
}