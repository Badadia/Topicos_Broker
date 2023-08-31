import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrokerClientModule } from './broker-client/broker-client.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [BrokerClientModule, MongooseModule.forRoot(process.env.MONGO_URI)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
