import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { HivesModule } from 'src/hives/hives.module';
import { SensorsController } from './sensors.controller';

@Module({
    controllers: [SensorsController],
    imports: [HivesModule],
    providers: [SensorsService],
    exports: [SensorsService],
})
export class SensorsModule { }
