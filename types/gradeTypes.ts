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

interface GradesPackage {
	lectures: Grade[];
	psets: Grade[];
	labs: Grade[];
}

export type { FileEntry, Grade, GradesPackage }