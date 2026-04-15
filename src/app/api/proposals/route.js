import { NextResponse } from "next/server"
import { proposalSchema } from "@/schemas/proposal/createProposal.schema.js"
import prisma from "@/lib/prisma"
import {generateUniqueSlug} from '@/utils/slug.js'
import { requireUser } from "@/lib/getUserHelper"


export async function POST(req){
    try{
        const user = await requireUser()
        const body = await req.json()
    
        const postresult = proposalSchema.safeParse(body)

        if (!postresult.success) {
            console.log("ZOD ERROR:", postresult.error.flatten())
            
            return NextResponse.json(
                { error: postresult.error.flatten() },
                { status: 400 }
            )
        }

        const data = postresult.data

        const slug = await generateUniqueSlug('proposal', data.proposalTitle)
        
        const result = await prisma.proposal.create({
                data: {
                    slug,
                    clientId: data.clientId,
                    clientType: data.clientType,
                    proposalTitle: data.proposalTitle,
                    proposalType: data.proposalType,
                    executiveSummary: data.executiveSummary,
                    goalsAndObjectives: data.goalsAndObjectives,
                    execVideoUrl: data.execVideoUrl,
                    proposedSolution: data.proposedSolution,
                    proposalDescription: data.proposalDescription,
                    createdBy: user.userId,
                    statusId: 1,
                    timelines:  {create: data.timelines},
                    selectedMembers: {create: data.selectedMembers},
                    slaOffers: {create: data.slaOffers},
                    serviceProductOffers: {create: data.serviceProductOffers}
                    
                },

                include: {
                    timelines: {
                        include: {
                            timelineScopeItems: true
                        }
                    }, 
                    selectedMembers: true,
                    slaOffers: {
                        include: {
                            packageDealItem: {
                               include: { packageDealEntries: true}
                            }
                        }
                    },
                    serviceProductOffers: {
                        include: {
                            offerEntries: true
                        }
                    }

                },
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


export async function GET(req) {
  try {
    const proposals = await prisma.proposal.findMany({
      where: {
        statusId: {
          not: 7,
        },
      },
      select: {
        proposalId: true,
        slug: true,
        clientId: true,
        proposalTitle: true,
        proposalType: true,
        proposalStatus: true,
        dateCreated: true,
        statusUpdated: true,

        clientProfile: {
          select: {
            clientId: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                userEmail: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(proposals)
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch proposal" },
      { status: 500 }
    )
  }
}