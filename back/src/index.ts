import express from "express";
import serverless from "serverless-http"
import { parse } from 'node-html-parser';


const getSite = async (authorization: string, ubcNum: number, page: string)=>{
	const options = { method: 'GET', headers: { Authorization: authorization } };
	const response = await fetch(`https://cs110.students.cs.ubc.ca/handback/${ubcNum}${page}`, options)
	return parse(await response.text())
}
const getTable = async(authorization: string, ubcNum: number, page: string)=>{
	const site = await getSite(authorization, ubcNum, page)
	return site.querySelectorAll("body table tr td a").slice(1)
}

const port = process.env.PORT || 3001;
const app = express();

app.get('/', (req, res) => {
	res.send('Welcome to the Handback API')
})

app.get('/folders/:id', async (req, res)=>{
	const { authorization } = req.headers
	const ubcNum = req.params.id;
	if (!authorization || !ubcNum){
		res.status(500).send("Auth or UBC Student Number not Provided. Please provide the Base64 Encoding of CWL/PASSWORD").end()
		return
	}
	const table = await getTable(authorization, parseInt(ubcNum), "/")
	const links = table.map(e => e.attributes.href.slice(0, -1))
	res.send(links)
})

app.get("/summary/:id", async(req, res)=>{
	const { authorization } = req.headers
	const ubcNum = req.params.id;
	if (!authorization || !ubcNum) {
		res.status(500).send("Auth or UBC Student Number not Provided. Please provide the Base64 Encoding of CWL/PASSWORD").end()
		return
	}
	const table = await getTable(authorization, parseInt(ubcNum), "/SUMMARY")
	console.log(table)
	const links = table.map(e => e.attributes.href.slice(0, -1))
	res.status(200).send(links)
})

if (process.env.ENVIRONMENT === 'production')
	exports.handler = serverless(app);
// development/other
else {
	app.listen(port, () => {
		console.log(`Server is listening on port ${port}.`);
	});
}