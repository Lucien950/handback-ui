'use client';
import { useEffect, useState } from "react"
import {motion} from "framer-motion"
import { useRouter } from 'next/navigation';
import { gradeResultInterface } from "types/gradeResult";
import GradeEntry from "./GradeEntry"

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
			console.log("loaded")
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
							activeCoolDowns.map((ac, i)=>
								<div key={i}>
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
