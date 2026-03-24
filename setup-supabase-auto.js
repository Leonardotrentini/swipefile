const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dns = require('dns').promises;

async function setupSupabase(password) {
  try {
    console.log('🚀 LT ARTS - Supabase Setup\n');

    if (!password || password.trim() === '') {
      console.error('❌ Senha não pode estar vazia.');
      process.exit(1);
    }

    // Connection string
    const connectionString = `postgresql://postgres:${password}@db.ckpbxtdvpsnayuoojrwe.supabase.co:5432/postgres`;

    console.log('⏳ Conectando ao Supabase...');
    console.log(`Host: db.ckpbxtdvpsnayuoojrwe.supabase.co:5432\n`);

    const client = new Client({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      statement_timeout: 30000,
      query_timeout: 30000,
      connect_timeout: 30000,
    });

    // Set DNS preference to IPv4 if available
    dns.setServers(['8.8.8.8', '8.8.4.4']);

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

      const newDatabaseUrl = `postgresql://postgres:${password}@db.ckpbxtdvpsnayuoojrwe.supabase.co:5432/postgres?sslmode=require`;
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

  } catch (err) {
    console.error('❌ Erro durante setup:');
    console.error('Erro detalhado:', err.message);
    console.error('\nDicas de troubleshooting:');
    console.error('1. Verificar se a senha está correta');
    console.error('2. Verificar se a conta Supabase está ativa');
    console.error('3. Tentar resolver manualmente via SQL Console do Supabase:');
    console.error('   - Abra: https://app.supabase.com');
    console.error('   - Selecione projeto LT ARTS');
    console.log('   - SQL Editor → New Query');
    console.error('   - Cole o conteúdo de: database/init_supabase.sql');
    process.exit(1);
  }
}

// Get password from command line or environment
const password = process.argv[2] || process.env.DB_PASSWORD;
setupSupabase(password);
