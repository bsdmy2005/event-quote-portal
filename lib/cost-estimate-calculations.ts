export type CostEstimateItemInput = {
  unitCost: number;
  quantity: number;
  markupPercent: number;
};

export type CostEstimateSummary = {
  supplierNetTotal: number;
  markupTotal: number;
  managementFeeTotal: number;
  vatTotal: number;
  finalClientTotal: number;
};

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculateItem(input: CostEstimateItemInput) {
  const supplierSubtotal = round2(input.unitCost * input.quantity);
  const markupValue = round2(supplierSubtotal * (input.markupPercent / 100));
  const clientPrice = round2(supplierSubtotal + markupValue);
  return { supplierSubtotal, markupValue, clientPrice };
}

export function calculateCostEstimateSummary(params: {
  items: Array<{ supplierSubtotal: number; markupValue: number }>;
  managementFeePercent: number;
  vatPercent: number;
  vatEnabled?: boolean;
}): CostEstimateSummary {
  const supplierNetTotal = round2(params.items.reduce((acc, i) => acc + i.supplierSubtotal, 0));
  const markupTotal = round2(params.items.reduce((acc, i) => acc + i.markupValue, 0));
  const preFeeTotal = round2(supplierNetTotal + markupTotal);
  const managementFeeTotal = round2(preFeeTotal * (params.managementFeePercent / 100));
  const preVatTotal = round2(preFeeTotal + managementFeeTotal);
  const vatTotal = params.vatEnabled === false ? 0 : round2(preVatTotal * (params.vatPercent / 100));
  const finalClientTotal = round2(preVatTotal + vatTotal);

  return {
    supplierNetTotal,
    markupTotal,
    managementFeeTotal,
    vatTotal,
    finalClientTotal,
  };
}
