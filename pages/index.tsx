import { useEffect, useState } from "react"
import {motion} from "framer-motion"
import { useRouter } from "next/router"
import neuroMorph from "styles/neuroMorph.module.css"

const GradeChart = ({grade}: {grade: number})=>{
	const [gradeAnimated, setGradeAnimated] = useState(false)
	useEffect(()=>{
		setGradeAnimated(!!grade)
	}, [grade])

	const offset = 20
	return(
		<div className="relative inline-block">
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 500 500"
				className="h-64 w-64 inline stroke-[12px]"
			>
				<g id="Layer_1">
					{/* stroke */}
					<circle
						className="fill-none stroke-[#A2A2A2] stroke-[79.1694]"
						cx="250" cy="250" r="150"
						style={{
							filter:`drop-shadow(-${offset}px -${offset}px 20px rgba(255,255,255,0.15)) drop-shadow(${offset}px ${offset}px 20px rgba(0,0,0,0.07))`
						}}
					/>

					{/* green fill */}
					<circle
						className="fill-none stroke-[#008500] stroke-[50] transition-[stroke-dasharray] duration-[800ms] delay-[300ms] rotate-[-135deg] origin-center"
						cx="250" cy="250" r="150"
						style={{
							strokeDasharray: `${gradeAnimated ? 975 * grade / 100 : 0}px 9999px`,
						}}
					/>
				</g>
			</svg>

			{
				grade.toFixed(0) != "NaN" &&
				<span className="text-4xl font-bold absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
					{grade.toFixed(0)}%
				</span>
			}
		</div>
	)
}

interface gradeResultInterface{
	name: string,
	grade: number,
	date: string,
	submissionDate: Date,
	handInFilePath: string,
	gradeReportPath: string,
}
const GradeEntry = ({ gradeResult }: {gradeResult: gradeResultInterface })=>{
	const item = {
		hidden: { opacity: 0, y: "70%"},
		show: { opacity: 1, y: 0}
	}
	return(
		<>
			<motion.div
				className={`p-2 rounded-md mb-4 ${neuroMorph.neuroRect}`}
				variants={item}
				transition={{ease: "easeInOut"}}
			>
				<div className={neuroMorph.neuroRectBack}></div>
				<div className={`w-full h-full flex flex-row justify-between ${neuroMorph.neuroRectContent}`}>
					<div>
						<p className="text-2xl font-bold mb-2"> {gradeResult.name} </p>
						<p className="text-normal">
							<span className="mr-1">
								{gradeResult.submissionDate.toLocaleDateString("en-CA", { dateStyle: "short" })}
							</span>
							<span>
								{gradeResult.submissionDate.toLocaleTimeString("en-CA", {timeStyle: "short"})}
							</span>
						</p>
					</div>
					<div>
						<p className="text-2xl text-right"> {gradeResult.grade} </p>
						<div className="flex flex-row">
							<a href={`https://cs110.students.cs.ubc.ca/handback/${83986398}` + gradeResult.handInFilePath} title="Handin File" className="focus:outline-none group">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-8 h-8 transition-[fill] duration-75 fill-slate-500 group-focus:fill-slate-900">
									<path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm4.75 6.75a.75.75 0 011.5 0v2.546l.943-1.048a.75.75 0 011.114 1.004l-2.25 2.5a.75.75 0 01-1.114 0l-2.25-2.5a.75.75 0 111.114-1.004l.943 1.048V8.75z" clipRule="evenodd" />
								</svg>
							</a>
							<a href={`https://cs110.students.cs.ubc.ca/handback/${83986398}` + gradeResult.gradeReportPath} title="Grading Report" className="focus:outline-none group" target="_blank">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-8 h-8 transition-[fill] duration-75 fill-slate-500 group-focus:fill-slate-900">
									<path fillRule="evenodd" d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13zM13.25 9a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75zm-6.5 4a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5a.75.75 0 01.75-.75zm4-1.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z" clipRule="evenodd" />
								</svg>
							</a>
						</div>
					</div>
				</div>
			</motion.div>
		</>
	)
}


interface CoolDown{
	name: string,
	endTime: Date
}
export default function Home() {
	const router = useRouter()
	const [overallGrade, setOverallGrade] = useState(0)
	const [activeCoolDowns, setActiveCoolDowns] = useState([] as CoolDown[])
	const [lectures, setLectures] = useState([] as gradeResultInterface[])
	const [psets, setPSets] = useState([] as gradeResultInterface[])
	const [labs, setLabs] = useState([] as gradeResultInterface[])

	useEffect(()=>{
		const allGrades = [...lectures, ...psets, ...labs]
		const total = allGrades.reduce((a, l)=>a + l.grade, 0)
		setOverallGrade(total/allGrades.length)

		setActiveCoolDowns(
			allGrades
				.filter(l => (l.submissionDate.getTime() - (new Date()).getTime()) > 0)
				.map(l=>{
					return {
						name: l.name,
						endTime: l.submissionDate
					} as CoolDown
				})
		)
	}, [lectures, psets, labs])

	// on load
	useEffect(()=>{
		(async()=>{
			const authorization = localStorage.getItem("Authorization")
			const studentNumber = localStorage.getItem("studentNumber")
			if (!authorization || !studentNumber) {
				router.push("/login")
				return
			}

			const res = await fetch(`/api/auth?ubcNum=${studentNumber}`, {
				headers: {
					Authorization: authorization
				}
			})
			if (!res.ok) {
				localStorage.removeItem("Authorization")
				localStorage.removeItem("studentNumber")
				router.push("/login")
				return
			}

			const authHeaders = {
				Authorization: localStorage.getItem("Authorization")!
			}
			const data = await fetch(`/api/getGrades?ubcNum=${localStorage.getItem("studentNumber")}`, {
				headers: {
					...authHeaders
				}
			})
				.then(res => res.json())
				.then((data: { lectures: gradeResultInterface[], psets: gradeResultInterface[], labs: gradeResultInterface[] }) => {
					data.lectures = data.lectures.map(l => { l.submissionDate = new Date(l.date); return l })
					data.psets = data.psets.map(l => { l.submissionDate = new Date(l.date); return l })
					data.labs = data.labs.map(l => { l.submissionDate = new Date(l.date); return l })
					return data
				})
			setLectures(data.lectures)
			setPSets(data.psets)
			setLabs(data.labs)
		})()
	}, [])

	const handleLogout = ()=>{
		localStorage.removeItem("Authorization")
		localStorage.removeItem("studentNumber")
		router.push("/login")
	}

	const container = {
		hidden:{
		},
		show: {
			transition: {
				staggerChildren: 0.1
			}
		}
	}
	return (
		<div className="flex flex-col min-h-screen">
			{/* HEADER */}
			<div className="w-full bg-[#A2A2A2]">
				<div className="container mx-auto flex flex-row justify-between items-center">
					<GradeChart grade={overallGrade}/>
					<div className="bg-white p-4">
						<h1 className="text-2xl">Cooldowns</h1>
						<p>WIP</p>
						{
							activeCoolDowns.map(ac=>
								<div>
									<p>{ac.name}</p>
									<p>{new Date(ac.endTime.getTime() - new Date().getTime()).getSeconds()}</p>
								</div>
							)
						}
					</div>
					<div>
						<h1 className="text-4xl font-bold">CPSC110 Handback</h1>
						<h2 className="text-2xl text-right">An App by <a href="https://github.com/Lucien950" className="focus:outline-none focus:underline text-blue-500">@Lucien950</a></h2>
					</div>
					<button className="p-2 rounded-md place-self-start border-4 border-black focus:outline-none focus:ring" onClick={handleLogout}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
						</svg>
					</button>
				</div>
			</div>

			{/* CONTENT */}
			<div className="bg-slate-200 flex-1">
				<div className="grid grid-cols-3 container mx-auto pt-8 gap-x-8 ">
					<div>
						<h1 className="text-3xl font-bold mb-3">Lecture</h1>
						{
							lectures.length > 0 ?
							<motion.div variants={container} initial="hidden" animate="show" key="containerLecture">
								{
									lectures.map((l, i) => <GradeEntry gradeResult={l} key={"lecture"+i} />)
								}
							</motion.div>
							:
							<div></div>
						}
					</div>
					<div>
						<h1 className="text-3xl font-bold mb-3">Problem Sets</h1>
						{
							psets.length > 0 ? 
							<motion.div variants={container} initial="hidden" animate="show" key="containerPSET">
								{
									psets.map((p, i) => <GradeEntry gradeResult={p} key={"pset"+i} /> )
								}
							</motion.div>
							:
							<div></div>
						}
					</div>
					<div>
						<h1 className="text-3xl font-bold mb-3">Labs</h1>
						{
							labs.length > 0 ?
							<motion.div variants={container} initial="hidden" animate="show" key="containerLabs">
								{
									labs.map((l, i)=> <GradeEntry gradeResult={l} key={"labs" + i} />)
								}
							</motion.div>
							:
							<div></div>
						}
					</div>
			</div>
			</div>
		</div>
	)
}
