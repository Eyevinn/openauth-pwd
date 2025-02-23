import { createSubjects } from '@openauthjs/openauth/subject';
import nano from 'nano';
import { object, string } from 'valibot';

export const subjects = createSubjects({
  user: object({
    userId: string()
  })
});

interface UserEntry {
  userId: string;
  email: string;
}

export class UserDatabase {
  private dbUrl: URL;
  private client;
  private db: nano.DocumentScope<UserEntry> | undefined;

  constructor({ dbUrl }: { dbUrl: URL }) {
    this.dbUrl = dbUrl;
    this.client = nano(new URL('/', this.dbUrl).toString());
  }

  async connect() {
    const dbName = this.dbUrl.pathname.slice(1);
    console.log(`Connecting to database ${dbName}`);
    this.db = this.client.use<UserEntry>(dbName);
    console.log('Connected to database');
  }

  async findUserByEmail(email: string) {
    if (!this.db) {
      throw new Error('Database is not connected');
    }

    const result = await this.db.find({
      selector: {
        email
      }
    });

    return result.docs[0];
  }

  async createUser({ email }: { email: string }) {
    if (!this.db) {
      throw new Error('Database is not connected');
    }

    const userId = crypto.randomUUID();
    const result = await this.db.insert({
      userId,
      email
    });

    if (result.ok) {
      return userId;
    }
    throw new Error('Failed to create user');
  }
}
