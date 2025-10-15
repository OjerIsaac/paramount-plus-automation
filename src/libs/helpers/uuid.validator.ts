export const UUID_REGEX =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;

export const monthYearRegex = /^(0[1-9]|1[0-2])-\d{2}$/;

export const yearRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{2}$/;

export function validateUUID(uuid: string): boolean {
  return UUID_REGEX.test(uuid);
}

export function validateMonthYear(date: string): boolean {
  return monthYearRegex.test(date);
}
