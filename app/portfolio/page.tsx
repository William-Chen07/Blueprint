import PortfolioEditor from "@/components/portfolio-editor";
import { getProjects } from "@/lib/github";

export default function PortfolioPage() {
  return <PortfolioEditor projects={getProjects()} />;
}
