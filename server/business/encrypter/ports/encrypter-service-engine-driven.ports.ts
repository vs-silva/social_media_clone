export interface EncrypterServiceEngineDrivenPorts {
    hashPasswordSync(password: string, saltRounds: number): string;
    comparePasswords(password: string, existentPassword: string): Promise<boolean>;
}
