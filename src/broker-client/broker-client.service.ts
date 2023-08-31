import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { BrokerClient } from './models/broker-client.model';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { DtoUpdate } from './dtos/update.dto';

@Injectable()
export class BrokerClientService {
  constructor(
    @InjectModel('BrokerClient')
    private readonly clientModel: Model<BrokerClient>,
    private readonly authService: AuthService,
  ) {}

  public async register(registerDto: RegisterDto): Promise<BrokerClient> {
    const client = new this.clientModel(registerDto);
    return client.save();
  }

  public async login(
    loginDto: LoginDto,
  ): Promise<{ username: string; jwtToken: string; description: string }> {
    const client = await this.findByUsername(loginDto.username);
    const match = await this.checkPassword(loginDto.password, client);

    if (!match) {
      throw new NotFoundException('Invalid Credentials.');
    }
    const jwtToken = await this.authService.CreateAcessToken(client._id);

    return {
      username: client.username,
      jwtToken,
      description: client.description,
    };
  }

  public async findAll(): Promise<BrokerClient[]> {
    return this.clientModel.find();
  }

  private async findByUsername(username: string): Promise<BrokerClient> {
    const client = await this.clientModel.findOne({ username });

    if (!client) {
      throw new NotFoundException('Broker client not found.');
    }

    return client;
  }

  public async findById(_id: string): Promise<BrokerClient> {
    const client = await this.clientModel.findOne({ _id });

    if (!client) {
      throw new NotFoundException('Broker client not found.');
    }

    return client;
  }

  public async deleteById(_id: string): Promise<void> {
    const result = await this.clientModel.deleteOne({ _id });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Broker client not found.');
    }
  }

  public async updateById(
    _id: string,
    updateDto: DtoUpdate,
  ): Promise<BrokerClient> {
    const client = await this.findById(_id);
    Object.assign(client, updateDto);
    return client.save();
  }

  private async checkPassword(
    password: string,
    client: BrokerClient,
  ): Promise<boolean> {
    const match = await bcrypt.compare(password, client.password);

    if (!match) {
      throw new NotFoundException('Password not found.');
    }

    return match;
  }
}
