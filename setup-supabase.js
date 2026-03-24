const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupSupabase() {
  try {
    console.log('🚀 LT ARTS - Supabase Setup\n');

    // Get password from user
    console.log('Para prosseguir, você precisa da senha do banco de dados Supabase.');
    console.log('Encontre em: https://app.supabase.com → seu projeto → Settings → Database\n');

    const password = await prompt('Digite a senha do banco Supabase: ');

    if (!password || password.trim() === '') {
      console.error('❌ Senha não pode estar vazia.');
      rl.close();
      process.exit(1);
    }

    // Connection string
    const connectionString = `postgresql://postgres:${password}@db.ckpbxtdvpsnayuoojrwe.supabase.co:5432/postgres`;

    console.log('\n⏳ Conectando ao Supabase...');

    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();
    console.log('✅ Conectado com sucesso!\n');

    // Read SQL file
    const sqlPath = path.join(__dirname, 'database', 'init_supabase.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

    // Split by statements and filter empty ones
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    console.log(`⏳ Executando ${statements.length} comandos SQL...\n`);

    let successCount = 0;
    for (const statement of statements) {
      try {
        await client.query(statement);
        successCount++;

        // Show progress for key operations
        if (statement.includes('CREATE TABLE')) {
          const tableName = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1];
          if (tableName) console.log(`✓ Tabela criada: ${tableName}`);
        }
        if (statement.includes('CREATE INDEX')) {
          console.log('✓ Índice criado');
        }
        if (statement.includes('INSERT INTO offers')) {
          console.log('✓ 7 ofertas inseridas');
        }
      } catch (err) {
        console.error(`⚠️ Erro em comando SQL: ${err.message.substring(0, 100)}`);
      }
    }

    // Verify data
    console.log('\n📊 Verificando dados...');
    const result = await client.query('SELECT COUNT(*) as total_offers FROM offers;');
    const totalOffers = parseInt(result.rows[0].total_offers);

    console.log(`✅ Total de ofertas criadas: ${totalOffers}\n`);

    if (totalOffers === 7) {
      console.log('✅ Setup concluído com sucesso!\n');

      // Update .env file
      console.log('📝 Atualizando arquivo .env do backend...');
      const envPath = path.join(__dirname, 'backend', '.env');
      let envContent = fs.readFileSync(envPath, 'utf-8');

      const newDatabaseUrl = `postgresql://postgres:${password}@db.ckpbxtdvpsnayuoojrwe.supabase.co:5432/postgres`;
      envContent = envContent.replace(
        /DATABASE_URL=.*/,
        `DATABASE_URL=${newDatabaseUrl}`
      );

      fs.writeFileSync(envPath, envContent);
      console.log('✅ Arquivo .env atualizado\n');

      console.log('🎉 Próximos passos:');
      console.log('1. Reinicie o backend: cd backend && py -m uvicorn main:app --reload');
      console.log('2. Teste: curl http://localhost:8001/offers');
      console.log('3. Frontend já deve usar os dados do Supabase\n');
    } else {
      console.warn(`⚠️ Esperava 7 ofertas, mas encontrou ${totalOffers}`);
    }

    await client.end();
    rl.close();

  } catch (err) {
    console.error('❌ Erro durante setup:');
    console.error(err.message);
    rl.close();
    process.exit(1);
  }
}

setupSupabase();
