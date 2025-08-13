import { mockShoppingLists } from '@/lib/data';
import ShoppingListClientPage from '@/components/shopping-list-client-page';
import { notFound } from 'next/navigation';

/**
 * @fileoverview Esta é a página do lado do servidor para exibir os detalhes de uma lista de compras específica.
 * Sua principal responsabilidade é buscar os dados da lista com base no ID fornecido na URL.
 * Os dados são então passados para um componente de cliente (`ShoppingListClientPage`) que lida com toda a interatividade.
 * @param params Os parâmetros da rota, contendo o ID da lista.
 */

// Função auxiliar para buscar a lista.
// Em uma aplicação real, isso seria uma chamada ao banco de dados (ex: Firestore).
async function getList(id: string) {
  // O método `find` é síncrono, então o envolvemos em uma Promise resolvida
  // para simular o comportamento assíncrono de uma busca em banco de dados.
  return Promise.resolve(mockShoppingLists.find((l) => l.id === id));
}

// O componente da página em si. É uma função assíncrona porque precisa esperar pelos dados.
export default async function ShoppingListPage({ params }: { params: { id: string } }) {
  // Acessa o id a partir dos parâmetros da rota.
  const { id } = params;

  // Busca os dados da lista. O `await` garante que esperamos a "chamada de API" terminar.
  const list = await getList(id);

  // Se nenhuma lista com o ID fornecido for encontrada, exibe a página de "não encontrado" (404).
  if (!list) {
    notFound();
  }

  // Renderiza o componente de cliente, passando a lista encontrada como propriedade inicial.
  return <ShoppingListClientPage initialList={list} />;
}
