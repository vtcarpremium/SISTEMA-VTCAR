
export async function hashPassword(
  password: string
): Promise<string> {
  if (typeof password !== "string" || password.length < 8) {
    throw new Error(
      "A senha precisa ter pelo menos 8 caracteres."
    );
  }

  if (password.length > 72) {
    throw new Error(
      "A senha não pode ultrapassar 72 caracteres."
    );
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new Error(
      "A senha precisa conter pelo menos um símbolo especial."
    );
  }

  return bcrypt.hash(password, 12);
}
