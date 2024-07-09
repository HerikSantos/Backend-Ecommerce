import { type IDbUser } from "../../../entities/interfaces";
import { type IUserRepository } from "../../../repository/Prisma/IUserRepository";
import { type IEmailValidator } from "../../protocols/IEmailValidator";
import { type IEncrypterHash } from "../../protocols/IEncrypterHash";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { type IUser } from "./interfaces";

interface ITypesSut {
    sut: CreateUserUseCase;
    emailValidatorStub: IEmailValidator;
    encrypterHash: IEncrypterHash;
    userRepositoryStub: IUserRepository;
}
let repository: IDbUser[];

function makeUserRepository(): IUserRepository {
    class UserRepositoryStub implements IUserRepository {
        async add(user: IUser): Promise<IDbUser> {
            const newUser: IDbUser = { ...user, id: "valid_id" };
            repository.push(newUser);
            return newUser;
        }

        async findById(id: string): Promise<IDbUser> {
            const user = repository.find((user) => user.id === id);
            if (!user) throw Error();
            return user;
        }

        async findByEmail(email: string): Promise<IDbUser | null> {
            const user = repository.find((user) => user.email === email);
            if (!user) return null;
            return user;
        }
    }
    return new UserRepositoryStub();
}

function makeEncrypter(): IEncrypterHash {
    class EncrypterHashStub implements IEncrypterHash {
        hash(): string {
            return "hashed_pas";
        }
    }

    return new EncrypterHashStub();
}
function makeEmailValidatorStub(): IEmailValidator {
    class EmailValidatorStub implements IEmailValidator {
        isEmail(email: string): boolean {
            return true;
        }
    }
    return new EmailValidatorStub();
}
function makeSut(): ITypesSut {
    const emailValidatorStub = makeEmailValidatorStub();
    const encrypterHash = makeEncrypter();
    const userRepositoryStub = makeUserRepository();
    const sut = new CreateUserUseCase(
        emailValidatorStub,
        encrypterHash,
        userRepositoryStub,
    );

    return { sut, emailValidatorStub, encrypterHash, userRepositoryStub };
}

describe("CreateUserUseCase", () => {
    beforeEach(() => {
        repository = [];
    });

    it("Shouuld return an error if name is invalid", async () => {
        const fakeUser = {
            name: "",
            lastName: "santos",
            email: "test@gmail.com",
            password: "123456",
            passwordConfirmation: "123456",
        };

        const { sut } = makeSut();

        await expect(sut.execute(fakeUser)).rejects.toMatchObject({
            message: "Invalid Data",
            statusCode: 400,
        });
    });

    it("Shouuld return an error if lastName is invalid", async () => {
        const fakeUser = {
            name: "herik",
            lastName: "",
            email: "test@gmail.com",
            password: "123456",
            passwordConfirmation: "123456",
        };

        const { sut } = makeSut();

        await expect(sut.execute(fakeUser)).rejects.toMatchObject({
            message: "Invalid Data",
            statusCode: 400,
        });
    });

    it("Shouuld return an error if email is invalid", async () => {
        const fakeUser = {
            name: "teste",
            lastName: "da silva",
            email: "",
            password: "123456",
            passwordConfirmation: "123456",
        };

        const { sut } = makeSut();

        await expect(sut.execute(fakeUser)).rejects.toMatchObject({
            message: "Invalid Data",
            statusCode: 400,
        });
    });

    it("Shouuld return an error if password is invalid", async () => {
        const fakeUser = {
            name: "test",
            lastName: "da silva",
            email: "test@gmail.com",
            password: "",
            passwordConfirmation: "123456",
        };

        const { sut } = makeSut();

        await expect(sut.execute(fakeUser)).rejects.toMatchObject({
            message: "Invalid Data",
            statusCode: 400,
        });
    });

    it("Shouuld return an error if lastName is invalid", async () => {
        const fakeUser = {
            name: "test",
            lastName: "da silva",
            email: "test@gmail.com",
            password: "123456",
            passwordConfirmation: "",
        };

        const { sut } = makeSut();

        await expect(sut.execute(fakeUser)).rejects.toMatchObject({
            message: "Invalid Data",
            statusCode: 400,
        });
    });

    it("Should return a throw if password is different passwordConfirmation", async () => {
        const fakeUser = {
            name: "test",
            lastName: "da silva",
            email: "test@gmail.com",
            password: "123456",
            passwordConfirmation: "123",
        };

        const { sut } = makeSut();

        await expect(sut.execute(fakeUser)).rejects.toMatchObject({
            message: "Password and password confirmation must be equal",
            statusCode: 400,
        });
    });

    it("Should call emailValidator with correct values", async () => {
        const { sut, emailValidatorStub } = makeSut();

        const fakeUser = {
            name: "test",
            lastName: "da silva",
            email: "test@gmail.com",
            password: "123456",
            passwordConfirmation: "123456",
        };

        const emailValidatorSpy = jest.spyOn(emailValidatorStub, "isEmail");

        await sut.execute(fakeUser);

        expect(emailValidatorSpy).toHaveBeenCalledWith(fakeUser.email);
    });

    it("Should return a throw if email is not valid", async () => {
        const fakeUser = {
            name: "test",
            lastName: "da silva",
            email: "test.com",
            password: "123456",
            passwordConfirmation: "123456",
        };

        const { sut, emailValidatorStub } = makeSut();

        jest.spyOn(emailValidatorStub, "isEmail").mockReturnValueOnce(false);

        await expect(sut.execute(fakeUser)).rejects.toMatchObject({
            message: "Email is not valid",
            statusCode: 400,
        });
    });

    it("Should call encrypterHash with correct values", async () => {
        const { sut, encrypterHash } = makeSut();

        const fakeUser = {
            name: "test",
            lastName: "da silva",
            email: "test@gmail.com",
            password: "123456",
            passwordConfirmation: "123456",
        };

        const encrypterSpy = jest.spyOn(encrypterHash, "hash");

        await sut.execute(fakeUser);

        expect(encrypterSpy).toHaveBeenCalledWith(fakeUser.password);
    });

    it("Should call userRepository with correct values", async () => {
        const { sut, userRepositoryStub } = makeSut();

        const fakeUser = {
            name: "test",
            lastName: "da silva",
            email: "test@gmail.com",
            password: "123456",
            passwordConfirmation: "123456",
        };

        const peito = {
            name: "test",
            lastName: "da silva",
            email: "test@gmail.com",
            password: "hashed_pas",
        };

        const userRepositorySpy = jest.spyOn(userRepositoryStub, "add");

        await sut.execute(fakeUser);

        expect(userRepositorySpy).toHaveBeenCalledWith(peito);
    });

    it("Should return a correct user if create was sucess", async () => {
        const { sut } = makeSut();

        const fakeUser = {
            name: "test",
            lastName: "da silva",
            email: "test@gmail.com",
            password: "123456",
            passwordConfirmation: "123456",
        };

        const createdUser = await sut.execute(fakeUser);

        expect(createdUser).toHaveProperty("id");
    });

    it("Should return a correct user findById", async () => {
        const { sut, userRepositoryStub } = makeSut();

        const fakeUser = {
            name: "test",
            lastName: "da silva",
            email: "test@gmail.com",
            password: "123456",
            passwordConfirmation: "123456",
        };

        const createdUser = await sut.execute(fakeUser);
        const findedUser = await userRepositoryStub.findById(createdUser.id);

        expect(createdUser).toEqual(findedUser);
    });

    it("Should return a thorw if user email already exists", async () => {
        const { sut } = makeSut();

        const fakeUser = {
            name: "test",
            lastName: "da silva",
            email: "test@gmail.com",
            password: "123456",
            passwordConfirmation: "123456",
        };

        await sut.execute(fakeUser);
        await expect(sut.execute(fakeUser)).rejects.toMatchObject({
            message: "User already exits",
            statusCode: 400,
        });
    });
});
