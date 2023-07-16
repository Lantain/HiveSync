import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
    controllers: [AuthController],
    imports: [
        UsersModule, 
        JwtModule.registerAsync({
            useFactory(cfg: ConfigService) {
                return {
                    secret: cfg.get("SECRET"),
                    global: true,
                    signOptions: { expiresIn: '7d' }
                }
            },
            inject: [ConfigService]
         })
    ],
    providers: [AuthGuard],
    exports: [AuthGuard],
})
export class AuthModule { }
