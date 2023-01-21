import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";
import { Oval } from "react-loader-spinner";

export default function Login(){
	const router = useRouter()
	const [loginLoading, setLoginLoading] = useState(false)
	const handleLogin: FormEventHandler<HTMLFormElement> = async (e)=>{
		e.preventDefault()
		console.log()

		const b64 = Buffer.from(`${(document.getElementById("username") as HTMLInputElement).value}:${(document.getElementById("password") as HTMLInputElement).value}`)
		const authString = "Basic " + b64.toString("base64")
		const studentNumber = (document.getElementById("studentNumber") as HTMLInputElement).value
		console.log(authString, studentNumber)
		const res = await fetch(`http://localhost:4000/auth?ubcNum=${studentNumber}`, {
			headers:{
				Authorization: authString
			}
		})
		if(!res.ok){
			setLoginLoading(false)
			return
		}

		window.localStorage.setItem("Authorization", authString)
		window.localStorage.setItem("studentNumber", studentNumber)
		router.push("/")
	}
	return (
		<div className="grid place-items-center h-screen">
			<form className="border-2 p-4" onSubmit={handleLogin}>
				<label htmlFor="studentNumber">Student Number</label>
				<input className="block p-2 focus:outline-none focus:ring rounded-md border-2 mb-4" type="text" name="studentNumber" id="studentNumber" placeholder="Student Number"/>
				<label className="block mb-2" htmlFor="username">CWL Username</label>
				<input className="block p-2 focus:outline-none focus:ring rounded-md border-2 mb-4" type="text" name="username" id="username" placeholder="Username" />
				<label className="block mb-2" htmlFor="password">Password</label>
				<input className="block p-2 focus:outline-none focus:ring rounded-md border-2 mb-4" type="password" name="password" id="password" placeholder="Password" />
				
				<button type="submit" className="relative p-2 border-2 w-full">
					{
						!loginLoading
						?
						<span>Login</span>
						:
						<Oval height={20} width={20} wrapperClass="absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%]"/>
					}
				</button>
			</form>
		</div>
	);
}