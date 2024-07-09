import { type IEmailValidator } from "../protocols/IEmailValidator";
import { type IEncrypterHash } from "../protocols/IEncrypterHash";
import { CreateUserUseCase } from "./CreateUserUseCase";

interface ITypesSut {
    sut: CreateUserUseCase;
    emailValidatorStub: IEmailValidator;
    encrypterHash: IEncrypterHash;
}
function makeEncrypter(): IEncrypterHash {
    class EncrypterHash implements IEncrypterHash {
        hash(): string {
            return "hashed_pas";
        }
    }

    return new EncrypterHash();
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
    const sut = new CreateUserUseCase(emailValidatorStub, encrypterHash);
    return { sut, emailValidatorStub, encrypterHash };
}

describe("CreateUserUseCase", () => {
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
});
