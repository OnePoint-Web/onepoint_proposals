import styles from "./page.module.scss";
import CoverPage from "./components/CoverPage";
import { getIndividualProposalBySlug } from "@/lib/proposals";

export default async function ProposalPDF({ params }) {

  const { slug } = await params;

 const proposal = await getIndividualProposalBySlug(slug);

  if (!proposal) {
    return <div styles={{color: 'black'}}>Proposal not found</div>;
  }
  

  return (
    <div className={styles["pdf-page"]}>
      <CoverPage />
    </div>
  );
}