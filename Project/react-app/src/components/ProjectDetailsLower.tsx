import ProjectDate from './ProjectDate'
import VisualBar from './VisualBar'

interface Props {
	targetProgress: number,
	actualProgress: number,
	projectDate: string
}

const ProjectDetailsLower = (
	{
		targetProgress,
		actualProgress,
		projectDate
	} : Props
) => {
	return (
		<div className='lowerDetails'>
			<VisualBar targetProgress={targetProgress} actualProgress={actualProgress} />
			<ProjectDate projectDate={projectDate}/>
		</div>
	)
}

export default ProjectDetailsLower