import { z } from 'zod'
import { itemsSchema } from './createItem.schema'
import {dealsSchema} from './createDeal.schema'

const safeDate = z.preprocess((val) => {
  if (val === '' || val === null) return undefined
  return val
}, z.coerce.date())

const safeNumber = z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return undefined

  const num = Number(val)

  return isNaN(num) ? undefined : num
}, z.number())


const timelineSchema = z.object({
  timeFrame: z.string(),
  progress: safeNumber,
  assignedTo: z.string(),
  timelineScopeItems: z.object({
    create: z.array(
      z.object({
        scope: z.string()
      })
    )
  })
})


const timelinesSchema = z
  .array(timelineSchema)
  .transform(timelines =>
  (timelines ?? []).filter(t => t.timeFrame.trim() !== '')
)

const baseProposalSchema = z.object({
    clientId: z.coerce.number({
        invalid_type_error: "Select a client",
      })
      .refine(val => val > 0, {
        message: "Select a client",
    }),
    clientType: z.string().min(1),
    proposalTitle: z.string().min(1, 'Title is required'),
    executiveSummary: z.string().optional(),
    goalsAndObjectives: z.string().optional(),
    execVideoUrl: z.union([
            z.string().url(),
            z.literal('')
        ]).optional(),

    proposedSolution: z.string().optional(),
    proposalDescription: z.string().optional(),

    //basePrice for SLA Offer
    subtotal: z.coerce.number().optional(),

    discountType: z.enum(['Percent', 'Fixed', 'None']).optional(),
    discountValue: safeNumber.optional(),
    discountDescription: z.string().optional(),
    taxableAmount: safeNumber.optional(),
    isMultipleChoice: z.boolean(),
    taxApplicable: z.boolean().optional(),
    taxRate: safeNumber.optional(),
    taxAmount: safeNumber.optional(),
    taxReason: z.string().optional(),
    finalPrice: safeNumber.optional(),
    paymentTerms: z.string().optional(),
    timelines: timelinesSchema.optional(),
    }).refine((data) => {
            if (!data.discountType) return true
            if (data.discountType === 'Percent') {
                return data.discountValue != null && data.discountValue <= 100
            }
            if (data.discountType === 'Fixed') {
                return data.discountValue != null
            }
            return true
        }, {
            message: 'Invalid discount configuration',
            path: ['discountValue'],
      }).passthrough()

const slaProposalSchema = baseProposalSchema.extend({
  proposalType: z.literal('SLA Proposal'),
  basePrice: z.coerce.number().optional(),
  slaPackage: z.string().min(1, 'Proposal package is required'),
  deals: dealsSchema.optional(),
  items: z.array(z.any()).optional(),
})

// Product
const productProposalSchema = baseProposalSchema.extend({
  proposalType: z.literal('Product Proposal'),
  offerEntries: itemsSchema.optional()
})

// Service
const serviceProposalSchema = baseProposalSchema.extend({
  proposalType: z.literal('Service Proposal'),
  offerEntries: itemsSchema.optional()
})

export const proposalSchema = z.discriminatedUnion('proposalType', [
  slaProposalSchema,
  productProposalSchema,
  serviceProposalSchema,
])