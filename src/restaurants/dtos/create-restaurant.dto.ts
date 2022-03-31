import { Field, InputType, ArgsType, OmitType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';
// import { CreateRestaurantDto } from './create-restaurant.dto';
import { Restaurant } from '../entities/restaurant.entity';

// @InputType()
// export class CreateRestaurantDto {
//   @Field((type) => String)
//   name: string;

//   @Field((type) => Boolean)
//   isVegan: boolean;

//   @Field((type) => String)
//   address: string;

//   @Field((type) => String)
//   ownerName: string;
// }

// 기본적으로 하나의 object로 본다. argument로써 graphql에 전달하기 위한 용도, 이때는 object를 전달해야한다.
// @InputType()
// export class CreateRestaurantDto {
//   @Field((type) => String)
//   @IsString()
//   @Length(5, 10)
//   name: string;

//   @Field((type) => Boolean)
//   @IsBoolean()
//   isVegan: boolean;

//   @Field((type) => String)
//   @IsString()
//   address: string;

//   @Field((type) => String)
//   @IsString()
//   ownerName: string;
// }
// 기본적으로, 하나의 object에 모든것을 담지 않고서 분리된 값들을 GraphQL argument로 전달해 줄 수 있도록 해준다.

@InputType()
export class CreateRestaurantDto extends OmitType(
  Restaurant,
  ['id'],
  InputType,
) {}
// Omit Type은 InputType에만 작동한다. Restaurant는 Object Type이기 때문에 따라서 decorator를 바꿔줘야한다.
// Omit Type은 decorator를 바꾸도록 허락해준다. => 두번쨰 arg로
