import { Module } from '@nestjs/common';
import { ProductorsController } from './productors.controller';
import { ProductorsService } from './productors.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductorsController],
  providers: [ProductorsService],
})
export class ProductorsModule {}
