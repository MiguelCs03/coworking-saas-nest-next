import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../../rooms/entities/room.entity';
import { User } from '../../users/entities/user.entity';
import { RoomsSeedService } from './rooms.seed';
import { UsersSeedService } from './users.seed';
import { SeedController } from './seed.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Room, User])],
    controllers: [SeedController],
    providers: [RoomsSeedService, UsersSeedService],
})
export class SeedModule { }
