import {prisma} from '@/lib/prisma'
import {NextResponse} from 'next/server'

export async function PUT(req, { params }){
    const data = await req.jason()
    const {id} = await params;

    const slug = await generateUniqueSlug('proposal', data.proposalTitle)

    const updatedProposal = await prisma.proposal.update({
        where: {id},

        data:{
                slug,
                clientType: data.clientType,
                proposalTitle: data.proposalTitle,
                executiveSummary: data.executiveSummary,
                goalsAndObjectives: data.goalsAndObjectives,
                execVideoUrl: data.execVideoUrl,
                proposedSolution: data.proposedSolution,
                proposalDescription: data.proposalDescription,


                timelines:  {create: data.timelines},
                selectedMembers: {create: data.selectedMembers},
                slaOffers: {create: data.slaOffers},
                serviceProductOffers: {create: data.serviceProductOffers}
        }
    })
}