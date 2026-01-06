import { PROFISSOES } from '../client/src/data/cadastro-data';

async function restoreProfessions() {
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

  const cookies = loginResponse.headers.get('set-cookie');
  console.log('✅ Login realizado com sucesso!');

  // 2. Migrar profissões
  console.log(`\n📊 Total de profissões a restaurar: ${PROFISSOES.length}`);
  console.log('🚀 Iniciando restauração...\n');

  const migrateResponse = await fetch(`${apiUrl}/api/admin/professions/migrate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies || '',
    },
    body: JSON.stringify({ professions: PROFISSOES }),
  });

  if (!migrateResponse.ok) {
    const error = await migrateResponse.text();
    throw new Error(`Falha na migração: ${error}`);
  }

  const result = await migrateResponse.json();
  
  console.log('✅ Restauração concluída!');
  console.log(`   📝 Adicionadas: ${result.added}`);
  console.log(`   ⏭️  Puladas (duplicadas): ${result.skipped}`);
  console.log(`   📊 Total: ${result.total}`);
  console.log('\n✨ Processo concluído com sucesso!');
}

restoreProfessions().catch((error) => {
  console.error('❌ Erro:', error.message);
  process.exit(1);
});
