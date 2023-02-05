interface FileEntry {
	name: string,
	path: string,
	lastModified?: string,
	description?: string,
	sizeBytes?: string
}

interface Grade{
	name: string,
	grade: number,
	date: string,
	handInFilePath: string,
	gradeReportPath: string,
	cooldown: string,
}

export type { FileEntry, Grade}