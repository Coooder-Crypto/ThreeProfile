import { ExternalLink } from "lucide-react";

const ProjectLink: React.FC<{ url: string }> = ({ url }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-2 text-[#915EFF] hover:text-white transition-colors duration-300"
    >
      <ExternalLink className="h-5 w-5" />
      <span className="text-[16px] font-semibold">{url}</span>
    </a>
  );
};

export default ProjectLink;