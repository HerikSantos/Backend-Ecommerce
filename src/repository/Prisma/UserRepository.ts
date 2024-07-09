import { type IDbUser } from "../../entities/interfaces";
import { type IUserRepository } from "./IUserRepository";

interface IUser {
    name: string;
    lastName: string;
    email: string;
    password: string;
}

class UserRepository implements IUserRepository {
    add: (user: IUser) => Promise<IDbUser>;
    findById: (id: string) => Promise<IDbUser>;
    findByEmail: (email: string) => Promise<IDbUser>;
}

export { UserRepository };
