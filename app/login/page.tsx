import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authUtil } from "pages/api/auth";
import { COOKIENAME } from "util/authCookieHandling";
import LoginForm from "./LoginForm";

export default async function Login(){
	const authCookie = cookies().get(COOKIENAME)
	if (authCookie){
		const [authorization, studentNumberStr] = authCookie.value.split("/")
		const auth = {
			authorization, ubcNum: parseInt(studentNumberStr)
		}
		if (await authUtil(auth)){
			redirect("/dashboard")
		}
	}
	return (
		<div className="grid place-items-center h-screen">
			<LoginForm />
		</div>
	);
}