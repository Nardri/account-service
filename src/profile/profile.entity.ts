import { Entity, Column, OneToOne } from 'typeorm';

import BaseEntity from '../shared/base/base.entity';
import UserEntity from '../user/user.entity';

export enum Gender {
  None = 0,
  Male = 1,
  Female = 2,
}

@Entity({ name: 'profile' })
export default class ProfileEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 225,
    nullable: true,
  })
  photoUrl: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  phone: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: Gender,
    default: Gender.None,
  })
  gender: Gender;

  @OneToOne(
    () => UserEntity,
    user => user.profile,
  )
  user: UserEntity;
}
