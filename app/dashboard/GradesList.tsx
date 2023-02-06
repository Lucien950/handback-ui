'use client';

import { motion } from "framer-motion";
import { Grade } from "types/gradeTypes";
import GradeEntry from "./GradeEntry";

const GradesList = ({ grades }: { grades: Grade[] })=>{
	const container = {
		hidden: {
		},
		show: {
			transition: {
				staggerChildren: 0.1
			}
		}
	}
	return(
		<>
			{
				grades.length > 0 ?
					<motion.div variants={container} initial="hidden" animate="show" key="containerLecture">
						{
							grades.map((l, i) => <GradeEntry gradeResult={l} key={"lecture" + i} />)
						}
					</motion.div>
					:
					<div></div>
			}
		</>
	)
}

export default GradesList