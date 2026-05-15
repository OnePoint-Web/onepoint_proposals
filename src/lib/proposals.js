import { prisma } from "@/lib/prisma";

  export async function getIndividualProposalBySlug(slug){
  
  const formatDate = (date) => {
    if (!date) return null;

    const d = new Date(date);

    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    }

    const proposalData = await prisma.proposal.findUnique({
      where: { slug },
        include: {
            timelines: {
            include: {
                timelineScopeItems: true
            }
        },
            slaOffers: {
                include: {
                    packageDealItem: {
                        include: {
                            packageDealEntries: true
                        }
                    }
                }
            },
            serviceProductOffers: {
                include : {
                    offerEntries: true
                }
            },
            selectedMembers: {
                include: {
                    teamMember: {
                        select: {
                        memberName: true,
                        memberRole: true,
                        memberImage: true,
                        description: true
                        }
                    }
                }
            },
            clientProfile: {
                include: {
                    user: {
                        select: {
                            userId: true,
                            firstName: true,
                            lastName: true,
                            userEmail: true,
                            username: true
                        }
                    }
                }
            }
        }
      },
    );  

    const cleanedData = {
    ...proposalData,
    dateCreated: formatDate(proposalData.dateCreated),
    slaOffers: proposalData.slaOffers.map(offer => ({
        ...offer,
        finalPrice: offer.finalPrice?.toNumber(),
        taxAmount: offer.taxAmount?.toNumber(),
        taxableAmount: offer.taxableAmount?.toNumber(),
        discountValue: offer.discountValue?.toNumber(),
        basePrice:  offer.basePrice?.toNumber(),
        taxRate:  offer.taxRate?.toNumber(),
    })),
    serviceProductOffers: proposalData.serviceProductOffers.map(offer => ({
        ...offer,
        subTotal: offer.subTotal?.toNumber(),
        finalPrice: offer.finalPrice?.toNumber(),
        taxAmount: offer.taxAmount?.toNumber(),
        taxableAmount: offer.taxableAmount?.toNumber(),
        discountValue: offer.discountValue?.toNumber(),
        taxRate:  offer.taxRate?.toNumber(),
        offerEntries: offer.offerEntries.map(e => ({
            ...e,
            itemPrice: e.itemPrice?.toNumber(),
            totalPrice: e.totalPrice?.toNumber(),
            itemDiscountValue: e.itemDiscountValue?.toNumber(),
        }))
    }))
    }   

    console.log(cleanedData)

     return cleanedData;
}


