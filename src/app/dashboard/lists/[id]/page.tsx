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
  // Envolvemos a busca em uma Promise para garantir um comportamento assíncrono.
  // Isso ajuda a evitar problemas de compilação com o Next.js (Turbopack).
  return new Promise((resolve) => {
    const list = mockShoppingLists.find((l) => l.id === id);
    resolve(list);
  });
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
