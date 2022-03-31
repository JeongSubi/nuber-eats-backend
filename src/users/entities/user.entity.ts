import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  ObjectType,
  InputType,
  Field,
  registerEnumType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsEmail, IsEnum } from 'class-validator';

// type UserRole = 'client' | 'owner' | ' delivery';
enum UserRole {
  Client,
  Owner,
  Delivery,
}
// enum

registerEnumType(UserRole, { name: 'UserRole' });
// graphql 모듈에 들어있는 메서드이다.

@InputType({ isAbstract: true })
@ObjectType()
// GQL을 위한 User entity
@Entity()
//DB 연동을 위한 User entity
export class User extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsEmail()
  email: string;

  // 다시 또 verify를 할때 user에는 더이상 password 포함시키지 않음
  @Column({ select: false })
  @Field((type) => String)
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field((type) => Boolean)
  verified: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  // beforupdate는 특정 entity를 update해야 부를수 있는데,
  // 이경우에는 어떤 entitiy를  update하고 있지 않음
  // 그저 db에 query를 보내고만 있다.
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }
  // typeORM이 entity가 insert되기 전에 이 메소드를 불러준다.
  //  npm i bcrypt
  //  npm i @types/bcrypt --dev-only

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
