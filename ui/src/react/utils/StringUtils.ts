export const BOARD_NAME_REGEX = /^[A-Za-z0-9 ]+$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export const LOWERCASE_REGEX = /^.*[a-z]+.*$/;
export const UPPERCASE_REGEX = /^.*[A-Z]+.*$/;
export const NUMBER_REGEX = /^.*\d+.*$/;

export function validateBoardName(board: string): string | undefined {
  if (!board) {
    return 'Please enter a board name.';
  } else if (!board.match(BOARD_NAME_REGEX)) {
    return 'Please enter a board name without any special characters.';
  }
}

export function validatePassword(password: string): string | undefined {
  if (!password) {
    return 'Please enter a password.';
  } else if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  } else if (!password.match(LOWERCASE_REGEX)) {
    return 'Password must contain at least one lower case letter.';
  } else if (!password.match(UPPERCASE_REGEX)) {
    return 'Password must contain at least one upper case letter.';
  } else if (!password.match(NUMBER_REGEX)) {
    return 'Password must contain at least one number.';
  }
}
