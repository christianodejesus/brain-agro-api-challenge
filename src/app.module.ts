import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { MainModule } from './main/main.module';
import { ProductorsModule } from './productors/productors.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    MainModule,
    ProductorsModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
