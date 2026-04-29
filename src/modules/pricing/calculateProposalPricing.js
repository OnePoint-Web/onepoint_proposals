function roundToTwo(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function calculateProposalPricing({
  proposalType,
  items = [],
  discountType,
  discountValue,
  taxApplicable,
  taxRate,
  basePrice,
}) {

  console.log(basePrice, proposalType)
  let subtotal = 0
  let totalItemDiscount = 0
  let baseAmount = 0

  // STEP 1: Base amount

  if (proposalType === 'SLA Proposal') {
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

  const totalEnteredItemDiscount = items.reduce((sum, item) => {
    if (!item.discountValue) return sum

    if (item.discountType === 'Percentage') {
      const itemTotal = item.itemPrice * item.quantity
      return sum + (itemTotal * (item.discountValue / 100))
    }

    if (item.discountType === 'Fixed') {
      return sum + item.discountValue
    }

    return sum
  }, 0)

  const calculateTotalEnteredGlobalDiscount = () => {
    if(discountType === 'Percentage'){
      const totalEnteredAmount = baseAmount *( discountValue / 100);
      return Number(totalEnteredAmount)
    }

    if(discountType === 'Fixed'){
      return Number(discountValue)
    }

    return 0
}

const totalEnteredGlobalDiscount = calculateTotalEnteredGlobalDiscount();

const totalDiscountAmount = totalEnteredGlobalDiscount + totalEnteredItemDiscount;

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

  
  const totalAppliedDiscount = Number(globalDiscountAmount + totalItemDiscount)

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
  subtotal: roundToTwo(subtotal),
  totalItemDiscount: roundToTwo(totalItemDiscount),
  baseAmount: roundToTwo(baseAmount),
  globalDiscountAmount: roundToTwo(globalDiscountAmount),
  afterGlobalDiscount: roundToTwo(afterGlobalDiscount),
  taxableAmount: roundToTwo(afterGlobalDiscount),
  taxAmount: roundToTwo(taxAmount),
  finalPrice: roundToTwo(finalPrice),

  totalEnteredItemDiscount: roundToTwo(totalEnteredItemDiscount),
  totalEnteredGlobalDiscount: roundToTwo(totalEnteredGlobalDiscount),

  totalDiscountAmount: roundToTwo(totalDiscountAmount),
  totalAppliedDiscount: roundToTwo(totalAppliedDiscount)
  }
}