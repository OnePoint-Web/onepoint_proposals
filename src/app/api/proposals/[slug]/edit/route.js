import { NextResponse } from "next/server"
import { proposalSchema } from "@/schemas/proposal/createProposal.schema.js"
import prisma from "@/lib/prisma"
import {generateUniqueSlug} from '@/utils/slug.js'
import { requireUser } from "@/lib/getUserHelper"


export async function PATCH(req){
    try{

        const user = await requireUser()
        const data = await req.json()
        
        console.log('DATA', data)

        const existing = await prisma.proposal.findUnique({
            where: { proposalId: data.proposalId },
            select: { proposalTitle: true, slug: true }
        })

        let slug = existing.slug

        if (existing.proposalTitle !== data.proposalTitle) {
         slug = await generateUniqueSlug('proposal', data.proposalTitle)
        }

          const result = await prisma.proposal.update({
                where: {proposalId: data.proposalId},
                data: {
                    slug: slug,
                    clientType: data.clientType,
                    proposalTitle: data.proposalTitle,
                    proposalType: data.proposalType,
                    executiveSummary: data.executiveSummary,
                    goalsAndObjectives: data.goalsAndObjectives,
                    execVideoUrl: data.execVideoUrl,
                    proposedSolution: data.proposedSolution,
                    proposalDescription: data.proposalDescription,

                    timelines: {
                        deleteMany: {},
                        create: data.timelines || []
                    },

                    selectedMembers: {
                        deleteMany: {},
                        create: data.selectedMembers || []
                    },

                    slaOffers: data.slaOffers
                    ? {
                        deleteMany: {},
                        create: data.slaOffers
                        }
                    : undefined,

                    serviceProductOffers: data.serviceProductOffers
                    ? {
                        deleteMany: {},
                        create: data.serviceProductOffers
                        }
                    : undefined
                },

                include: {
                    timelines: {
                    include: { timelineScopeItems: true }
                    },
                    selectedMembers: true,
                    slaOffers: {
                    include: {
                        packageDealItem: {
                        include: { packageDealEntries: true }
                        }
                    }
                    },
                    serviceProductOffers: {
                    include: {
                        offerEntries: true
                    }
                    }
                }

            });

        return NextResponse.json(
            { message: "Package created", ...result },
            { status: 201 }
        )

    }catch (err) {

        // Fallback for non-Prisma errors
        console.error("Unhandled error:", err)

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
        }
    }


// export async function GET(req) {
//   try {
//     const proposals = await prisma.proposal.findMany({
//       where: {
//         statusId: {
//           not: 7,
//         },
//       },
//       select: {
//         proposalId: true,
//         slug: true,
//         clientId: true,
//         proposalTitle: true,
//         proposalType: true,
//         proposalStatus: true,
//         dateCreated: true,
//         statusUpdated: true,

//         clientProfile: {
//           select: {
//             clientId: true,
//             user: {
//               select: {
//                 firstName: true,
//                 lastName: true,
//                 userEmail: true,
//               },
//             },
//           },
//         },
//       },
//     })

//     return NextResponse.json(proposals)
//   } catch (err) {
//     return NextResponse.json(
//       { error: "Failed to fetch proposal" },
//       { status: 500 }
//     )
//   }
// }