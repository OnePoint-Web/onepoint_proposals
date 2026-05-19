import styles from "./page.module.scss";
import CoverPage from "./components/CoverPage";
import ExecutiveSummary from "./components/ExecutiveSummary";
import GoalsAndObjectives from "./components/GoalsAndObjectives";
import ProposedSolution from "./components/Solution";
import { getIndividualProposalBySlug } from "@/lib/proposals";

export default async function ProposalPDF({ params }) {

  const { slug } = await params;

 const proposal = await getIndividualProposalBySlug(slug);

  if (!proposal) {
    return <div styles={{color: 'black'}}>Proposal not found</div>;
  }
  
  console.log(proposal)

  return (
    <>
      <div class={styles['pdf-bg']}></div>

      <div className={styles["pdf-page"]}>
        <CoverPage proposal={proposal}/>
        <ExecutiveSummary proposal={proposal}/>
        <GoalsAndObjectives proposal={proposal}/>
        <ProposedSolution proposal={proposal}/>

      </div>
    </>
    
  );
}