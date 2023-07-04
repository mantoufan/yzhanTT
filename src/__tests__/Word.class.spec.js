const Word = require('../lib/Word.class')

describe('Word', () => {
  describe('run()', () => {
    it('should move the word downwards by one row', () => {
      const matrix = [[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']]
      const word = new Word(matrix, 10, 3)
      word.y = 1
      expect(word.run()).toEqual(true)
      expect(matrix[2].join('').replace(/(' '|\x1B\[\S+m)/g, '').length > 0).toBe(true)
      expect(word.y).toEqual(2)
    })
    it('should destroy the word when it reaches the bottom of the matrix', () => {
      const matrix = [[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']]
      const word = new Word(matrix, 10, 3)
      word.y = 2
      expect(word.run()).toEqual(false)
      expect(word.y).toBeNull()
    })
  })

  describe('type()', () => {
    it('should return true when the typed character matches the next character of the word', () => {
      const matrix = [[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']]
      const word = new Word(matrix, 10, 3)
      let flag = false, i = -1
      while (++i < 30) {
        for (let charCode = 97; charCode < 123; charCode++) {
          if (flag = word.type(charCode)) break
        }
      }
      expect(flag).toEqual(true)
    })
    it('should return false when the typed character does not match the next character of the word', () => {
      const matrix = [[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']]
      const word = new Word(matrix, 10, 3)
      expect(word.type('~'.charCodeAt(0))).toEqual(false)
    })
  })
})