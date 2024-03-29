import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { TokenService } from './token.service'
import { CreateTokenDto } from './dto/create-token.dto'

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  // @Post()
  // create(@Body() createTokenDto: CreateTokenDto, @Req() req) {
  //   return this.tokenService.create(createTokenDto, +req.user.id)
  // }

  @Post('user/:id')
  create(@Body() createTokenDto: CreateTokenDto, @Param('id') id: number) {
    return this.tokenService.create(createTokenDto, +id)
  }

  @Get()
  findAll() {
    return this.tokenService.findAll()
  }
  @Get('stats')
  getStats() {
    return this.tokenService.getTokenDataChart()
  }
}
