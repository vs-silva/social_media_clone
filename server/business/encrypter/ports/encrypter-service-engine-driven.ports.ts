export interface EncrypterServiceEngineDrivenPorts {
    hashPasswordSync(password: string, saltRounds: number): string;
}
