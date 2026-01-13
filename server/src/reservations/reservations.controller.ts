import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Reservation } from './entities/reservation.entity';

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) { }

    @Post()
    create(@Body() createReservationDto: Partial<Reservation>) {
        return this.reservationsService.create(createReservationDto);
    }

    @Get()
    findAll() {
        return this.reservationsService.findAll();
    }

    @Get('user/:userId')
    findByUser(@Param('userId') userId: string) {
        return this.reservationsService.findByUser(userId);
    }

    @Get('room/:roomId')
    findByRoom(@Param('roomId') roomId: string) {
        return this.reservationsService.findByRoom(roomId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.reservationsService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateReservationDto: Partial<Reservation>,
    ) {
        return this.reservationsService.update(id, updateReservationDto);
    }

    @Patch(':id/cancel')
    cancel(@Param('id') id: string) {
        return this.reservationsService.cancel(id);
    }

    @Patch(':id/complete')
    complete(@Param('id') id: string) {
        return this.reservationsService.complete(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.reservationsService.remove(id);
    }
}
