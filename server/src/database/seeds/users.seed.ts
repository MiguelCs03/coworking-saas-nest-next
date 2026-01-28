import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersSeedService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async run() {
        const adminEmail = 'admin@coworking.com';
        const existingAdmin = await this.usersRepository.findOne({ where: { email: adminEmail } });

        if (existingAdmin) {
            console.log('El usuario admin ya existe. Saltando seed.');
            return;
        }

        const hashedPassword = await bcrypt.hash('Admin123!', 10);

        const adminUser = this.usersRepository.create({
            name: 'Admin User',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
        });

        await this.usersRepository.save(adminUser);
        console.log('✅ Usuario Admin creado: admin@coworking.com / Admin123!');
    }
}
