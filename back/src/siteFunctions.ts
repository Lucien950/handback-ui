import { parse } from 'node-html-parser';
import { HTMLElement } from "node-html-parser"
import { files } from "./types";

const getSite = async (authorization: string, ubcNum: number, page: string) => {
	const options = { method: 'GET', headers: { Authorization: authorization } };
	const response = await fetch(`https://cs110.students.cs.ubc.ca/handback/${ubcNum}${page}`, options)
	return parse(await response.text())
}
const getTableLinks = async (authorization: string, ubcNum: number, page: string) => {
	const site = await getSite(authorization, ubcNum, page)
	const tableRows = site.querySelectorAll("body table tr").slice(2, -1)
	const links = tableRows.map(tableRow => {
		const children: HTMLElement[] = tableRow.childNodes.map((e: any) => e.childNodes[0])
		const [image, link, modified, size, description] = children
		return {
			name: link.innerText,
			path: link.attributes.href,
			lastModified: modified.innerText != "&nbsp;" ? modified.innerText.trim() : undefined,
			description: description.innerText != "&nbsp;" ? description.innerText.trim() : undefined,
			sizeBytes: !["&nbsp;", "-"].includes(size.innerText.trim()) ? size.innerText.trim() : undefined,
		} as files
	})
	return links
}

export { getTableLinks }