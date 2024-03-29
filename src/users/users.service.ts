import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import * as argon2 from 'argon2'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email
      }
    })
    if (existUser) throw new BadRequestException('This email already exist!')

    const user = await this.userRepository.save({
      name: createUserDto.name,
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password),
      downloads: createUserDto.downloads,
      role: createUserDto.role,
      tokens: []
    })
    return user
  }

  findAll() {
    return this.userRepository.find({
      relations: {
        tokens: true,
        subscription: true
      }
    })
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        tokens: true
      }
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existUser = await this.userRepository.findOne({ where: { id } })
    if (!existUser) throw new NotFoundException('User not found')

    return await this.userRepository.update(id, updateUserDto)
  }

  remove(id: number) {
    return this.userRepository.delete(id)
  }

  async getStats() {
    const users = await this.userRepository.find({
      relations: ['subscription', 'tokens']
    })

    const stats = {
      totalUsers: users.length,
      totalDownloads: users.reduce((acc, curr) => acc + curr.downloads, 0),
      totalSubscriptions: users.filter(
        (user) =>
          user.subscription && new Date(user.subscription.endAt) >= new Date()
      ).length,
      totalTokens: users.reduce((acc, curr) => acc + curr.tokens.length, 0)
    }

    return stats
  }
}
