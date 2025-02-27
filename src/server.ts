import { issuer } from '@openauthjs/openauth';
import { PasswordProvider } from '@openauthjs/openauth/provider/password';
import { PasswordUI } from '@openauthjs/openauth/ui/password';
import { MemoryStorage } from '@openauthjs/openauth/storage/memory';
import { serve } from '@hono/node-server';
import nodemailer from 'nodemailer';

import { subjects, UserDatabase } from './userdb.js';
import path from 'node:path';
import { verifyEmailMessage } from './email.js';

async function main() {
  const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;
  const USER_DB_URL = process.env.USER_DB_URL;
  const DATA_DIR = process.env.DATA_DIR || '/data';
  const SMTP_MAILER_URL = process.env.SMTP_MAILER_URL;

  if (!USER_DB_URL) {
    console.error('USER_DB_URL is not set');
    process.exit(1);
  }
  if (!SMTP_MAILER_URL) {
    console.error('SMTP_MAILER_URL is not set');
    process.exit(1);
  }

  const userDatabase = new UserDatabase({
    dbUrl: new URL(USER_DB_URL)
  });

  await userDatabase.connect();

  const smtpUrl = new URL(SMTP_MAILER_URL);
  const transporter = nodemailer.createTransport({
    host: smtpUrl.hostname,
    port: Number(smtpUrl.port),
    secure: smtpUrl.protocol === 'smtps:',
    auth: {
      user: smtpUrl.username.replace('%40', '@'),
      pass: smtpUrl.password
    }
  });

  const app = issuer({
    providers: {
      password: PasswordProvider(
        PasswordUI({
          sendCode: async (email, code) => {
            try {
              console.log(email, code);
              transporter.sendMail(verifyEmailMessage(email, code));
            } catch (err) {
              console.error('Failed to send email:', err);
            }
          }
        })
      )
    },
    subjects,
    async success(ctx, value) {
      let userId = 'anonymous';
      if (value.provider === 'password') {
        const user = await userDatabase.findUserByEmail(value.email);
        if (!user) {
          userId = await userDatabase.createUser({ email: value.email });
        } else {
          userId = user.userId;
        }
      }
      return ctx.subject('user', { userId });
    },
    storage: MemoryStorage({ persist: path.join(DATA_DIR, 'persist.json') })
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
}

main();
