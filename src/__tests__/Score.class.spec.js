const Score = require('../lib/Score.class')

describe('Score', () => {
  describe('add()', () => {
    it('should add the given number to the score', () => {
      const score = new Score([], 10)
      expect(score.score).toEqual(0)
      score.add(10)
      expect(score.score).toEqual(10)
      score.add(20)
      expect(score.score).toEqual(30)
    })
  })

  describe('fill()', () => {
    it('should fill the score into the matrix', () => {
      const matrix = [[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']]
      const score = new Score(matrix, 10)
      score.score = 1234
      score.fill()
      expect(matrix).toEqual([['\x1B[90ms', 'c', 'o', 'r', 'e', ':', '1', '2', '3', '4'],
                              [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']])
    })
  })
})