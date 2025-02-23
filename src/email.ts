export function verifyEmailMessage(email: string, code: string) {
  const message = {
    to: email,
    subject: 'Verify your email address',
    text: `Your verification code is ${code}`
  };
  return message;
}
