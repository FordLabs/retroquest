import { validatePassword, validateTeamName } from './StringUtils';

describe('String Utils', () => {
  const emptyTeamNameError = 'Please enter a team name.';
  const specialCharacterError = 'Please enter a team name without any special characters.';

  it.each([
    ['', emptyTeamNameError],
    [null, emptyTeamNameError],
    [undefined, emptyTeamNameError],
    ['!', specialCharacterError],
    ['@', specialCharacterError],
    ['-', specialCharacterError],
    ['_', specialCharacterError],
    ['\\', specialCharacterError],
    ['a', undefined],
    ['1', undefined],
    ['a1', undefined],
  ])('validating team name "%s" should return error message "%s"', (teamName, error) => {
    expect(validateTeamName(teamName)).toBe(error);
  });

  const emptyPasswordError = 'Please enter a password.';
  const minLengthError = 'Password must be at least 8 characters.';
  const lowercaseError = 'Password must contain at least one lower case letter.';
  const uppercaseError = 'Password must contain at least one upper case letter.';
  const numberError = 'Password must contain at least one number.';

  it.each([
    ['', emptyPasswordError],
    [null, emptyPasswordError],
    [undefined, emptyPasswordError],
    ['1', minLengthError],
    ['1234567', minLengthError],
    ['A', minLengthError],
    ['a', minLengthError],
    ['aA1', minLengthError],
    ['12345678', lowercaseError],
    ['12345678A', lowercaseError],
    ['12345678a', uppercaseError],
    ['abcdefgA', numberError],
    ['abcdefgA1', undefined],
    ["abcdefgA1#!@#$%^&*()_+}{[];'\\<>? ", undefined],
  ])('validating password %s should return error message "%s"', (password, error) => {
    expect(validatePassword(password)).toBe(error);
  });
});
