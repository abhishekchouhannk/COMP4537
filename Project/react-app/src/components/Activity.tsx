// import React from 'react'

interface Props {
	complete: number,
	target: number
}

const Activity = ( {complete, target} : Props) => {
	return (
		<div>
			<div>Activites</div>
			<h1>{complete}/{target}</h1>
		</div>
	)
}

export default Activity