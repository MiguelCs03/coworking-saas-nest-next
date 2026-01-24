import { IsNotEmpty, IsUUID, IsDateString, IsNumber, IsOptional, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationDto {
    @IsNotEmpty()
    @IsUUID()
    user_id: string;

    @IsNotEmpty()
    @IsUUID()
    room_id: string;

    @IsNotEmpty()
    @IsDateString()
    @Type(() => Date)
    start_time: Date;

    @IsNotEmpty()
    @IsDateString()
    @Type(() => Date)
    end_time: Date;

    @IsNotEmpty()
    @IsNumber()
    total_price: number;

    @IsOptional()
    @IsIn(['confirmed', 'cancelled', 'completed'])
    status?: 'confirmed' | 'cancelled' | 'completed';
}
