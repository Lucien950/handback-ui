import { parse } from 'node-html-parser';
import { HTMLElement } from "node-html-parser"
import { FileEntry } from "../../types/gradeTypes";

const getSite = async (authorization: string, ubcNum: number, page: string) => {
	const options = { method: 'GET', headers: { Authorization: authorization } };
	const url = `https://cs110.students.cs.ubc.ca/handback/${ubcNum}${page}`
	// URL DEBUGGING
	// console.log(url)
	const response = await fetch(url, options)
	if (!response.ok) {
		throw "Page Response Error"
	}
	return parse(await response.text())
}
const getTableLinks = async (authorization: string, ubcNum: number, page: string) => {
	const site = await getSite(authorization, ubcNum, page)
	const tableRows = site.querySelectorAll("body table tr").slice(3, -1)
	const links = tableRows.map(tableRow => {
		const children: HTMLElement[] = tableRow.childNodes.map((e: any) => e.childNodes[0])
		const [image, link, modified, size, description] = children
		return {
			name: link.innerText,
			path: link.attributes.href,
			lastModified: modified.innerText != "&nbsp;" ? modified.innerText.trim() : undefined,
			description: description.innerText != "&nbsp;" ? description.innerText.trim() : undefined,
			sizeBytes: !["&nbsp;", "-"].includes(size.innerText.trim()) ? size.innerText.trim() : undefined,
		} as FileEntry
	})
	return links
}

const getFile = async(authorization: string, ubcNum: number, path: string, fileName: string)=>{
	const options = { method: 'GET', headers: { Authorization: authorization } };
	const url = `https://cs110.students.cs.ubc.ca/handback/${ubcNum}${path}/${fileName}`
	const response = await fetch(url, options)
	if (!response.ok) {
		throw "Page Response Error"
	}
	return await response.text()
}

export { getTableLinks, getFile }