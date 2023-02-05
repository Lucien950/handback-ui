'use client';
import { motion } from "framer-motion"
import neuroMorph from "styles/neuroMorph.module.css"
import { Grade } from "types/types";

const GradeEntry = ({ gradeResult }: { gradeResult: Grade }) => {
	const item = {
		hidden: { opacity: 0, y: "70%" },
		show: { opacity: 1, y: 0 }
	}
	return (
		<>
			<motion.div
				className={`p-2 rounded-md mb-4 ${neuroMorph.neuroRect}`}
				variants={item}
				transition={{ ease: "easeInOut" }}
			>
				<div className={neuroMorph.neuroRectBack}></div>
				<div className={`w-full h-full flex flex-row justify-between ${neuroMorph.neuroRectContent}`}>
					<div>
						<p className="text-2xl font-bold mb-2"> {gradeResult.name} </p>
						<p className="text-normal">
							<span className="mr-1">
								{new Date(gradeResult.date).toLocaleDateString("en-CA", { dateStyle: "short" })}
							</span>
							<span>
								{new Date(gradeResult.date).toLocaleTimeString("en-CA", { timeStyle: "short" })}
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
							<a href={`https://cs110.students.cs.ubc.ca/handback/${83986398}` + gradeResult.gradeReportPath} title="Grading Report" className="focus:outline-none group" target="_blank" rel="noreferrer">
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

export default GradeEntry