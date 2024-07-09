import { type IDbUser } from "../../entities/interfaces";

interface IUser {
    name: string;
    lastName: string;
    email: string;
    password: string;
}

interface IUserRepository {
    add: (user: IUser) => IDbUser;
    findById: (id: string) => IDbUser;
}

export type { IUserRepository };
