import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    // Registrar nuevo usuario
    async register(registerDto: RegisterDto) {
        const { email, password, name, role } = registerDto;

        // Verificar si el email ya existe
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const user = await this.usersService.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'client',
        });

        // Generar token JWT
        const payload = { sub: user.id, email: user.email, role: user.role };
        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    // Login de usuario
    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // Buscar usuario por email (incluir password)
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Generar token JWT
        const payload = { sub: user.id, email: user.email, role: user.role };
        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    // Validar usuario por ID (para JWT strategy)
    async validateUser(userId: string) {
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }
        return user;
    }
}
