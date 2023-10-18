import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SignInInput, SignInOutput } from './dto/sign-in.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  // signIn
  async signIn({ email, password }: SignInInput): Promise<SignInOutput> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) return { ok: false, error: '존재하지 않는 회원입니다.' };

      const passwordCorrect = await this.verifyPassword(user.id, password);

      if (!passwordCorrect)
        return { ok: false, error: '비밀번호가 일치하지 않습니다.' };

      const accessToken = await this.createAccessToken({
        id: user.id,
        role: user.role,
      });
      const refreshToken = await this.createRefreshToken({
        id: user.id,
        role: user.role,
      });

      const hashedJwtToken = await bcrypt.hash(
        refreshToken,
        this.configService.get('BCRYPT_SALT'),
      );

      user.jwtToken = hashedJwtToken;
      await queryRunner.manager.save(User, user);

      delete user['jwtToken'];
      delete user['password'];
      delete user['role'];

      await queryRunner.commitTransaction();
      return { ok: true, accessToken, refreshToken, user };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private async verifyPassword(userId: number, hashedPassword: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      const isPasswordMatch = await bcrypt.compare(
        hashedPassword,
        user.password,
      );

      if (!isPasswordMatch)
        throw new BadRequestException('비밀번호가 일치하지 않습니다.');

      const { password, ...result } = user;

      return result;
    } catch (err) {
      throw new InternalServerErrorException(`🚨에러 발생: ${err}`);
    }
  }

  // AccessToken 발급
  private async createAccessToken(payload): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
  }

  // RefreshToken 발급
  private async createRefreshToken(payload): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });
  }
}
