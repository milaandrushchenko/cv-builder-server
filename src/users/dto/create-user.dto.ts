import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength
} from 'class-validator'
import { CreateTokenDto } from 'src/token/dto/create-token.dto'
import { UserRole } from 'src/utils/enum/user-role.enum'

export class CreateUserDto {
  @IsEmail()
  email: string

  @IsString()
  name: string

  @IsNumber()
  downloads: number

  @IsIn(Object.values(UserRole))
  role: UserRole

  @MinLength(6, { message: 'Password must be more then 6 symbols' })
  password: string

  @IsNotEmpty()
  lastActivity: Date

  @IsOptional()
  tokens: CreateTokenDto[]
}
