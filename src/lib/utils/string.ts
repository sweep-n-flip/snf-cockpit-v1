export type Shortcode<T> = {
  [key: string]: T
}

const shortCodeParser = <
  T extends {
    [key: string]: string | number | undefined
  },
>(
  text: string,
  shortcode: T,
) => {
  return text
    ? text.replace(/\{\{(.[^}]+)\}\}/g, (_, match) => (match ? shortcode[match] : match))
    : ''
}

export const stringUtils = {
  shortCodeParser,
}

export default stringUtils
