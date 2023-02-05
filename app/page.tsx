import { cookies } from "next/headers"
import Link from "next/link"
export default function HomePage(){
	const isLoggedIn = !!cookies().get("Authorization")
	return(
		<div>
			<h1 className="text-[9.9vw] text-justify font-bold">
				HANDBACK CPSC110
				<div className="w-full"></div>
			</h1>
			<div className="flex justify-center w-full">
				<Link href={isLoggedIn ? "/dashboard" : "/login"}>
					<button className="py-4 px-6 text-2xl bg-blue-500 hover:bg-blue-700 transition-colors text-white font-bold rounded">
						{
							isLoggedIn
							?
							<span>Go To Dashboard</span>
							:
							<span>Login</span>
						}
					</button>
				</Link>
			</div>
		</div>
	)
}