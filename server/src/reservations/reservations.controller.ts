import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    create(@Body() createReservationDto: CreateReservationDto) {
        return this.reservationsService.create(createReservationDto);
    }

    @Post('check-availability')
    @UsePipes(new ValidationPipe({ transform: true }))
    checkAvailability(@Body() checkAvailabilityDto: CheckAvailabilityDto) {
        return this.reservationsService.checkAvailability(
            checkAvailabilityDto.room_id,
            checkAvailabilityDto.start_time,
            checkAvailabilityDto.end_time,
        );
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
    @UsePipes(new ValidationPipe({ transform: true }))
    update(
        @Param('id') id: string,
        @Body() updateReservationDto: UpdateReservationDto,
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
