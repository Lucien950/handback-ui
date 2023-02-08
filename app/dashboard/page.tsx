// next
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
// utils
import { authUtil } from 'pages/api/auth';
import getGrades from 'util/scraping/getGrades';
// client components
import GradeChart from "./GradeChart"
import GradesList from "./GradesList";
import LogOutButton from './LogoutButton';
import { COOKIENAME } from 'util/authCookieHandling';

interface CoolDown{
	name: string,
	endTime: string
}
export default async function Dashboard() {
	// auth
	const authCookie = cookies().get(COOKIENAME)
	if (!authCookie){
		redirect("/login")
	}
	const [authorization, studentNumberStr] = authCookie.value.split("/")
	const studentNumber = parseInt(studentNumberStr)
	if (!authorization || !studentNumber) {
		redirect("/login")
	}
	const { responseOK } = await authUtil(studentNumber, authorization)
	if (!responseOK) {
		cookies().clear()
		redirect("/login")
	}
	// end auth

	// grades
	const { lectures, psets, labs} = await getGrades(studentNumber, authorization)

	// grade metadata
	const allGrades = [...lectures, ...psets, ...labs]
	const total = allGrades.reduce((a, l) => a + l.grade, 0)
	const overallGrade = total / allGrades.length
	const activeCoolDowns = allGrades
		.filter(l => (new Date(l.date).getTime() - (new Date()).getTime()) > 0)
		.map(l => {
			return {
				name: l.name,
				endTime: l.date
			} as CoolDown
		})

	return (
		<div className="flex flex-col min-h-screen relative">
			{/* HEADER */}
			<div className="w-full bg-[#A2A2A2] sticky top-0 z-10">
				<div className="container mx-auto flex flex-row justify-between items-center">
					<GradeChart grade={overallGrade}/>
					<div className="bg-white p-4">
						<h1 className="text-2xl">Cooldowns</h1>
						<p>WIP</p>
						{
							activeCoolDowns.map((ac, i)=>
								<div key={i}>
									<p>{ac.name}</p>
									<p>{new Date(new Date(ac.endTime).getTime() - new Date().getTime()).getSeconds()}</p>
								</div>
							)
						}
					</div>
					<div>
						<h1 className="text-4xl font-bold">CPSC110 Handback</h1>
						<h2 className="text-2xl text-right">An App by <a href="https://github.com/Lucien950" className="focus:outline-none focus:underline text-blue-500">@Lucien950</a></h2>
					</div>
					<LogOutButton />
				</div>
			</div>
			
			{/* CONTENT */}
			<div className="bg-slate-200 flex-1">
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 container mx-auto pt-8 gap-x-8 px-4 md:px-0">
					<div>
						<h1 className="text-3xl font-bold mb-3">Problem Sets</h1>
						<GradesList grades={psets} />
					</div>
					<div>
						<h1 className="text-3xl font-bold mb-3">Labs</h1>
						<GradesList grades={labs} />
					</div>
					<div>
						<h1 className="text-3xl font-bold mb-3">Lecture</h1>
						<GradesList grades={lectures}/>
					</div>
				</div>
			</div>
		</div>
	)
}
