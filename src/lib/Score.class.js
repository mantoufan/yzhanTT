const fs = require('fs')
const path = require('path')
module.exports = class Score {
  static JSON_PATH = path.resolve(__dirname, '../data/score.json')
  constructor(matrix, width) {
    Object.assign(this, {
      score: 0,
      matrix,
      width
    })
  }
  add(num) {
    this.score += num
  }
  #len() {
    let cnt = 0, n = this.score
    while(n > 0) {
      n /= 10
      n |= 0
      cnt++
    }
    return Math.max(cnt, 1)
  }
  len() {
    return this.#len(this.score) + 6
  }
  fill() {
    const { matrix, width } = this
    const startX = width - this.len()
    const word = 'score:' + this.score
    matrix[0][startX] = '\x1b[90m' + word[0]
    for (let x = startX + 1; x < width; x++) {
      matrix[0][x] = word[x - startX]
    }
  }
  run() {
    this.fill()
  }
  write() {
    const { score } = this
    const { JSON_PATH } = Score
    const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8')) || []
    data.push({
      score,
      date: Date().toLocaleString().replace(/ GMT.+/, '')
    })
    data.sort((a, b) => b.score - a.score)
    fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2))
  }
  static read(limit) {
    const data = fs.readFileSync(this.JSON_PATH, 'utf8') || []
    return JSON.parse(data).slice(0, limit).map(({ score, date }, i) => 'No.' + (i + 1 + '').padStart(2, 0) + ' ' + ('' + score).padStart(3, 0) + ' - ' + date).join('\n')
  }
}