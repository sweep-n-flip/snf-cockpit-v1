import stringUtils from '../string'

describe('Date', () => {
  describe(stringUtils.shortCodeParser.name, () => {
    it('should return parsed text', () => {
      const missingWord = 'here'
      expect(stringUtils.shortCodeParser('my text {{here}}', { here: missingWord })).toBe(
        'my text here',
      )
    })
  })
})
