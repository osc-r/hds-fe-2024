export const requiredField = (val: any) => {
  if ([undefined, null, "", NaN].includes(val)) return "*Required";
  return undefined;
};

export const moreThan = (target: number) => (val: any) => {
  if (val <= target) return `*Must be bigger than ${target}`;
  return undefined;
};
