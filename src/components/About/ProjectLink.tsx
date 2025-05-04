const ProjectLink: React.FC<{ url: string }> = ({ url }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 mb-4 h-[50px] inline-flex items-center gap-2 text-[#915EFF] hover:text-white transition-colors duration-300"
    >
      <span className="text-[16px] font-semibold">🔗 {url}</span>
    </a>
  );
};

export default ProjectLink;
