const { expect } = require('@jest/globals')
const {cresc, countLetters, findNum} = require('./functions')

it('Sort the array in ascending order', () => {
  expect(cresc(2, 5, 6, 5)).toEqual(expect.arrayContaining([2,5,5,6]))
})

it('Counting letter e or E and returning the amount', () => {
  expect(countLetters('E', 'e', 'A', 'b', 'c')).toBe(2)
})

it('Finding number 10 and returning the index, if not found, return -1', () => {
  expect(findNum(54, 22, 14, 21, 20, 284)).toBe(-1)
})