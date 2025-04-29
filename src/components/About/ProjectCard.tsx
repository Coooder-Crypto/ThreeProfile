import { TProject } from "@/types";
import { VerticalTimelineElement } from "react-vertical-timeline-component";
import 'react-vertical-timeline-component/style.min.css';
import ProjectLink from "./ProjectLink";

const ProjectCard: React.FC<TProject> = (project) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1d1836",
        color: "#fff",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={project.date}
      iconStyle={{
        background: "linear-gradient(135deg, #915EFF 0%, #1d8cf8 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      icon={
        <div className="h-5 w-5 rounded-full bg-white" />
      }
    >
      <div className="flex flex-col md:flex-row xl:flex-col">
        <div className="flex-1">
          <div>
            <h3 className="text-[24px] font-bold text-white">
             
              {project.name}
            </h3>
            <p
              className="text-secondary text-[16px] font-semibold"
              style={{ margin: 0 }}
            >
               {project.title}
            </p>
          </div>

          <ul className="ml-5 mt-5 list-disc space-y-2">
            {project.points.map((point, index) => (
              <li
                key={`project-point-${index}`}
                className="text-white-100 pl-1 text-[14px] tracking-wider"
              >
                {point}
              </li>
            ))}
          </ul>
          <ProjectLink url={project.url} />
        </div>
        
        <div className="mt-2 md:mt-0 md:ml-6 xl:mt-6 xl:ml-0 flex justify-center">
          <img 
            src={project.img} 
            alt={project.name}
            className="w-full md:w-[200px] xl:w-full max-w-[500px] h-auto object-contain rounded-lg"
          />
        </div>
      </div>
    </VerticalTimelineElement>
  );
};

export default ProjectCard;