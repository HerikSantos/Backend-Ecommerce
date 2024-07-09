import { type IDbUser } from "../../entities/interfaces";
import { MissingParams } from "../../errors/errors";
import { type IUserRepository } from "../../repository/Prisma/IUserRepository";
import { type IEmailValidator } from "../protocols/IEmailValidator";
import { type IEncrypterHash } from "../protocols/IEncrypterHash";
import { type ICreateUserUseCase } from "./ICreateUserUseCase";
import { type IUser } from "./interfaces";

class CreateUserUseCase implements ICreateUserUseCase {
    private readonly emailValidator: IEmailValidator;
    private readonly encrypterHash: IEncrypterHash;
    private readonly userRepository: IUserRepository;

    constructor(
        emailValidator: IEmailValidator,
        encrypterHash: IEncrypterHash,
        userRepository: IUserRepository,
    ) {
        this.emailValidator = emailValidator;
        this.encrypterHash = encrypterHash;
        this.userRepository = userRepository;
    }

    async execute(data: any): Promise<IDbUser> {
        const { name, lastName, email, password, passwordConfirmation } =
            data as IUser;

        if (
            !name ||
            !lastName ||
            !email ||
            !password ||
            !passwordConfirmation
        ) {
            throw new MissingParams("Invalid Data", 400);
        }

        if (password !== passwordConfirmation) {
            throw new MissingParams(
                "Password and password confirmation must be equal",
                400,
            );
        }

        if (!this.emailValidator.isEmail(email)) {
            throw new MissingParams("Email is not valid", 400);
        }

        const passwordHashed = this.encrypterHash.hash(password);

        const createdUser = await this.userRepository.add({
            name,
            lastName,
            email,
            password: passwordHashed,
        });

        return createdUser;
    }
}

export { CreateUserUseCase };
