import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    // Crear un nuevo usuario
    async create(userData: Partial<User>): Promise<User> {
        const user = this.usersRepository.create(userData);
        return await this.usersRepository.save(user);
    }

    // Obtener todos los usuarios
    async findAll(): Promise<User[]> {
        return await this.usersRepository.find({
            relations: ['reservations'],
        });
    }

    // Obtener un usuario por ID
    async findOne(id: string): Promise<User | null> {
        return await this.usersRepository.findOne({
            where: { id },
            relations: ['reservations'],
        });
    }

    // Obtener usuario por email (útil para login)
    async findByEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findOne({
            where: { email },
            select: ['id', 'name', 'email', 'password', 'role', 'created_at'],
        });
    }

    // Actualizar un usuario
    async update(id: string, updateData: Partial<User>): Promise<User> {
        await this.usersRepository.update(id, updateData);
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        return user;
    }

    // Eliminar un usuario
    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
