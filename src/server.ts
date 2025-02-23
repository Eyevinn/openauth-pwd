import { issuer } from '@openauthjs/openauth';
import { PasswordProvider } from '@openauthjs/openauth/provider/password';
import { PasswordUI } from '@openauthjs/openauth/ui/password';
import { MemoryStorage } from '@openauthjs/openauth/storage/memory';
import { createSubjects } from '@openauthjs/openauth/subject';
import { object, string } from 'valibot';
import { serve } from '@hono/node-server';

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

const subjects = createSubjects({
  user: object({
    userId: string()
  })
});

const app = issuer({
  providers: {
    password: PasswordProvider(
      PasswordUI({
        sendCode: async (email, code) => {
          console.log(email, code);
        }
      })
    )
  },
  subjects,
  async success(ctx, value) {
    let userId = 'anonymous';
    if (value.provider === 'password') {
      console.log(value.email);
      userId = value.email || 'anonymous';
    }
    return ctx.subject('user', { userId });
  },
  storage: MemoryStorage()
});

serve(
  {
    fetch: app.fetch,
    port: PORT
  },
  (info) => {
    console.log(`Server is running on ${info.address}:${info.port}`);
  }
);
