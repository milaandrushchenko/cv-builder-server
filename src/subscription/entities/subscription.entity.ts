import { User } from 'src/users/entities/user.entity'
import { SubscriptionType } from 'src/utils/enum/subscription-type.enum'
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'enum',
    enum: SubscriptionType
  })
  subscription_duration: SubscriptionType

  @Column({ type: 'date' })
  startAt: Date

  @Column({ type: 'date' })
  endAt: Date

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User
}
