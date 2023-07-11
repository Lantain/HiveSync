import { Module } from '@nestjs/common';
import { HivesService } from './hives.service';
import { HivesController } from './hives.controller';
import { RecordsModule } from 'src/records/records.module';

@Module({
    imports: [RecordsModule],
    controllers: [HivesController],
    providers: [HivesService],
    exports: [HivesService],
})
export class HivesModule { }
