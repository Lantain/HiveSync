import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { HivesModule } from 'src/hives/hives.module';

@Module({
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
