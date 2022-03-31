import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '../jwt/jwt.service';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile';
import { Verification } from './verification.entity';
import { VerifyEmailOutput } from './dtos/verify-email.dto';
import { UserProfileOutput } from './dtos/user-profile.dto';

// db에 접근가능
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    // private readonly config: ConfigService,
    private readonly JwtService: JwtService,
  ) {}
  // dependency injection
  // 모듈 가져옴
  // 우리가 원하는 것의 class만 적어주면 nestjs가 우리를 위해서 그 정보를 가져다 줌

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ CreateAccountOutput }> {
    // 계정을 만들때 체크해야할것
    // 존재하지 않는 email인지 확인 -> 새로운 user 확인하기
    // 계정 생성 & 비밀번호 hashing
    try {
      const exists = await this.users.findOne({ where: { email } });
      console.log(exists);
      if (exists) {
        // throw Error
        return { ok: false, error: 'There is a user with that email already' };
      }
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );

      await this.verifications.save(
        this.verifications.create({
          user,
        }),
      );
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    // 이 이메일을 가진 user 찾기
    // 비밀번호가 맞는지 확인
    // JWT 만들고 user에게 주기
    try {
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
        // findOne 메소드의 options 파라미터 hash의 select값 자체가 배열에 명시된 필드들만 반환하도록 설계되어 있기때문입니다. 영상에 설명된것 처럼 토큰 발행을 위해서는 id도 필요하기 때문에, id와 password 둘다 넣어야 합니다.
        // select라는 옵션 이름처럼 명시된 필드만 가져오는게 자연스러워 보입니다.
      );
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      // const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      // const token = jwt.sign({ id: user.id }, this.config.get('SECRET_KEY'));
      const token = this.JwtService.sign(user.id);

      return {
        ok: true,
        token,
      };
      // JWT 토큰 기본 알고리즘은 SHA256
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne({ id });
      if (user) {
        return {
          ok: true,
          user: user,
        };
      }
    } catch (error) {
      return { ok: false, error: 'User Not Found' };
    }
  }
  // async editProfile(userId: number, editProfileInput: EditProfileInput) {
  // return this.users.update(userId, { ...editProfileInput });
  // return this.users.save(userId, { ...editProfileInput });
  // save는 db에 모든 entity를 save 하고
  // 만약 entity를 save에 넘길때 이미 존재하는 entity인 경우에는 entity를 update한다
  // 존재하지 않으면 entity를 creqate, insert한다.
  // }
  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOne(userId);
      if (email) {
        user.email = email;
        user.verified = false;
        await this.verifications.save(this.verifications.create({ user }));
      }
      if (password) {
        user.password = password;
      }
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: 'Could not update profile.' };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verifications.findOne(
        { code },
        { relations: ['user'] },
        // 위처럼 실제 불러오고자 하는 관계를 적으면 엔티티 전체가 나옴

        // typeorm은 default로 관계를 불러와주지 않는다.
        // {loadRelationIds:true} 관계되어있는 id 만 받아올수 있다.
      );
      if (verification) {
        verification.user.verified = true;
        this.users.save(verification.user);
        return { ok: true };
      }
      return { ok: false, error: 'Verification not found.' };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
