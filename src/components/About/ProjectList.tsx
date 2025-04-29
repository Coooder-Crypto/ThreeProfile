import ProjectCard from "./ProjectCard";
import { VerticalTimeline } from "react-vertical-timeline-component";
import 'react-vertical-timeline-component/style.min.css';
import { MyProjects } from "@/assets";
import { motion } from "framer-motion";

const ProjectList = () => {
  return (
    <>
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className='sm:px-16 px-6 relative z-0 mx-auto max-w-7xl'
      >
        <div className="flex flex-col p-4">
          <VerticalTimeline>
            {MyProjects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </VerticalTimeline>
        </div>
      </motion.section>
    </>
  );
};

export default ProjectList;
