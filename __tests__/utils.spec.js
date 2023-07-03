const wordList =  require('word-list-json')
const { getWord } = require('../src/lib/utils')

describe('Test getWord', () => {
  test('returns a string', () => {
    const word = getWord()
    expect(typeof word).toBe('string')
  })

  test('returns a word from the word list', () => {
    const word = getWord()
    expect(wordList).toContain(word)
  })
})