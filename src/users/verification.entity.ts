import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './entities/user.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field((type) => String)
  code: string;

  @OneToOne((type) => User, { onDelete: 'CASCADE' })
  // 만약 user를 삭제하면 user와 붙어있는 verification도 같이 삭제가 됨
  @JoinColumn()
  user: User;
}
// 1 to 1 relationship
// typeORM을 사용함으로써 쉽게 정의할수 있다.
