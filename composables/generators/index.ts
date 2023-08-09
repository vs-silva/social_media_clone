function generateRandomNumber(): number {
    return Math.floor(Math.round(Math.random() * 20));
}

export const Generators = {
    generateRandomNumber
};
