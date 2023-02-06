import { FileEntry, Grade, GradesPackage } from 'types/gradeTypes';
import { parseGradingFileSummary } from 'util/scraping/fileParsing';
import { getFile, getTableLinks } from 'util/scraping/siteFunctions';

export default async (ubcNum: number, authorization: string): Promise<GradesPackage> => {
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
				date: latestGradeReport.lastModified ?? undefined,
				handInFilePath: `/${s}/${assignment.path}${latestHandIn.name}`,
				gradeReportPath: `/${s}/${assignment.path}${latestGradeReport.name}`,
				cooldown: gradeInfo.coolDownLine ?? undefined
			} as Grade
		}))

		final[s as "lectures" | "psets" | "labs"] = grades
	}))
	return final
}