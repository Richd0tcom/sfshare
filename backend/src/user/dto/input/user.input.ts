import { User } from "@common/schema";
import { PartialType } from "@nestjs/mapped-types";

export class CreateUserInput extends User {}

export class UpdateUserInput extends PartialType(User) {}