export type ProjectCard = {
  emoji?: string;
  title: string;
  tagline: string;
  description: string;
  tech_stack: string[];
  experience_level: string;
  estimated_time: string;
  overview: string;
  dashboard_link_label: string;
  dashboard_description: string;
  revision_invitation: string;
};
export type CoachData = {
  response_type: "question" | "project_card" | "mentoring";
  message: string;
  question: string | null;
  suggested_answers: string[];
  project: ProjectCard | null;
};

export default function CoachReply({
  data,
  isLast,
  disabled,
  onAnswer,
  fullWidth = false,
}: {
  data: CoachData;
  isLast: boolean;
  disabled: boolean;
  onAnswer: (answer: string) => void;
  fullWidth?: boolean;
}) {
  const project = data.project;
  return (
    <div className={`${fullWidth ? "" : "max-w-[85%]"} space-y-3 rounded-xl bg-[#f4ecd3] px-4 py-3 text-sm leading-snug text-[#2b2014] shadow-[0_3px_6px_rgba(0,0,0,.15)]`}>
      <p>{data.message}</p>
      {project && (
        <div className="space-y-4 border-l-4 border-[#6f2416] bg-[#fffdf5] p-5">
          <h3 className="font-serif text-2xl font-bold">
            {project.emoji ? `${project.emoji} ` : ""}
            {project.title}
          </h3>
          <p className="font-bold">{project.tagline}</p>
          <p>
            <strong>Description:</strong> {project.description}
          </p>
          <p>
            <strong>Tech stack:</strong> {project.tech_stack.join(" · ")}
            <br />
            <strong>Experience level:</strong> {project.experience_level}
            <br />
            <strong>Estimated time:</strong> {project.estimated_time}
          </p>
          <p>
            <strong>Project overview:</strong>
            <br />
            {project.overview}
          </p>
          <p>
            <strong>{project.dashboard_link_label}</strong>
            <br />
            {project.dashboard_description}
          </p>
          <p className="italic">{project.revision_invitation}</p>
        </div>
      )}
      {data.question && <p className="font-semibold">{data.question}</p>}
      {isLast && data.suggested_answers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.suggested_answers.map((answer) => (
            <button
              key={answer}
              type="button"
              disabled={disabled}
              onClick={() => onAnswer(answer)}
              className="rounded-full border border-[#8c806a] bg-[#fffdf5] px-3 py-1.5 text-xs font-semibold hover:bg-[#f6e8c5] disabled:opacity-60"
            >
              {answer}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
