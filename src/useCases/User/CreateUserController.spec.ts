import { type Response, type Request } from "express";

import { type IUser } from "../../entities/interfaces";
import { CreateUserController } from "./CreateUserController";
import { type ICreateUserUseCase } from "./ICreateUserUseCase";

function makeCreateUserUsecase(): ICreateUserUseCase {
    class CreateUserUseCaseStub implements ICreateUserUseCase {
        async execute(data: any): Promise<IUser> {
            const fakeUser: IUser = {
                id: "valid_id",
                name: "valid_name",
                lastName: "valid_lastName",
                email: "valid_email",
            };

            return fakeUser;
        }
    }

    return new CreateUserUseCaseStub();
}

interface ITypeSut {
    createUserUseCaseStub: ICreateUserUseCase;
    sut: CreateUserController;
}

function makeSut(): ITypeSut {
    const createUserUseCaseStub = makeCreateUserUsecase();
    const sut = new CreateUserController(createUserUseCaseStub);
    return {
        sut,
        createUserUseCaseStub,
    };
}

describe("CreateUserController", () => {
    it("should return 201 status code and user data on success", async () => {
        const { sut } = makeSut();
        const body = {
            name: "valid_name",
            lastName: "valid_lastName",
            email: "valid_email",
            password: "valid_password",
            passwordConfirmation: "valid_password",
        };

        const mockRequest = {} as Request;
        mockRequest.body = body;

        const mockResponse = {} as Response;
        mockResponse.status = jest.fn().mockReturnThis();
        mockResponse.json = jest.fn().mockReturnThis();

        await sut.handle(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
            id: "valid_id",
            name: "valid_name",
            lastName: "valid_lastName",
            email: "valid_email",
        });
    });

    it("should call createUserUseCase.execute with correct data", async () => {
        const { sut, createUserUseCaseStub } = makeSut();
        const body = {
            name: "valid_name",
            lastName: "valid_lastName",
            email: "valid_email",
            password: "valid_password",
            passwordConfirmation: "valid_password",
        };

        const mockRequest = {} as Request;
        mockRequest.body = body;

        const mockResponse = {} as Response;
        mockResponse.status = jest.fn().mockReturnThis();
        mockResponse.json = jest.fn().mockReturnThis();

        jest.spyOn(createUserUseCaseStub, "execute");

        await sut.handle(mockRequest, mockResponse);

        expect(createUserUseCaseStub.execute).toHaveBeenCalledWith(body);
    });

    it("should handle errors correctly", async () => {
        const { sut, createUserUseCaseStub } = makeSut();
        const body = {
            name: "valid_name",
            lastName: "valid_lastName",
            email: "valid_email",
            password: "valid_password",
            passwordConfirmation: "valid_password",
        };

        const mockRequest = {} as Request;
        mockRequest.body = body;

        const mockResponse = {} as Response;
        mockResponse.status = jest.fn().mockReturnThis();
        mockResponse.json = jest.fn().mockReturnThis();

        jest.spyOn(createUserUseCaseStub, "execute").mockRejectedValue(
            new Error(),
        );

        await expect(sut.handle(mockRequest, mockResponse)).rejects.toThrow();
    });
});
