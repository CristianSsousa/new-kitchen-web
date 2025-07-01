# Frontend - Chá de Casa Nova

Interface web desenvolvida em React + TypeScript para gerenciamento de lista de presentes, confirmações de presença e mensagens para chá de casa nova.

## 🚀 Tecnologias

-   [React](https://reactjs.org/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Vite](https://vitejs.dev/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [React Router DOM](https://reactrouter.com/)
-   [React Hook Form](https://react-hook-form.com/)
-   [Framer Motion](https://www.framer.com/motion/)
-   [Lucide React](https://lucide.dev/)
-   [React Hot Toast](https://react-hot-toast.com/)
-   [Axios](https://axios-http.com/)
-   [date-fns](https://date-fns.org/)

## 📋 Pré-requisitos

-   Node.js 16.x ou superior
-   npm ou yarn

## 🔧 Instalação

1. Clone o repositório
2. Entre na pasta do frontend:

```bash
cd frontend
```

3. Instale as dependências:

```bash
npm install
# ou
yarn
```

4. Crie um arquivo `.env` baseado no exemplo:

```bash
cp .env.example .env
```

## ⚙️ Configuração

No arquivo `.env`, configure as variáveis de ambiente:

```env
VITE_API_URL=http://localhost:8080 # URL da API backend
```

## 🏃‍♂️ Rodando o projeto

### Ambiente de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

O site estará disponível em `http://localhost:5173`

### Build para produção

```bash
npm run build
# ou
yarn build
```

### Preview do build

```bash
npm run preview
# ou
yarn preview
```

## 📱 Funcionalidades

### Área Pública

-   Visualização da lista de presentes
-   Resgate de presentes
-   Envio de mensagens
-   Confirmação de presença
-   Visualização de estatísticas básicas
-   Visualização de mensagens aprovadas

### Área Administrativa

-   Gerenciamento completo de presentes
-   Aprovação/remoção de mensagens
-   Visualização de todas as confirmações
-   Estatísticas detalhadas
-   Configuração de informações do evento

## 📦 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/     # Componentes React reutilizáveis
│   ├── contexts/      # Contextos React (ex: autenticação)
│   ├── hooks/         # Hooks personalizados
│   ├── pages/         # Páginas da aplicação
│   ├── services/      # Serviços de API
│   ├── types/         # Tipos TypeScript
│   ├── utils/         # Funções utilitárias
│   ├── App.tsx        # Componente principal
│   └── main.tsx       # Ponto de entrada
├── public/           # Arquivos públicos
└── index.html        # HTML principal
```

## 🔐 Autenticação

A área administrativa é protegida por senha. Para acessar:

1. Acesse a página de login
2. Digite a senha administrativa
3. Você será redirecionado para a área admin

## 🎨 Estilização

O projeto utiliza Tailwind CSS para estilização. Os principais arquivos de configuração são:

-   `tailwind.config.js` - Configuração do Tailwind
-   `src/index.css` - Estilos globais
-   `postcss.config.js` - Configuração do PostCSS
