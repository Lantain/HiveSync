import { Module } from '@nestjs/common';
import { HivesService } from './hives.service';
import { HivesController } from './hives.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RecordsModule } from 'src/records/records.module';

@Module({
    imports: [UsersModule, RecordsModule, JwtModule.registerAsync({
        useFactory(cfg: ConfigService) {
            return {
                secret: cfg.get("SECRET"),
                global: true,
                signOptions: { expiresIn: '7d' }
            }
        },
        inject: [ConfigService]
    })],
    controllers: [HivesController],
    providers: [HivesService],
    exports: [HivesService],
})
export class HivesModule { }
