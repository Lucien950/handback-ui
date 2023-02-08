'use client'
import {useState, useEffect} from "react"
const GradeChart = ({ grade }: { grade: number }) => {
	const [gradeAnimated, setGradeAnimated] = useState(false)
	useEffect(() => {
		setGradeAnimated(!!grade)
	}, [grade])

	const offset = 20
	return (
		<div className="relative inline-block">
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 500 500"
				className="h-64 w-64 inline stroke-[12px]"
			>
				<g id="Layer_1">
					{/* stroke */}
					<circle
						className="fill-none stroke-[#A2A2A2] stroke-[80]"
						cx="250" cy="250" r="150"
						style={{
							filter: "drop-shadow(11px 11px 26px #8a8a8a) drop-shadow(-11px -11px 26px #bababa);"
						}}
					/>

					{/* green fill */}
					<circle
						className="fill-none stroke-[#008500] stroke-[50] transition-[stroke-dasharray] duration-[800ms] delay-[300ms] rotate-[-135deg] origin-center"
						cx="250" cy="250" r="150"
						style={{
							strokeDasharray: `${gradeAnimated ? 975 * grade / 100 : 0}px 9999px`,
						}}
					/>
				</g>
			</svg>

			{
				grade.toFixed(0) != "NaN" &&
				<span className="text-4xl font-bold absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
					{grade.toFixed(0)}%
				</span>
			}
		</div>
	)
}

export default GradeChart