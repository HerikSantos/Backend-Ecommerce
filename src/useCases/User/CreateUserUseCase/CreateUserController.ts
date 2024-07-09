import { type Request, type Response } from "express";

import { type IController } from "../../protocols/IController";
import { type ICreateUserUseCase } from "./ICreateUserUseCase";

class CreateUserController implements IController {
    private readonly createUserUseCase: ICreateUserUseCase;
    constructor(createUserUseCase: ICreateUserUseCase) {
        this.createUserUseCase = createUserUseCase;
    }

    async handle(request: Request, response: Response): Promise<Response> {
        const data = request.body;

        const user = await this.createUserUseCase.execute(data);

        return response.status(201).json(user);
    }
}

export { CreateUserController };
