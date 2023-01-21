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
	date: Date,
	handInFilePath: string,
	gradeReportPath: string,
	cooldown: Date,
}

export type { FileEntry, Grade}