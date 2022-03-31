import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './users.service';
import { UsersResolver } from './users.resolver';
import { ConfigService } from '@nestjs/config';
import { Verification } from './verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])],
  // repository를 사용하기 위해 import 해줌
  // npm install --save @nestjs/typeorm typeorm pg
  providers: [UsersResolver, UserService],
  exports: [UserService],
})
export class UsersModule {}
