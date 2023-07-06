export interface EncrypterServiceDriverPorts {
    hashPassword(password: string): string | null;
}
