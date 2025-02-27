import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import RegisterReqDto from 'common/dtos/idp/register-req.dto';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { User } from './entities/user.entity';

@Injectable()
export class IdpService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokensRepository: Repository<Token>,
  ) {}

  async register(newUser: RegisterReqDto) {
    const { password, email } = newUser;
    const secret = await argon2.hash(password);
    const createdUser = this.usersRepository.create({ email, secret });
    await this.usersRepository.save(createdUser);
    return createdUser;
  }

  async getUserSecret(
    email: string,
  ): Promise<{ secret: string; id: number } | void> {
    const foundUser = await this.usersRepository.findOne({
      where: { email },
      select: ['secret', 'id'],
    });
    if (!foundUser) return;
    return { secret: foundUser.secret, id: foundUser.id };
  }

  async saveToken(userId: number, token: string) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    const createdToken = this.tokensRepository.create({ token, user });
    return await this.tokensRepository.save(createdToken);
  }

  async getUserIdFromToken(token: string) {
    const foundToken = await this.tokensRepository.findOne({
      where: { token },
      relations: { user: true },
    });
    if (!foundToken) {
      console.error(new Error('token not found in database: ' + token));
      return;
    }
    return foundToken.user.id;
  }

  clearTokensForUser(userId: number) {
    return this.tokensRepository.delete({ user: { id: userId } });
  }

  _clearDataBase() {
    return Promise.allSettled([
      this.tokensRepository.delete({}),
      this.usersRepository.delete({}),
    ]);
  }
}
