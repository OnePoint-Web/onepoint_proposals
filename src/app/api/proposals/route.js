import { NextResponse } from "next/server"
import { proposalSchema } from "@/schemas/proposal/createProposal.schema.js"
import { prisma } from "@/lib/prisma"
import {generateUniqueSlug} from '@/utils/slug.js'
import { requireUser } from "@/lib/getUserHelper"
import { recordActivity } from "@/services/activity/record-activity"


export async function POST(req){
    try{
        const user = await requireUser()
        const body = await req.json()

        const postresult = proposalSchema.safeParse(body)

        if (!postresult.success) {
            return NextResponse.json(
                { error: postresult.error.flatten() },
                { status: 400 }
            )
        }

        const data = postresult.data

        const slug = await generateUniqueSlug('proposal', data.proposalTitle)

        const result = await prisma.$transaction(async (tx) => {
            const proposal = await tx.proposal.create({
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
                    timelines:  {create: data.timelines},
                    selectedMembers: {create: data.selectedMembers},
                    slaOffers: {create: data.slaOffers},
                    serviceProductOffers: {create: data.serviceProductOffers},
                    statusId: data.proposalStatus

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
            })

            await recordActivity({
                tx,
                action: 'proposal_created',
                userId: user.userId,
                title: 'Proposal Created',
                message: `Created proposal "${data.proposalTitle}"`,
                entityType: 'proposals',
                entityId: proposal.slug
            })

            return proposal
        })

        return NextResponse.json(
            { message: "Package created", ...result },
            { status: 201 }
        )

    }catch (err) {

        if (err.message === "Unauthorized") {
            return NextResponse.json(
                { error: "Session expired. Please log in again." },
                { status: 401 }
            )
        }

        if (err.code === "P2002") {
            return NextResponse.json(
                { error: "A proposal with this title was just created. Please try again." },
                { status: 409 }
            )
        }

        // Fallback for non-Prisma errors
        console.error("Unhandled error:", err)

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
        }
    }


export async function GET(req){
  try{
  const {searchParams} = new URL(req.url)

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status");
  const type = searchParams.get("type") || ""
  const clientId = searchParams.get("clientId");

  const sortBy = searchParams.get("sortBy") || "dateCreated";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const safePage = Math.max(page, 1);
  const safeLimit = Math.max(limit, 1);

  const searchTerms = search
      .trim()
      .split(" ")
      .filter(Boolean);


  const where = {
      ...(status && { proposalStatus:{status: status} }),
      ...(type && { proposalType: type }),
      ...(clientId && { clientId }),

      ...(searchTerms.length > 0 && {
        AND: searchTerms.map((term) => ({
          OR: [
            {
              proposalTitle: {
                contains: term,
              },
            },

            {
              clientProfile: {
                companyName: {
                  contains: term,
                },
              },
            },

            {
              clientProfile: {
                user: {
                  firstName: {
                    contains: term,
                  },
                },
              },
            },

            {
              clientProfile: {
                user: {
                  lastName: {
                    contains: term,
                  },
                },
              },
            },
          ],
        })),
      }),
    };

    const [proposals, total] = await Promise.all([
      prisma.proposal.findMany({
        where,

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

        skip: (safePage - 1) * safeLimit,
        take: safeLimit,

        orderBy: {
          [sortBy]: sortOrder,
        },
      }),

      prisma.proposal.count({
        where,
          }),
        ]);

        // Response
        return Response.json({
          data: proposals,
          meta: {
            total,
            page: safePage,
            limit: safeLimit,
            totalPages: Math.ceil(total / safeLimit),
          },
        });
      } catch (error) {
        console.error(error);

        return Response.json(
          {
            error: "Failed to fetch proposals",
          },
          {
            status: 500,
          }
        );
      }
}