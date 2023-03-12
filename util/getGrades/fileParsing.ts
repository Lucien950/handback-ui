const parseGradingFile = (data: string) => {
	const importants = data.split(/\r|\n/).filter(p => !!p)
	const breakDownDirty = importants.slice(importants.findIndex(row => row.indexOf("AUTOGRADING GRADE") != -1) + 1, importants.findIndex(e => e.indexOf("Internal use only below here:") != -1))
	const breakDown = breakDownDirty.map(row => {
		return row.trim().split(/ {2,}/)
	})
		.filter(row => {
			return row.length >= 4
		})
		.map(row => {
			return {
				grade: parseInt(row[0].slice(0, -1)),
				total: parseInt(row[2].slice(0, -1)),
				comments: row.slice(3).join(" ")
			}
		})
	return breakDown
}
const parseGradingFileSummary = (data: string) => {
	const importants = data.split(/\r|\n/).filter(p => !!p)

	// GET THE TOTAL GRADE
	const autoGradingLineIndex = importants.findIndex(row => row.indexOf("AUTOGRADING GRADE") != -1)
	if (!autoGradingLineIndex) {
		throw "Auto Grading Grade line not found"
	}
	const autoGradingLine = importants[autoGradingLineIndex]
	if(!autoGradingLine){
		return {
			grade: -1,
			gradeTotal: 1,
			coolDownLine: undefined
		}
	}
	const [uninterestingtext, stringGrade, gradeToalString] = autoGradingLine?.split(/ {2,}/)
	const gradeTotalMatches = gradeToalString.match(/\d{1,3}/)
	if (!stringGrade || !gradeTotalMatches) {
		throw "Grade and Total Marks could not be parsed"
	}

	const coolDownLineIndex = importants.findIndex(row => row.indexOf("Cooldown time is") != -1)
	let coolDownLine = undefined
	if(coolDownLineIndex != -1){
		coolDownLine = importants[coolDownLineIndex].slice(21, -1)
	}

	const grade = parseInt(stringGrade)
	const gradeTotal = parseInt(gradeTotalMatches[0])
	return {
		grade, gradeTotal, coolDownLine
	}
}

export {parseGradingFile, parseGradingFileSummary}