import { createClient } from '@supabase/supabase-js';

async function bootstrap() {
  const url = process.env.SUPABASE_URL ?? '';
  const key = process.env.SUPABASE_KEY ?? '';

  if (!url || !key) {
    throw 'URL or Key is invalid.';
  }

  const supabase = createClient(url, key);

  await supabase.auth.signInWithPassword({
    email: 'email_here@email.com',
    password: 'pass',
  });

  const { data, error } = await supabase.auth.updateUser({
    data: { newInfo: 'here' },
  });

  console.log(data);
  console.log(error);

  return;
}

bootstrap();
