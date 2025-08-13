// To run this test:
// 1. Make sure you have your GEMINI_API_KEY in a .env file in the root of the project.
// 2. Execute the following command in your terminal:
//    npx tsx src/ai/test-flow.ts

import { config } from 'dotenv';
config(); // Load environment variables from .env file

import { suggestMissingItems } from '@/lib/actions';

async function runTest() {
  console.log('🧪 Iniciando teste do fluxo de IA: suggestMissingItems...');

  const testInput = {
    existingItems: ['Leite', 'Pão', 'Manteiga'],
  };

  console.log('📥 Enviando para a IA a seguinte lista:', testInput.existingItems);

  try {
    const result = await suggestMissingItems(testInput);
    console.log('✅ Teste concluído com sucesso!');
    console.log('📤 Resultado recebido da IA:');
    console.log(result);
  } catch (error) {
    console.error('❌ Teste falhou!');
    console.error('Ocorreu um erro ao chamar o fluxo de IA:', error);
  }
}

// Run the test
runTest();
