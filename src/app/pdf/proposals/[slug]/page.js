import styles from "./page.module.scss";
import CoverPage from "./components/CoverPage";
import ExecutiveSummary from "./components/ExecutiveSummary";
import GoalsAndObjectives from "./components/GoalsAndObjectives";
import ProposedSolution from "./components/Solution";
import OurTeam from "./components/OurTeam";
import OurApproach from "./components/OurApproach";
import ProposedBudget from "./components/ProposedBudget";
import { getIndividualProposalBySlug } from "@/lib/proposals";

export default async function ProposalPDF({ params }) {
  const { slug } = await params;
  const proposal = await getIndividualProposalBySlug(slug);

  if (!proposal) {
    return <div style={{ color: 'black' }}>Proposal not found</div>;
  }

  return (
    <>
      <div className={styles['pdf-bg']} />
      <div className={styles["pdf-page"]}>
        <CoverPage proposal={proposal} />
        <ExecutiveSummary proposal={proposal} />
        <GoalsAndObjectives proposal={proposal} />
        <ProposedSolution proposal={proposal} />

        {proposal.selectedMembers?.length > 0 && (
          <OurTeam proposal={proposal} />
        )}

        {proposal.timelines?.length > 0 && (
          <OurApproach proposal={proposal} />
        )}

        <ProposedBudget proposal={proposal} />
      </div>
    </>
  );
}
