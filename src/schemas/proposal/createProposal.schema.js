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

const timelineScopeSchema = z.object({
      id: z.string().uuid(),
      description: z.string().optional(),
      startDate: safeDate,
      endDate: safeDate
    }).refine(
        (data) => {
            if (!data.startDate || !data.endDate) return true
            return data.endDate >= data.startDate
        },
        {
            message: 'End date must be after start date',
            path: ['endDate'],
    }
    )

  const scopesSchema = z
  .array(timelineScopeSchema)
  .transform(scopes =>
    scopes.filter(s =>
      s.description?.trim() ||
      s.startDate ||
      s.endDate
    )
  )
const timelineSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  progress: safeNumber.optional(),
  assigned_to: z.string().min(1, 'Assign task'),
  scopes: scopesSchema,
})

const timelinesSchema = z
  .array(timelineSchema)
  .transform(timelines =>
    timelines.filter(t => t.title.trim() !== '')
  )


const baseProposalSchema = z.object({
    id: z.string().uuid(),
    clientId: z.string().min(1, 'Client is required'),
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
    discountType: z.enum(['Percent', 'Fixed']).optional(),
    discountValue: safeNumber.optional(),
    discountDescription: z.string().optional(),
    taxableAmount: safeNumber.optional(),
    taxApplicable: z.enum(['', 'YES', 'NO']).optional(),
    taxRate: safeNumber.optional(),
    taxAmount: safeNumber.optional(),
    taxReason: z.string().optional(),
    finalPrice: safeNumber.optional(),
    paymentTerms: z.string().optional(),
    timelines: timelinesSchema.optional()
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
  })

const slaProposalSchema = baseProposalSchema.extend({
  proposalType: z.literal('SLA Proposal'),
  deals: dealsSchema,
  items: z.array(z.any()).optional(),
})

// Product
const productProposalSchema = baseProposalSchema.extend({
  proposalType: z.literal('Product Proposal'),
  items: itemsSchema,
  deals: z.array(z.any()).optional(),
})

// Service
const serviceProposalSchema = baseProposalSchema.extend({
  proposalType: z.literal('Service Proposal'),
  items: itemsSchema,
  deals: z.array(z.any()).optional(),
})

export const proposalSchema = z.discriminatedUnion('proposalType', [
  slaProposalSchema,
  productProposalSchema,
  serviceProposalSchema,
])