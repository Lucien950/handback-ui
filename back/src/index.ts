import express, { RequestHandler } from "express";
import serverless from "serverless-http"
import { getTableLinks } from "./siteFunctions";

const port = process.env.PORT || 3001;
const app = express();

const adminMiddleware: RequestHandler = (req, res, next)=>{
	const { authorization } = req.headers
	const ubcNum = req.params.id;
	if (!authorization || !ubcNum) {
		res.status(500).send("Auth or UBC Student Number not Provided. Please provide the Base64 Encoding of CWL/PASSWORD").end()
		return
	}
	res.locals.authorization = authorization
	res.locals.ubcNum = ubcNum
	next()
}

const handleGetTableLink: RequestHandler = async (req, res)=>{
	const path={"folders":"","summary":"SUMMARY","labs":"labs","lectures":"lectures","psets":"psets"}[req.path.slice(1).split("/")[0]]
	if(!path){
		res.status(500).send("PATH NOT FOUND, VERY BROKEN")
		return
	}
	const links = await getTableLinks(res.locals.authorization, parseInt(res.locals.ubcNum), "/" + path)
	res.status(200).send(links)
}

app.get('/', (req, res) => { res.send('Welcome to the Handback API') })
app.get('/folders/:id', adminMiddleware, handleGetTableLink)
app.get("/summary/:id", adminMiddleware, handleGetTableLink)
app.get("/labs/:id", adminMiddleware, handleGetTableLink)
app.get("/lectures/:id", adminMiddleware, handleGetTableLink)
app.get("/psets/:id", adminMiddleware, handleGetTableLink)

// AWS Lambda Reasons
if (process.env.ENVIRONMENT === 'production'){
	exports.handler = serverless(app);
}
// development/other
else {
	app.listen(port, () => {
		console.log(`Server is listening on port ${port}.`);
	});
}