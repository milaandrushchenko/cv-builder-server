import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common'
import { SubscriptionService } from './subscription.service'
import { CreateSubscriptionDto } from './dto/create-subscription.dto'
import { UpdateSubscriptionDto } from './dto/update-subscription.dto'

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  // @Post()
  // create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
  //   return this.subscriptionService.create(createSubscriptionDto)
  // }

  // @Post('user/:id')
  // create(@Body() createSubscriptionDto: CreateSubscriptionDto, @Param('id') id: number) {
  //   return this.subscriptionService.create(createSubscriptionDto, +id)
  // }

  @Post('user/:id')
  create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @Param('id') id: number
  ) {
    return this.subscriptionService.create(createSubscriptionDto, +id)
  }

  @Get()
  findAll() {
    return this.subscriptionService.findAll()
  }

  @Get('stats')
  getStats() {
    return this.subscriptionService.getSubscriptionDataChart()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto
  ) {
    return this.subscriptionService.update(+id, updateSubscriptionDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionService.remove(+id)
  }
}
