import express, { RequestHandler } from "express";
import bodyParser from "body-parser"
import cors from "cors"
import { getFile, getTableLinks } from "../../util/siteFunctions";
import { FileEntry, Grade } from "../../types/types";
import { readFile, readFileSync } from "fs";
import path from "path";
import { parseGradingFile, parseGradingFileSummary } from "../../util/fileParsing";

const port = process.env.PORT || 4000;
const app = express();
const jsonParser = bodyParser.json()
app.use(jsonParser)
app.use(cors({
	origin: 'http://localhost:3000'
}))

const adminMiddleware: RequestHandler = (req, res, next)=>{
	const { authorization } = req.headers
	if(!req.body){
		res.status(500).send("Body is required, at least to pass UBC Number")
		return
	}
	const { ubcNum } = req.query
	if (!authorization || typeof authorization != "string" ) {
		res.status(500).send("Authorization not Provided. Please provide the Base64 Encoding of CWL/PASSWORD")
		return
	}
	if (!ubcNum || typeof ubcNum != "string"){
		res.status(500).send("UBC Student Number not Provided. Please send UBC number in Header")
		return
	}
	res.locals.authorization = authorization
	res.locals.ubcNum = parseInt(ubcNum)
	// console.log(authorization, ubcnum)
	next()
}

const handleGetTableLink: RequestHandler = async (req, res)=>{
	const { path } = req.query
	if (!path || typeof path != "string"){
		res.status(500).send("Path not provided in Body")
		return
	}
	if(path.includes(".")){
		res.status(500).send("Folder navigation or files are not allowed through this endpoint")
		return
	}
	const links = await getTableLinks(res.locals.authorization, res.locals.ubcNum, path)
	res.status(200).send(links)
}

app.get('/', (req, res) => { res.send('Welcome to the Handback API') })
// navigating file system
app.get('/getFiles', adminMiddleware, handleGetTableLink)
// getting grades
app.get("/getGrades", adminMiddleware, async (req, res)=>{
	const final = {
		lectures: [] as Grade[],
		psets: [] as Grade[],
		labs: [] as Grade[]
	};

	const subjects = ["lectures", "psets", "labs"]
	await Promise.all(subjects.map(async (s)=>{
		const assignments: FileEntry[] = await getTableLinks(res.locals.authorization, res.locals.ubcNum, `/${s}`)
		const grades: Grade[] = await Promise.all(assignments.map(async assignment=>{
			const gradeReportsHandins = await getTableLinks(res.locals.authorization, res.locals.ubcNum, `/${s}/${assignment.path}`)
			const latestHandIn = gradeReportsHandins.filter(grhi => grhi.name.indexOf("handin") != -1).reverse()[0]
			const latestGradeReport = gradeReportsHandins.filter(grhi => grhi.name.indexOf("grading-report") != -1).reverse()[0]

			const fileContent = await getFile(res.locals.authorization, res.locals.ubcNum, `/${s}/${assignment.path}`, latestGradeReport.name)
			const gradeInfo = parseGradingFileSummary(fileContent)
			// TODO Grade Report Parsing
			return {
				name: assignment.name.slice(0, -1),
				grade: gradeInfo.grade / gradeInfo.gradeTotal * 100,
				date: latestGradeReport.lastModified ? new Date(latestGradeReport.lastModified): undefined,
				handInFilePath: `/${s}/${assignment.path}${latestHandIn.name}`,
				gradeReportPath: `/${s}/${assignment.path}${latestGradeReport.name}`,
				cooldown: gradeInfo.coolDownLine ? new Date(gradeInfo.coolDownLine) : undefined
			} as Grade
		}))

		final[s as "lectures" | "psets" | "labs"] = grades
	}))
	res.status(200).send(final)
})
app.get("/auth", adminMiddleware, async (req, res)=>{
	// console.log(res.locals.authorization, res.locals.ubcNum)
	const response = await fetch(`https://cs110.students.cs.ubc.ca/handback/${res.locals.ubcNum}`, {
		headers: {
			"Authorization": res.locals.authorization
		}
	})
	if (!response.ok) {
		res.status(500).send(response.status).end()
	}
	res.status(200).end()
})
// testing for individual assignment
app.get("/testComments", adminMiddleware, async (req, res)=>{
	const file = await getFile(res.locals.authorization, res.locals.ubcNum, "/lectures/m01-functions/", "grading-report.txt")
	res.send(parseGradingFile(file))
})

app.listen(port, () => {
	console.log(`Server is listening on port ${port}.`);
})