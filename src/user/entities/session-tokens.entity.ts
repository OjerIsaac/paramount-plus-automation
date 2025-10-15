import { Column, Entity } from 'typeorm';
import { BaseTable } from '../../libs/base';

@Entity({ name: 'session_tokens' })
export class SessionToken extends BaseTable {
  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  sessionId: string;
}
