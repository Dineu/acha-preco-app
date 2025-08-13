# Acha Preço - Assistente de Compras Inteligente

Este é um aplicativo Next.js criado com o Firebase Studio. Ele funciona como um assistente de compras pessoal, permitindo que os usuários criem e gerenciem listas de compras, comparem preços e recebam sugestões inteligentes alimentadas por IA para otimizar suas idas ao supermercado.

## Master Prompt para Reconstrução

> Você vai criar um aplicativo web completo usando Next.js, TypeScript e Tailwind CSS, integrado com Firebase para autenticação de usuários. A interface será construída com componentes **ShadCN/UI**. A principal funcionalidade é um assistente de compras de supermercado para a cidade de Indaiatuba, SP.
>
> **Tecnologias:**
> - **Framework**: Next.js (com App Router)
> - **Linguagem**: TypeScript
> - **Estilização**: Tailwind CSS, ShadCN/UI
> - **Autenticação**: Firebase Authentication (Email/Senha)
> - **Funcionalidades de IA**: Google AI (Gemini) através do Genkit
> - **Mapas**: Google Maps API
>
> **Estrutura e Funcionalidades:**
>
> 1.  **Autenticação de Usuário:**
>     - Crie páginas de Login (`/`) e Cadastro (`/signup`) com formulários para email e senha.
>     - Após o login, o usuário é redirecionado para o dashboard (`/dashboard`).
>     - Utilize o Firebase Authentication.
>
> 2.  **Layout do Dashboard (`/dashboard`):**
>     - Crie um layout principal com uma barra lateral de navegação (Sidebar).
>     - A sidebar deve ter links para: "Minhas Listas", "Mapa de Mercados" e "Testar IA".
>     - A sidebar deve ser expansível e recolhível.
>     - O cabeçalho deve conter um botão "Nova Lista" e um menu de usuário (UserNav) com links para o perfil e logout.
>
> 3.  **Página de Listas (`/dashboard`):**
>     - Exibe cartões com as listas de compras existentes do usuário.
>     - Cada cartão mostra o nome da lista, a data da última atualização e uma barra de progresso.
>     - Use dados mocados (`mockShoppingLists`) inicialmente.
>
> 4.  **Página de Detalhes da Lista (`/dashboard/lists/[id]`):**
>     - **Visualização da Lista**: Exibe os itens de uma lista específica em uma tabela única. A tabela deve ter colunas para "OK" (checkbox), "Item", "Mercado", "Preço" e "Ações" (remover).
>     - **Ordenação**: Os itens na tabela devem ser ordenados primeiro por nome do mercado (em ordem alfabética) e depois por nome do produto (em ordem alfabética).
>     - **Adicionar Item**: Um formulário no topo da página permite adicionar novos itens com nome, preço (opcional) e mercado (opcional).
>     - **Assistente de IA**: Na lateral, um painel com botões para acionar funcionalidades de IA:
>         - **"Comparar Preços"**: Usa a lista de compras atual para gerar uma tabela comparativa de preços estimados entre diferentes supermercados.
>         - **"Sugerir Itens Esquecidos"**: Sugere itens com base nos que já estão na lista.
>         - **"Melhor Preço"**: Sugere supermercados alternativos que podem ter melhores preços.
>     - **Carregar Oferta**: Um botão que permite ao usuário carregar uma imagem ou PDF de uma oferta de supermercado. A IA deve extrair os produtos e preços da imagem e permitir que o usuário adicione os itens extraídos diretamente à sua lista de compras.
>
> 5.  **Fluxos de IA (Genkit):**
>     - **`suggestMissingItems`**: Recebe uma lista de itens e retorna sugestões de itens complementares.
>     - **`suggestAlternateStores`**: Recebe uma lista de itens e um mercado atual, e sugere outros mercados mais baratos, usando uma ferramenta (`findSupermarketsTool`) que busca supermercados na cidade via Google Maps API.
>     - **`extractPromotionDetails`**: Recebe uma imagem (como data URI) de um folheto de promoção e extrai o nome do mercado e uma lista de produtos com seus respectivos preços.
>     - **`comparePrices`**: Recebe uma lista de itens e retorna uma tabela Markdown com uma estimativa comparativa de preços e uma recomendação de onde comprar.
>
> 6.  **Página do Mapa (`/dashboard/map`):**
>     - Exibe um mapa interativo do Google Maps centrado em Indaiatuba.
>     - Usa a Google Maps JavaScript API e a Places API para encontrar e exibir marcadores para os principais supermercados da cidade.
>     - Permite clicar em um marcador para destacá-lo e ver o nome do mercado.
>
> 7.  **Componentes:**
>     - Crie componentes reutilizáveis para o Logo, UserNav, Sidebar, etc.
>     - Use os componentes do ShadCN/UI sempre que possível (Card, Button, Input, Table, etc.).

## Como Configurar e Rodar o Projeto

Siga estas etapas para configurar o ambiente de desenvolvimento e rodar o aplicativo localmente.

### 1. Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### 2. Instale as Dependências

Clone o repositório (se já estiver no GitHub) ou, se estiver recriando, navegue até a pasta do projeto e execute:

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Você precisará de chaves de API para os serviços do Google (Firebase, Google Maps, Gemini).

1.  Crie um arquivo chamado `.env` na raiz do seu projeto.
2.  Adicione as seguintes variáveis a ele:

    ```env
    # Chave da API do Google AI (Gemini)
    # Habilite a "Generative Language API" no Google Cloud Console
    GEMINI_API_KEY=SUA_CHAVE_AQUI

    # Chave de API do Google Maps
    # Habilite "Maps JavaScript API" e "Places API" no Google Cloud Console
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=SUA_CHAVE_AQUI
    # Para as buscas no servidor (usado pela IA), você pode reusar a chave do Gemini ou criar uma específica
    GOOGLE_MAPS_API_KEY=SUA_CHAVE_AQUI

    # Configuração do Firebase
    # Crie um projeto no Firebase (https://console.firebase.google.com/)
    # Vá para as Configurações do Projeto > Geral > Seus aplicativos
    # Adicione um aplicativo Web e copie as credenciais aqui
    NEXT_PUBLIC_FIREBASE_API_KEY=SUA_CHAVE_AQUI
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=SEU_PROJETO.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=SEU_PROJETO_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=SEU_PROJETO.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=SEU_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=SEU_APP_ID
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=SEU_MEASUREMENT_ID
    ```

### 4. Rode o Aplicativo

Para iniciar o servidor de desenvolvimento, execute:

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:9002`.

## Como Enviar seu Código para o GitHub

Siga estas etapas para criar um novo repositório no GitHub e enviar seu projeto.

### 1. Crie um Repositório no GitHub

1.  Vá para [github.com](https://github.com) e faça login.
2.  Clique no botão **"+"** no canto superior direito e selecione **"New repository"**.
3.  Dê um nome ao seu repositório (ex: `acha-preco-app`).
4.  Escolha se o repositório será público ou privado.
5.  **Importante**: Não inicialize o repositório com um `README`, `.gitignore` ou licença. Vamos adicionar os arquivos do nosso projeto.
6.  Clique em **"Create repository"**.

### 2. Inicialize o Git no seu Projeto

Se você ainda não fez isso, abra um terminal na pasta raiz do seu projeto e execute:

```bash
git init -b main
```

Isso inicializa um repositório Git local e define o nome do branch principal como `main`.

### 3. Adicione e "Commite" seus Arquivos

Adicione todos os arquivos do seu projeto ao Git e faça o primeiro "commit" (um snapshot das suas alterações).

```bash
# Adiciona todos os arquivos
git add .

# Cria o primeiro commit
git commit -m "Commit inicial do projeto Acha Preço"
```

### 4. Conecte seu Repositório Local ao GitHub

Na página do seu novo repositório no GitHub, você verá um URL. Copie-o e use o seguinte comando no seu terminal, substituindo o URL pelo do seu repositório:

```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
```

### 5. Envie seu Código

Finalmente, envie seu commit para o GitHub:

```bash
git push -u origin main
```

Agora, seus arquivos estão seguros no GitHub! Para futuras alterações, basta repetir os passos 3 (com uma mensagem de commit diferente) e 5.
