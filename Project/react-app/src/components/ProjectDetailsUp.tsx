// import React from 'react'
import ProgressBar from "./ProgressBar";

interface Props {
  projectNum: number;
  activitiesCompleted: number;
  activitiesTotal: number;
  percentTarget: number;
  percentActual: number;
}

const ProjectDetailsUp = ({
  projectNum,
  activitiesCompleted,
  activitiesTotal,
  percentTarget,
  percentActual,
}: Props) => {
  return (
    <div className="upperDetails">
      <h2>Project #{projectNum}</h2>
      <ProgressBar
        activitiesCompleted={activitiesCompleted}
        activitiesTotal={activitiesTotal}
        percentTarget={percentTarget}
        percentActual={percentActual}
      />
    </div>
  );
};

export default ProjectDetailsUp;
