import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(Room)
        private roomsRepository: Repository<Room>,
    ) { }

    // Crear una nueva sala
    async create(roomData: Partial<Room>): Promise<Room> {
        const room = this.roomsRepository.create(roomData);
        return await this.roomsRepository.save(room);
    }

    // Obtener todas las salas
    async findAll(onlyActive = false): Promise<Room[]> {
        const where = onlyActive ? { is_active: true } : {};
        return await this.roomsRepository.find({
            where,
            relations: ['reservations'],
        });
    }

    // Obtener solo salas disponibles (activas)
    async findAvailable(): Promise<Room[]> {
        return this.findAll(true);
    }

    // Obtener una sala por ID
    async findOne(id: string): Promise<Room | null> {
        return await this.roomsRepository.findOne({
            where: { id },
            relations: ['reservations'],
        });
    }

    // Actualizar una sala
    async update(id: string, updateData: Partial<Room>): Promise<Room> {
        await this.roomsRepository.update(id, updateData);
        const room = await this.findOne(id);
        if (!room) {
            throw new NotFoundException('Sala no encontrada');
        }
        return room;
    }

    // Eliminar una sala
    async remove(id: string): Promise<void> {
        await this.roomsRepository.delete(id);
    }

    // Desactivar una sala (en vez de eliminarla)
    async deactivate(id: string): Promise<Room> {
        return this.update(id, { is_active: false });
    }

    // Activar una sala
    async activate(id: string): Promise<Room> {
        return this.update(id, { is_active: true });
    }
}
