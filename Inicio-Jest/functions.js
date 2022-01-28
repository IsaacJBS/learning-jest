const cresc = (a, b, c, d) => {
  const order = [a, b, c, d]
  return order.sort()
}

const countLetters = (a, b, c, d, e) => {
  const letters = [a, b, c, d, e]
  let count = 0

  letters.forEach(letter => {
    if(letter === 'e' || letter === 'E') {
          count += 1
        }
  })
  
  return count
}

const findNum = () => {
  const numbers = [...arguments]

  return numbers.findIndex(number => number === 10)
}

module.exports = {
  cresc,
  countLetters,
  findNum
}