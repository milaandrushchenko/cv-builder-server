import { Injectable } from '@nestjs/common'
import { CreateTokenDto } from './dto/create-token.dto'
import { Token } from './entities/token.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { getDay } from 'src/utils/enum/common'

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>
  ) {}

  async create(createTokenDto: CreateTokenDto, id: number) {
    const token = {
      ...createTokenDto,
      user: {
        id
      }
    }
    return await this.tokenRepository.save(token)
  }

  findAll() {
    return `This action returns all token`
  }

  async getTokenDataChart() {
    const currentDate = new Date()

    const lastWeekStartDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay() - 7
    )
    const lastWeekEndDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay()
    )

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    const tokenData = await this.fetchTokenData(
      lastWeekStartDate,
      lastWeekEndDate
    )

    const groupedData = this.groupDataByDay(tokenData, daysOfWeek)

    return groupedData
  }

  async fetchTokenData(startDate: Date, endDate: Date) {
    const tokenData = await this.tokenRepository
      .createQueryBuilder('token')
      .select('DATE(token.createAt)', 'date')
      .addSelect('COUNT(token.id)', 'count')
      .where('token.createAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      })
      .groupBy('date')
      .getRawMany()

    return tokenData
  }

  groupDataByDay(tokenData: any[], daysOfWeek: string[]) {
    const groupedData = tokenData.reduce((acc, item) => {
      const { date, count } = item

      acc.push({
        x: getDay(date),
        y: parseInt(count)
      })

      return acc
    }, [])

    daysOfWeek.forEach((day) => {
      if (!groupedData.some((item) => item.x === day)) {
        groupedData.push({ x: day, y: 0 })
      }
    })

    groupedData.sort((a, b) => {
      return daysOfWeek.indexOf(a.x) - daysOfWeek.indexOf(b.x)
    })

    return groupedData
  }
}
