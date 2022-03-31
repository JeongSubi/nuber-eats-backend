import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// InputType이 스키마에 포함되지 않길 원한다. isAbstract를 쓰면 이걸 어디선가 복사해서 쓴다는 뜻이다.
// 직접쓰는게 아니라 어떤것으로 확장시킨다는 뜻이다.
@InputType({ isAbstract: true })
@ObjectType()
// 자동으로 스키마를 빌드하기 위해 사용하는 GraphQL decorator
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  // postgresql은 RDBMS이기 때문에 primary column을 부여하지 않으면 에러를 뱉는다.
  @Field((type) => Number)
  id: number;

  // @Field(() => String)
  @Field((type) => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => Boolean, { nullable: true, defaultValue: true })
  @Column({ default: true })
  @IsOptional()
  // 해당필드를 요청시에 보내거나 안보내거나 선택적
  @IsBoolean()
  isVegan?: boolean;

  @Field((type) => String, { defaultValue: '강남' })
  @Column()
  @IsString()
  address: string;

  @Field((type) => String, { defaultValue: 'not' })
  @Column({ nullable: true })
  @IsString()
  ownersName: string;

  @Field((type) => String, { defaultValue: 'not' })
  @Column({ nullable: true })
  @IsString()
  categoryName: string;
}
// decorator를 사용해서 클래스 하나로 gql스키마와 db에 저장되는 실제 데이터의 형식을 만들 수 있다.
