import { Controller, Get } from '@nestjs/common';
import { RoomsSeedService } from './rooms.seed';
import { UsersSeedService } from './users.seed';

@Controller('seed')
export class SeedController {
    constructor(
        private readonly roomsSeedService: RoomsSeedService,
        private readonly usersSeedService: UsersSeedService
    ) { }

    @Get()
    async executeSeed() {
        await this.usersSeedService.run();
        await this.roomsSeedService.run();
        return { message: 'Seed ejecutado correctamente (Usuarios y Salas)' };
    }
}
