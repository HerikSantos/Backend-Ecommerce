interface IEncrypterHash {
    hash: (password: string) => string;
}

export type { IEncrypterHash };
