export const formatToSlug = (val: string): string =>
  val
    .replace(/ /g, `-`)
    .replace(/[^\w-]+/g, ``)
    .toLowerCase()
