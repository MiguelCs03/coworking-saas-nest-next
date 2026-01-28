import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';

@Injectable()
export class RoomsSeedService {
    constructor(
        @InjectRepository(Room)
        private roomsRepository: Repository<Room>,
    ) { }

    async run() {
        const count = await this.roomsRepository.count();
        if (count > 0) {
            console.log('La base de datos ya tiene espacios. Saltando seed.');
            return;
        }

        const rooms = [
            {
                name: 'Sala de Juntas "Visionary"',
                description: 'Sala de reuniones ejecutiva con vistas panorámicas a la ciudad. Equipada con pantalla 85", sistema de videoconferencia Logitech Rally, pizarra de cristal y mobiliario de Herman Miller. Ideal para cerrar tratos importantes.',
                capacity: 12,
                price_per_hour: 45.00,
                image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
                is_active: true,
            },
            {
                name: 'Oficina Privada "Executive"',
                description: 'Tu propia sede privada. Oficina amueblada para equipos pequeños, con control de acceso biométrico, café premium ilimitado directo en la suite y excelente insonorización.',
                capacity: 4,
                price_per_hour: 25.00,
                image_url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
                is_active: true,
            },
            {
                name: 'Hot Desk "Creative Hub"',
                description: 'Espacio de trabajo compartido en un ambiente vibrante e industrial. Gran iluminación natural, abundantes enchufes, internet de 1Gbps y acceso a áreas de descanso.',
                capacity: 1,
                price_per_hour: 5.00,
                image_url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
                is_active: true,
            },
            {
                name: 'Auditorio "Summit"',
                description: 'Espacio versátil para workshops, conferencias y lanzamientos de producto. Sistema de sonido Bose, proyector láser 4K y gradas modulares.',
                capacity: 50,
                price_per_hour: 120.00,
                image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
                is_active: true,
            },
            {
                name: 'Estudio "Podcast Pro"',
                description: 'Estudio insonorizado profesionalmente para grabación de podcasts y contenido de voz. Incluye 4 micrófonos Shure SM7B, consola Rodecaster Pro y tratamiento acústico.',
                capacity: 4,
                price_per_hour: 35.00,
                image_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
                is_active: true,
            },
            {
                name: 'Lounge "The Garden"',
                description: 'Área relajada rodeada de plantas naturales para trabajo casual o brainstorming informal. Ambiente silencioso y aire purificado.',
                capacity: 8,
                price_per_hour: 15.00,
                image_url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
                is_active: true,
            },
        ];

        for (const roomData of rooms) {
            const room = this.roomsRepository.create(roomData);
            await this.roomsRepository.save(room);
        }

        console.log('✅ 6 Espacios creados exitosamente');
    }
}
