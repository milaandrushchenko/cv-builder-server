import { Subscription } from './../../subscription/entities/subscription.entity'
import { Token } from 'src/token/entities/token.entity'
import { UserRole } from 'src/utils/enum/user-role.enum'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column()
  name: string

  @PrimaryColumn()
  email: string

  @Column()
  password: string

  @Column({ default: 0 })
  downloads: number

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole

  @OneToMany(() => Token, (token) => token.user, { onDelete: 'CASCADE' })
  tokens: Token[]

  @OneToOne(() => Subscription, (subscription) => subscription.user)
  subscription: Subscription

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date
}
