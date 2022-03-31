import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';

// db에 접근가능
@Injectable()
export class RestaurantService {
  constructor(
    // injectRepository가 호출하는것은 entity 이어야만 한다.
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}
  // @InjectRepository() 를 사용하여 Restaurant 엔티티를 주입한다.
  getAll(): Promise<Restaurant[]> {
    return this.restaurants.find();
    // find()는 async method여서 promise와 함께 써주어야 한다.
  }
  // method: class 안에 있는 function
  createRestaurant(
    CreateRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    // const newRestaurant = new Restaurant();
    // newRestaurant.name = CreateRestaurantDto.name;
    // 이 과정을 typeORM에서는
    const newRestaurant = this.restaurants.create(CreateRestaurantDto);
    // 인스턴스 생성
    return this.restaurants.save(newRestaurant);
    // save()메서드를 사용하면 DB에 실제 저장이 된다.
  }
  updateRestaurant({ id, data }: UpdateRestaurantDto) {
    return this.restaurants.update(id, { ...data });
  }
  // update()는 promise를 return 함
}
