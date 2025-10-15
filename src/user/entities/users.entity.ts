import { Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseTable } from '../../libs/base';

@Entity({ name: 'users' })
export class User extends BaseTable {
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'text', nullable: false })
  password: string;
}
