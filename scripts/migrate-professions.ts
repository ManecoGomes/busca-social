import { PROFISSOES } from '../client/src/data/cadastro-data';

async function migrateProfessions() {
  const apiUrl = 'http://localhost:5000';
  
  console.log('🔐 Fazendo login...');
  
  // 1. Fazer login
  const loginResponse = await fetch(`${apiUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'manecogomes',
      password: '@!Md887400@!',
    }),
  });

  if (!loginResponse.ok) {
    throw new Error('Falha no login');
  }

  // Pegar o cookie de sessão
  const setCookie = loginResponse.headers.get('set-cookie');
  if (!setCookie) {
    throw new Error('Cookie de sessão não encontrado');
  }

  console.log('✅ Login realizado com sucesso!');
  console.log(`📊 Total de profissões a migrar: ${PROFISSOES.length}`);
  
  // 2. Migrar profissões
  console.log('🚀 Iniciando migração...');
  
  const migrateResponse = await fetch(`${apiUrl}/api/admin/professions/migrate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': setCookie,
    },
    body: JSON.stringify({ professions: PROFISSOES }),
  });

  if (!migrateResponse.ok) {
    const error = await migrateResponse.json();
    throw new Error(`Falha na migração: ${JSON.stringify(error)}`);
  }

  const result = await migrateResponse.json();
  console.log('✅ Migração concluída!');
  console.log(`   📝 Adicionadas: ${result.added}`);
  console.log(`   ⏭️  Puladas (duplicadas): ${result.skipped}`);
  console.log(`   📊 Total: ${result.total}`);
}

migrateProfessions()
  .then(() => {
    console.log('\n✨ Processo concluído com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro:', error.message);
    process.exit(1);
  });
