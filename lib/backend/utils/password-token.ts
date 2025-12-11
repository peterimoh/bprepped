import { v6 as uuidV6 } from 'uuid';

export function generateResetToken(email) {
  const token = uuidV6();
  console.log(token);
}

generateResetToken();
