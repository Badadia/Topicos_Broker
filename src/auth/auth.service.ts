import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { Request } from 'express';
import { BrokerClient } from 'src/broker-client/models/broker-client.model';
import { JwtPayload } from './models/jwt-payload.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('BrokerClient')
    private readonly clientModel: Model<BrokerClient>,
  ) {}

  public async CreateAcessToken(userId: string): Promise<string> {
    return sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }

  public async validateUser(jwtPayload: JwtPayload): Promise<BrokerClient> {
    const user = await this.clientModel.findOne({ _id: jwtPayload.userId });

    if (!user) {
      throw new UnauthorizedException('Broker client not found.');
    }
    return user;
  }

  private static JwtExtractor(request: Request): string {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new BadRequestException('Bad request');
    }

    const [, token] = authHeader.split(' ');

    return token;
  }

  public returnJwtExtractor(): (request: Request) => string {
    return AuthService.JwtExtractor;
  }
}
