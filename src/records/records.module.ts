import { Module } from "@nestjs/common";
import { RecordsController } from "./records.controller";
import { RecordsService } from "./records.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [UsersModule, JwtModule.registerAsync({
        useFactory(cfg: ConfigService) {
            return {
                secret: cfg.get("SECRET"),
                global: true,
                signOptions: { expiresIn: '7d' }
            }
        },
        inject: [ConfigService]
    })],
    controllers: [RecordsController],
    providers: [RecordsService],
    exports: [RecordsService],
})
export class RecordsModule { }
