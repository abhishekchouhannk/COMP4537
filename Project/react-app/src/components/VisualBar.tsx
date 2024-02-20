// import React from 'react';

// Define Props interface
interface Props {
  targetProgress: number;
  actualProgress: number;
}

const VisualBar = ({ targetProgress, actualProgress }: Props) => {
  // Calculate the width of each segment based on the total width and progress percentages

	// the logic may seem flipped but this is how it has to be done in UI
  const actualWidth = `${actualProgress}%`;
  const targetWidth = `${targetProgress - actualProgress}%`;
	const totalWidth = `${75}%`

	console.log('targetWidth', targetWidth);
	console.log('actualWidth', actualWidth);

  return (
		<div className="progress" style={{ width: totalWidth }}>
  		<div className="progress-bar bg-success" style={{	width: actualWidth }}>
  		</div>
  		<div className="progress-bar bg-warning" style={{ width: targetWidth }}>
  		</div>
		</div>
  )
}

export default VisualBar


