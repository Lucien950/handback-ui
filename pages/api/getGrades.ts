import type { NextApiRequest, NextApiResponse } from 'next'
import { FileEntry, Grade } from 'types/types';
import adminMiddleWare from 'util/adminMiddleWare';
import { parseGradingFileSummary } from 'util/fileParsing';
import { getFile, getTableLinks } from 'util/siteFunctions';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { ubcNum, authorization } = adminMiddleWare(req, res)
	if (!(ubcNum && authorization)) return
	const final = {
		lectures: [] as Grade[],
		psets: [] as Grade[],
		labs: [] as Grade[]
	};

	const subjects = ["lectures", "psets", "labs"]
	await Promise.all(subjects.map(async (s) => {
		const assignments: FileEntry[] = await getTableLinks(authorization, ubcNum, `/${s}`)
		const grades: Grade[] = await Promise.all(assignments.map(async assignment => {
			const gradeReportsHandins = await getTableLinks(authorization, ubcNum, `/${s}/${assignment.path}`)
			const latestHandIn = gradeReportsHandins.filter(grhi => grhi.name.indexOf("handin") != -1).reverse()[0]
			const latestGradeReport = gradeReportsHandins.filter(grhi => grhi.name.indexOf("grading-report") != -1).reverse()[0]

			const fileContent = await getFile(authorization, ubcNum, `/${s}/${assignment.path}`, latestGradeReport.name)
			const gradeInfo = parseGradingFileSummary(fileContent)
			// TODO Grade Report Parsing
			return {
				name: assignment.name.slice(0, -1),
				grade: gradeInfo.grade / gradeInfo.gradeTotal * 100,
				date: latestGradeReport.lastModified ? new Date(latestGradeReport.lastModified) : undefined,
				handInFilePath: `/${s}/${assignment.path}${latestHandIn.name}`,
				gradeReportPath: `/${s}/${assignment.path}${latestGradeReport.name}`,
				cooldown: gradeInfo.coolDownLine ? new Date(gradeInfo.coolDownLine) : undefined
			} as Grade
		}))

		final[s as "lectures" | "psets" | "labs"] = grades
	}))
	res.status(200).send(final)
}