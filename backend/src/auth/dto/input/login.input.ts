import { PickType } from "@nestjs/mapped-types";
import { RegisterInput } from "./register.input";

export class LoginInput extends PickType(RegisterInput,
  ['email', 'password'] as const
) {
}