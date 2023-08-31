import {
  Controller,
  Post,
  HttpCode,
  Body,
  HttpStatus,
  Get,
  UseGuards,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { BrokerClientService } from './broker-client.service';
import { RegisterDto } from './dtos/register.dto';
import { BrokerClient } from './models/broker-client.model';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { DtoUpdate } from './dtos/update.dto';

@Controller('broker-client')
export class BrokerClientController {
  constructor(private readonly clientService: BrokerClientService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  public async register(
    @Body() registerDto: RegisterDto,
  ): Promise<BrokerClient> {
    return this.clientService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ username: string; jwtToken: string; description: string }> {
    return this.clientService.login(loginDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async findAll(): Promise<BrokerClient[]> {
    return this.clientService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async findOne(@Param('id') _id: string): Promise<BrokerClient> {
    return this.clientService.findById(_id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') _id: string): Promise<void> {
    await this.clientService.deleteById(_id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id') _id: string,
    @Body() updateDto: DtoUpdate,
  ): Promise<BrokerClient> {
    return this.clientService.updateById(_id, updateDto);
  }
}
