import { parse } from 'node-html-parser';
import { HTMLElement } from "node-html-parser"
import auth from 'types/auth';
import { FileEntry } from "types/gradeTypes";


const getFileText = async (auth: auth, path: string, fileName?: string) => {
	const options = { method: 'GET', headers: { Authorization: auth.authorization } };
	const url = `https://cs110.students.cs.ubc.ca/handback/${auth.ubcNum}${path}${fileName ? `${fileName}` : ""}`
	const response = await fetch(url, options)
	if (!response.ok) {
		throw "Page Response Error"
	}
	const responseText = await response.text()
	return responseText
}

const getSiteAsElement = async (auth: auth, path: string): Promise<HTMLElement> => {
	const textResponse = await getFileText(auth, path)
	return parse(textResponse)
}

const getTableLinks = async (auth: auth, path: string): Promise<FileEntry[]> => {
	const site = await getSiteAsElement(auth, path)
	// remove first three (headers), and last one (a line, not a link)
	const tableRows = site.querySelectorAll("body table tr").slice(3, -1)
	
	const links = tableRows.map(tableRow => {
		const children: HTMLElement[] = tableRow.childNodes.map((e: any) => e.childNodes[0])
		const [imageElement, link, modified, size, description] = children
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

export { getTableLinks, getFileText }