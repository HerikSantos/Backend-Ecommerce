import { MissingParams } from "../../errors/errors";
import { type IEmailValidator } from "../protocols/IEmailValidator";
import { type ICreateUserUseCase } from "./ICreateUserUseCase";
import { type IUser } from "./interfaces";

class CreateUserUseCase implements ICreateUserUseCase {
    private readonly emailValidator: IEmailValidator;

    constructor(emailValidator: IEmailValidator) {
        this.emailValidator = emailValidator;
    }

    async execute(data: any): Promise<any> {
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
    }
}

export { CreateUserUseCase };
