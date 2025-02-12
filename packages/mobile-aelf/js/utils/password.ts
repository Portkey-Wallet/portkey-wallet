export const validatePassword = (password: string) => {
  const regex = /^(?=.*\d)[A-Za-z\d]{8,}$/;
  return regex.test(password);
};
