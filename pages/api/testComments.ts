
import { parseGradingFile } from "util/fileParsing";
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFile } from "util/siteFunctions";
import adminMiddleWare from "util/adminMiddleWare";

// testing for individual assignment
export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { ubcNum, authorization } = adminMiddleWare(req, res)
	if (!(ubcNum && authorization)) return
	const file = await getFile(authorization, ubcNum, "/lectures/m01-functions/", "grading-report.txt")
	res.send(parseGradingFile(file))
}