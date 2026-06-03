import {prisma} from  '@/lib/prisma'

export async function recordActivity({
    action,
    userId,
    title,
    message,
    entityType,
    entityId, //unique identifier of entity
}){  

    const notifiableActions = [
        'proposal_sent',
        'proposal_viewed',
        'proposal_accepted',
        'proposal_rejected'

    ]

    const shouldNotify = notifiableActions.includes(action)

    try{

        const result = await prisma.$transaction(async (tx) => {

            const user = await tx.user.findUnique({
                where: {userId},
                select: {
                    firstName: true,
                    lastName: true,
                    role: {select: {role: true}}
                }
            })

            if (!user) {
                throw new Error(`User ${userId} not found`)
            }

            const userName = `${user.firstName} ${user.lastName} `

            const metaData = {
                message,
                executor: userName,
            }
            const activity = await tx.activitylogs.create({
                data: {
                    entityType,
                    entityId,
                    action,
                    performedBy: userId,
                    performedByRole: user.role.role,
                    metaData
                }
            })

            let successPayload = {
                activity
            }

            if(shouldNotify){
                const notification = await tx.notification.create({
                    data: {
                        userId,
                        title,
                        message,
                        entityType,
                        entityId,
                        notificationType: action
                    }
                })

                successPayload.notification = notification
            }

            return successPayload
        })
        
        return result

    }catch(err){
        console.error('Error creating activity', err)        
        throw new Error('Error creating activity')
    }
}