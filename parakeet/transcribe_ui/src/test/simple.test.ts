import { describe, test, expect } from 'vitest'

describe('Simple validation test', () => {
  test('basic arithmetic', () => {
    expect(2 + 2).toBe(4)
  })
  
  test('string operations', () => {
    expect('hello'.toUpperCase()).toBe('HELLO')
  })
})