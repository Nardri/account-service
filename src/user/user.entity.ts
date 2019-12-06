import {
  Entity, Column, OneToOne, JoinColumn, 
} from 'typeorm';
import { Exclude } from 'class-transformer';

import BaseEntity from '../shared/base/base.entity';
import ProfileEntity from '../profile/profile.entity';

@Entity({ name: 'users' })
export default class UserEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  email: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  password: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  verified: boolean;

  @OneToOne(
    () => ProfileEntity,
    profile => profile.user,
    {
      onDelete: 'CASCADE',
      cascade: true,
    },
  )
  @JoinColumn()
  profile: ProfileEntity;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  roleId: string;
}
