// helpers
import { getFileText, getTableLinks } from './siteFunctions';
import { parseGradingFileSummary } from './fileParsing';
// types
import { FileEntry, Grade, GradesPackage } from 'types/gradeTypes';
import auth from 'types/auth';

export default async (auth: auth): Promise<GradesPackage> => {
	const final = {
		lectures: [] as Grade[],
		psets: [] as Grade[],
		labs: [] as Grade[]
	};

	const subjects = ["lectures", "psets", "labs"]
	
	await Promise.all(subjects.map(async (s) => {
		const assignments: FileEntry[] = await getTableLinks(auth, `/${s}`)
		const grades: Grade[] = await Promise.all(assignments.map(async assignment => {
			const gradeReportsHandins = await getTableLinks(auth, `/${s}/${assignment.path}`)
			// get the latest handin and grade report file
			const latestHandIn = gradeReportsHandins.filter(grhi => grhi.name.indexOf("handin") != -1).reverse()[0]
			const latestGradeReport = gradeReportsHandins.filter(grhi => grhi.name.indexOf("grading-report") != -1).reverse()[0]

			const fileContent = await getFileText(auth, `/${s}/${assignment.path}`, latestGradeReport.name)
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