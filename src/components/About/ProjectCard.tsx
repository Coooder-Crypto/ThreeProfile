import { TProject } from "@/types";
import {
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import 'react-vertical-timeline-component/style.min.css';

const ProjectCard: React.FC<TProject> = (project) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1d1836",
        color: "#fff",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={project.date}
      iconStyle={{ background: project.img }}
      icon={
        <div className="flex h-full w-full items-center justify-center">
          <img
            src={project.img}
            alt={project.name}
            className="h-[60%] w-[60%] object-contain"
          />
        </div>
      }
    >
      <div className="flex flex-row">
        <div>
          <div>
            <h3 className="text-[24px] font-bold text-white">
              {project.title}
            </h3>
            <p
              className="text-secondary text-[16px] font-semibold"
              style={{ margin: 0 }}
            >
              {project.name}
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
        </div>
        <div className="w-[50%]">{project.img}</div>
      </div>
    </VerticalTimelineElement>
  );
};

export default ProjectCard;
