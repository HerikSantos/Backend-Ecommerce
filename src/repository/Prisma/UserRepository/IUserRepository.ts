import { type IDbUser } from "../../../entities/interfaces";

interface IUser {
    name: string;
    lastName: string;
    email: string;
    password: string;
}

interface IUserRepository {
    add: (user: IUser) => Promise<IDbUser>;
    findById: (id: string) => Promise<IDbUser>;
    findByEmail: (email: string) => Promise<IDbUser | null>;
}

export type { IUserRepository };
