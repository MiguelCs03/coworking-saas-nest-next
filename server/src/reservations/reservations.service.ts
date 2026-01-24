import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { Repository, LessThan, MoreThan, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationsService {
    constructor(
        @InjectRepository(Reservation)
        private reservationsRepository: Repository<Reservation>,
    ) { }

    // Verificar si hay conflicto de horarios para una sala
    async checkTimeConflict(
        roomId: string,
        startTime: Date,
        endTime: Date,
        excludeReservationId?: string,
    ): Promise<boolean> {
        const queryBuilder = this.reservationsRepository
            .createQueryBuilder('reservation')
            .where('reservation.room_id = :roomId', { roomId })
            .andWhere('reservation.status != :status', { status: 'cancelled' })
            .andWhere(
                '(reservation.start_time < :endTime AND reservation.end_time > :startTime)',
                { startTime, endTime },
            );

        if (excludeReservationId) {
            queryBuilder.andWhere('reservation.id != :excludeReservationId', {
                excludeReservationId,
            });
        }

        const conflictingReservation = await queryBuilder.getOne();
        return !!conflictingReservation;
    }

    // Verificar disponibilidad de una sala en un horario específico
    async checkAvailability(
        roomId: string,
        startTime: Date,
        endTime: Date,
    ): Promise<{ available: boolean; message: string }> {
        const hasConflict = await this.checkTimeConflict(
            roomId,
            startTime,
            endTime,
        );

        if (hasConflict) {
            return {
                available: false,
                message: 'La sala no está disponible en ese horario',
            };
        }

        return {
            available: true,
            message: 'La sala está disponible',
        };
    }

    // Crear una nueva reserva
    async create(reservationData: Partial<Reservation>): Promise<Reservation> {
        const { room_id, start_time, end_time } = reservationData;

        // Validar que todos los campos requeridos estén presentes
        if (!room_id || !start_time || !end_time) {
            throw new BadRequestException(
                'room_id, start_time y end_time son requeridos',
            );
        }

        // Validar que end_time sea después de start_time
        if (new Date(end_time) <= new Date(start_time)) {
            throw new BadRequestException(
                'La hora de fin debe ser posterior a la hora de inicio',
            );
        }

        // Verificar conflictos de horario
        const hasConflict = await this.checkTimeConflict(
            room_id,
            new Date(start_time),
            new Date(end_time),
        );

        if (hasConflict) {
            throw new BadRequestException(
                'Ya existe una reserva en ese horario para esta sala',
            );
        }

        const reservation = this.reservationsRepository.create(reservationData);
        return await this.reservationsRepository.save(reservation);
    }

    // Obtener todas las reservas
    async findAll(): Promise<Reservation[]> {
        return await this.reservationsRepository.find({
            relations: ['user', 'room'],
            order: { start_time: 'ASC' },
        });
    }

    // Obtener reservas de un usuario específico
    async findByUser(userId: string): Promise<Reservation[]> {
        return await this.reservationsRepository.find({
            where: { user_id: userId },
            relations: ['room'],
            order: { start_time: 'ASC' },
        });
    }

    // Obtener reservas de una sala específica
    async findByRoom(roomId: string): Promise<Reservation[]> {
        return await this.reservationsRepository.find({
            where: { room_id: roomId },
            relations: ['user'],
            order: { start_time: 'ASC' },
        });
    }

    // Obtener una reserva por ID
    async findOne(id: string): Promise<Reservation> {
        const reservation = await this.reservationsRepository.findOne({
            where: { id },
            relations: ['user', 'room'],
        });

        if (!reservation) {
            throw new NotFoundException('Reserva no encontrada');
        }

        return reservation;
    }

    // Actualizar una reserva
    async update(
        id: string,
        updateData: Partial<Reservation>,
    ): Promise<Reservation> {
        const reservation = await this.findOne(id);

        // Si se están cambiando los horarios, verificar conflictos
        if (updateData.start_time || updateData.end_time) {
            const startTime = updateData.start_time
                ? new Date(updateData.start_time)
                : reservation.start_time;
            const endTime = updateData.end_time
                ? new Date(updateData.end_time)
                : reservation.end_time;
            const roomId = updateData.room_id ?? reservation.room_id;

            const hasConflict = await this.checkTimeConflict(
                roomId,
                startTime,
                endTime,
                id,
            );

            if (hasConflict) {
                throw new BadRequestException(
                    'El nuevo horario conflicta con otra reserva',
                );
            }
        }

        await this.reservationsRepository.update(id, updateData);
        return this.findOne(id);
    }

    // Cancelar una reserva (cambiar status a cancelled)
    async cancel(id: string): Promise<Reservation> {
        return this.update(id, { status: 'cancelled' });
    }

    // Completar una reserva
    async complete(id: string): Promise<Reservation> {
        return this.update(id, { status: 'completed' });
    }

    // Eliminar una reserva
    async remove(id: string): Promise<void> {
        await this.reservationsRepository.delete(id);
    }
}
