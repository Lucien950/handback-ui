
import { parseGradingFile } from "util/getGrades/fileParsing";
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFileText } from "util/getGrades/siteFunctions";
import adminMiddleWare from "util/adminMiddleWare";

// testing for individual assignment
export default async (req: NextApiRequest, res: NextApiResponse) => {
	const auth = adminMiddleWare(req, res)
	if (!auth) return
	const file = await getFileText(auth, "/lectures/m01-functions/", "grading-report.txt")
	res.send(parseGradingFile(file))
}