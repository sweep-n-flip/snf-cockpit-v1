import BigNumber from 'bignumber.js'

export class Helpers {
  /**
   * Format a number to a locale string
   * @param value The value to format
   * @param precision The precision to use
   * @returns The formatted value
   */
  formatToLocaleString(value: BigNumber | string, precision = 2): string {
    if (typeof value === 'string') {
      value = new BigNumber(value)
    }

    return value.toFormat(precision)
  }
}

export const helpers = new Helpers()
