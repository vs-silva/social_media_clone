export interface EncrypterServiceDriverPorts {
    hashPassword(password: string): string | null;
    isPasswordValid(password: string, existentPassword: string): Promise<boolean | null >;
}
