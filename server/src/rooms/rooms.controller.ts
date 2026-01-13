import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Room } from './entities/room.entity';

@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) { }

    @Post()
    create(@Body() createRoomDto: Partial<Room>) {
        return this.roomsService.create(createRoomDto);
    }

    @Get()
    findAll() {
        return this.roomsService.findAll();
    }

    @Get('available')
    findAvailable() {
        return this.roomsService.findAvailable();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.roomsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRoomDto: Partial<Room>) {
        return this.roomsService.update(id, updateRoomDto);
    }

    @Patch(':id/deactivate')
    deactivate(@Param('id') id: string) {
        return this.roomsService.deactivate(id);
    }

    @Patch(':id/activate')
    activate(@Param('id') id: string) {
        return this.roomsService.activate(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.roomsService.remove(id);
    }
}
