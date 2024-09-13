import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { MainModule } from './main/main.module';
import { ProductorsModule } from './productors/productors.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    MainModule,
    ProductorsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
