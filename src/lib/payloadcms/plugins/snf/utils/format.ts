export const formatToSlug = (val: string): string =>
  val
    .replace(/ /g, `-`)
    .replace(/\./g, `_`) // Replace dot to underline first
    .replace(/[^\w-]+/g, ``) // Then remove other non-word characters
    .toLowerCase()
