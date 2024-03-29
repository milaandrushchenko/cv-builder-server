import { IsNotEmpty } from 'class-validator'
import { SubscriptionType } from 'src/utils/enum/subscription-type.enum'

export class CreateSubscriptionDto {
  @IsNotEmpty()
  subscription_duration: SubscriptionType

  @IsNotEmpty()
  startAt: Date

  @IsNotEmpty()
  endAt: Date
}
