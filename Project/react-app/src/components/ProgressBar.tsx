import Activity from "./Activity";
import StatBar from "./StatBar";

interface Props {
  activitiesCompleted: number;
  activitiesTotal: number;
  percentTarget: number;
  percentActual: number;
}

const ProgressBar = ({
  activitiesCompleted,
  activitiesTotal,
  percentTarget,
  percentActual,
}: Props) => {
  return (
    <div className="progressBar">
      <Activity complete={activitiesCompleted} target={activitiesTotal} />
      <StatBar target={percentTarget} actual={percentActual} />
    </div>
  );
};

export default ProgressBar;
