// import React from 'react'

interface Props {
	projectDate : string,
}

const ProjectDate = ({ projectDate } : Props) => {
	return (
		<div>By {projectDate}</div>
	)
}

export default ProjectDate