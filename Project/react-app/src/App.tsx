import './App.css'; // Import the CSS file

import Project from "./components/Project";

function App() {

  const projects = [
    {
      projectNum: 1,
      activitiesCompleted: 4,
      activitiesTotal: 16,
      percentTarget: 30,
      percentActual: 30,
      projectDate: 'Dec 20, 2024'
    },
    {
      projectNum: 2,
      activitiesCompleted: 10,
      activitiesTotal: 20,
      percentTarget: 70,
      percentActual: 20,
      projectDate: 'Dec 21, 2024'
    },
    {
      projectNum: 3,
      activitiesCompleted: 8,
      activitiesTotal: 12,
      percentTarget: 40,
      percentActual: 10,
      projectDate: 'Dec 22, 2024'
    },
    {
      projectNum: 4,
      activitiesCompleted: 15,
      activitiesTotal: 25,
      percentTarget: 70,
      percentActual: 40,
      projectDate: 'Dec 21, 2024'
    },
    {
      projectNum: 5,
      activitiesCompleted: 6,
      activitiesTotal: 10,
      percentTarget: 50,
      percentActual: 40,
      projectDate: 'Dec 24, 2024'
    }
  ];
  

  return (

    <div className='project-container'>
      {projects.map((project, index) => (
        <Project
          key={index} // Ensure each component has a unique key
          projectNum={project.projectNum}
          activitiesCompleted={project.activitiesCompleted}
          activitiesTotal={project.activitiesTotal}
          percentTarget={project.percentTarget}
          percentActual={project.percentActual}
          projectDate={project.projectDate}
        />
      ))}
    </div>    
  )
}

export default App;
