import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrokerClientController } from './broker-client.controller';
import { BrokerClientService } from './broker-client.service';
import { BrokerClientSchema } from './schemas/broker-client.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'BrokerClient',
        schema: BrokerClientSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [BrokerClientController],
  providers: [BrokerClientService],
})
export class BrokerClientModule {}
