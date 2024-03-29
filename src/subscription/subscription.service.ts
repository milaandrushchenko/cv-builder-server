import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateSubscriptionDto } from './dto/create-subscription.dto'
import { UpdateSubscriptionDto } from './dto/update-subscription.dto'
import { Subscription } from './entities/subscription.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SubscriptionType } from 'src/utils/enum/subscription-type.enum'
import { getDay } from 'src/utils/enum/common'

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto, userId: number) {
    try {
      const startDate = createSubscriptionDto.startAt
        ? createSubscriptionDto.startAt
        : new Date()
      const endDate = this.calculateEndDate(
        startDate,
        createSubscriptionDto.subscription_duration
      )

      const subscription = {
        ...createSubscriptionDto,
        user: {
          id: userId
        },
        startAt: startDate,
        endAt: endDate
      }

      const createdSubscription =
        await this.subscriptionRepository.save(subscription)

      return createdSubscription
    } catch (error) {
      throw new Error(`Error creating a subscription: ${error.message}`)
    }
  }

  calculateEndDate(
    startAt: Date,
    subscriptionDuration: SubscriptionType
  ): Date {
    const endDate = new Date(startAt)
    switch (subscriptionDuration) {
      case SubscriptionType.DAYS7:
        endDate.setDate(endDate.getDate() + 7)
        break
      case SubscriptionType.DAYS30:
        endDate.setDate(endDate.getDate() + 30)
        break
      default:
        endDate
        break
    }

    return endDate
  }

  findAll() {
    return `This action returns all subscription`
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`
  }

  async update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id }
    })
    if (!subscription) throw new NotFoundException('Subscription not found')

    Object.assign(subscription, updateSubscriptionDto)

    return await this.subscriptionRepository.save(subscription)
  }

  async remove(id: number) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id }
    })

    if (!subscription) throw new NotFoundException('Subscription not found')

    return await this.subscriptionRepository.delete(id)
  }

  async getSubscriptionDataChart() {
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

    const subscriptionData = await this.fetchSubscriptionData(
      lastWeekStartDate,
      lastWeekEndDate
    )

    const groupedData = this.groupDataByDurationAndDay(
      subscriptionData,
      daysOfWeek
    )

    const dataArray = this.formatGroupedDataToArray(groupedData)

    return dataArray
  }

  async fetchSubscriptionData(startDate: Date, endDate: Date) {
    const subscriptionData = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .select('subscription.subscription_duration', 'subscription_duration')
      .addSelect('DATE(subscription.startAt)', 'date')
      .addSelect('COUNT(subscription.id)', 'count')
      .where('subscription.startAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      })
      .groupBy('subscription.subscription_duration')
      .addGroupBy('date')
      .getRawMany()

    return subscriptionData
  }

  groupDataByDurationAndDay(
    subscriptionData: any[],
    daysOfWeek: string[]
  ): { [key: string]: { x: string; y: number }[] } {
    const groupedData = subscriptionData.reduce((acc, item) => {
      const { subscription_duration, date, count } = item

      if (!acc[subscription_duration]) {
        acc[subscription_duration] = []
      }

      acc[subscription_duration].push({
        x: getDay(date),
        y: parseInt(count)
      })

      return acc
    }, {})

    Object.keys(groupedData).forEach((subscription_duration) => {
      daysOfWeek.forEach((day) => {
        if (
          !groupedData[subscription_duration].some((item) => item.x === day)
        ) {
          groupedData[subscription_duration].push({ x: day, y: 0 })
        }
      })

      groupedData[subscription_duration] = groupedData[
        subscription_duration
      ].sort((a, b) => {
        return daysOfWeek.indexOf(a.x) - daysOfWeek.indexOf(b.x)
      })
    })

    return groupedData
  }

  formatGroupedDataToArray(groupedData: {
    [key: string]: { x: string; y: number }[]
  }): { [key: string]: { x: string; y: number }[] }[] {
    const dataArray = Object.keys(groupedData).map((subscription_duration) => ({
      [subscription_duration]: groupedData[subscription_duration]
    }))

    return dataArray
  }
}
