import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { HivesModule } from 'src/hives/hives.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [JwtModule.registerAsync({
        useFactory(cfg: ConfigService) {
            return {
                secret: cfg.get("SECRET"),
                global: true,
                signOptions: { expiresIn: '7d' }
            }
        },
        inject: [ConfigService]
    })],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
