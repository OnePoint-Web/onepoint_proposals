export function calculateProposalPricing({
  proposalType,
  items = [],
  discountType,
  discountValue,
  taxApplicable,
  taxRate,
  basePrice
}) {
  let subtotal = 0
  let totalItemDiscount = 0
  let baseAmount = 0

  // STEP 1: Base amount

  if (proposalType === 'SLA') {
    subtotal = basePrice || 0
    baseAmount = subtotal
  } else {
    subtotal = items.reduce(
      (sum, item) => sum + item.itemPrice * item.quantity,
      0
    )

    totalItemDiscount = items.reduce((sum, item) => {
      const itemTotal = item.itemPrice * item.quantity

      if (!item.discountValue) return sum

      if (item.discountType === 'Percentage') {
        const discount = itemTotal * (item.discountValue / 100)
        return sum + Math.min(itemTotal, discount)
      }

      if (item.discountType === 'Fixed') {
        return sum + Math.min(itemTotal, item.discountValue)
      }

      return sum
    }, 0)

    baseAmount = subtotal - totalItemDiscount
  }

  // STEP 2: Global discount

  let globalDiscountAmount = 0

  if (discountValue) {
    if (discountType === 'Percentage') {
      globalDiscountAmount =
        baseAmount * (discountValue / 100)
    } else if (discountType === 'Fixed'){
      globalDiscountAmount = discountValue
    } else {
      globalDiscountAmount = 0
    }
  }

  globalDiscountAmount = Math.min(baseAmount, globalDiscountAmount)

  const afterGlobalDiscount = Math.max(
    0,
    baseAmount - globalDiscountAmount
  )

  // STEP 3: Tax

  const taxAmount =
    taxApplicable && taxRate
      ? afterGlobalDiscount * (taxRate / 100)
      : 0

  const finalPrice = afterGlobalDiscount + taxAmount

  return {
    subtotal,
    totalItemDiscount,
    baseAmount, //price after item discounts  
    globalDiscountAmount,
    afterGlobalDiscount,
    taxAmount,
    finalPrice
  }
}