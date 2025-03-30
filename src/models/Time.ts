/**
 * These types were put here in order to hide the eyesores.
 *
 * This is very ugly and janky way of doing things, however,
 * it's not like the definition of an hour or minute will be
 * changing any time soon, so this works in the mean time.
 *
 * I intend on writing a function to accept the time values
 * and return a string in order to respect preferences like
 * 24 vs. 12 hour time. This way, in the future, that function
 * can be rewritten to use Dates or something else and require
 * minimal changes to their components.
 */

/**
 * An integer that is a valid hour between 0 and 23.
 */
export type Hour =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23;

/**
 * An integer that is a valid minute between 0 and 59.
 */
export type Minute =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40
  | 41
  | 42
  | 43
  | 44
  | 45
  | 46
  | 47
  | 48
  | 49
  | 50
  | 51
  | 52
  | 53
  | 54
  | 55
  | 56
  | 57
  | 58
  | 59;
