import ProjectDetailsUp from "./ProjectDetailsUp";
import ProjectDetailsLower from "./ProjectDetailsLower";

interface Props {
  projectNum: number;
  activitiesCompleted: number;
  activitiesTotal: number;
  percentTarget: number;
  percentActual: number;
	projectDate: string
}

const Project = ({
  projectNum,
  activitiesCompleted,
  activitiesTotal,
  percentTarget,
  percentActual,
	projectDate
}: Props) => {
  return (
    <div className="projects">
      <ProjectDetailsUp
        projectNum={projectNum}
        activitiesCompleted={activitiesCompleted}
        activitiesTotal={activitiesTotal}
        percentTarget={percentTarget}
        percentActual={percentActual}
      />
      <ProjectDetailsLower 
				targetProgress={percentTarget}
				actualProgress={percentActual}
				projectDate={projectDate}
			/>
    </div>
  );
};

export default Project;
