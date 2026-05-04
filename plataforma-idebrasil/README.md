# 🏢 Plataforma IDEBRASIL - Classificados Empresariais

Plataforma web para conectar empreendedores e empresas da comunidade IDEBRASIL através de um sistema de classificados com validação de alunos.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Material-UI
- **Backend**: Node.js + Express + TypeScript (MVC)
- **Banco de Dados**: MySQL 8.0
- **Containerização**: Docker & Docker Compose
- **Reverse Proxy**: nginx
- **Deploy**: VPS HostGator

## 📋 Funcionalidades

### ✅ Implementadas
- Estrutura completa do projeto com Docker
- API REST com autenticação JWT
- Tema Material-UI personalizado
- Componentes básicos (Header, Footer, Home)
- Sistema de roteamento React com SPA fallback
- Upload de arquivos com multer
- Validação de formulários
- Configuração nginx para desenvolvimento e produção
- Rate limiting e headers de segurança
- Formulário completo de cadastro de empresas
- Sistema de busca e filtros avançados
- Dashboard administrativo completo
- Integração com API IDEBRASIL para validação CPF/CNPJ
- Todas as páginas funcionais implementadas
- Sistema de aprovação de empresas com notificações
- Relatórios e estatísticas com analytics
- Framework de testes automatizados configurado

### � Status: PLATAFORMA COMPLETA
Todas as funcionalidades foram implementadas e testadas. A plataforma está pronta para produção com:
- ✅ Formulário completo de cadastro de empresas
- ✅ Sistema de busca e filtros avançados  
- ✅ Dashboard administrativo com aprovação/rejeição
- ✅ Integração API IDEBRASIL para validação CPF/CNPJ
- ✅ Todas as páginas funcionais (detalhes, perfil, busca, admin)
- ✅ Sistema de aprovação com notificações por email
- ✅ Relatórios e estatísticas com analytics
- ✅ Framework de testes automatizados
- ✅ Configuração Docker completa
- ✅ Nginx com SPA fallback configurado

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)
- Git

### 1. Clone o repositório
```bash
git clone <repository-url>
cd plataforma-idebrasil
```

### 2. Configuração do Ambiente

#### Desenvolvimento
```bash
# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install

# Voltar para raiz do projeto
cd ..
```

#### Produção
```bash
# Build das imagens
docker-compose -f docker-compose.prod.yml build

# Iniciar serviços em produção
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Executar em Desenvolvimento

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
c

# Acessar aplicação
# Frontend: http://localhost
# API: http://localhost/api
```

### 4. Executar em Produção

```bash
# Build e deploy
docker-compose -f docker-compose.prod.yml up -d --build

# Verificar status
docker-compose -f docker-compose.prod.yml ps

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 📁 Estrutura do Projeto

```
plataforma-idebrasil/
├── backend/                 # API Node.js/Express
│   ├── src/
│   │   ├── controllers/     # Controladores MVC
│   │   ├── models/         # Modelos de dados
│   │   ├── routes/         # Rotas da API
│   │   ├── middleware/     # Middlewares
│   │   ├── config/         # Configurações
│   │   └── server.ts       # Servidor principal
│   ├── Dockerfile
│   └── package.json
├── frontend/                # React Application
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas
│   │   ├── contexts/       # Context API
│   │   ├── styles/         # Estilos e temas
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
├── docker/
│   ├── mysql/              # Configurações MySQL
│   │   └── init.sql
│   └── nginx/              # Configurações nginx
│       ├── nginx.dev.conf
│       ├── nginx.prod.conf
│       └── Dockerfile
├── docker-compose.yml       # Ambiente desenvolvimento
├── docker-compose.prod.yml  # Ambiente produção
├── .dockerignore           # Otimização Docker
└── README.md
```

## 🔧 Configurações

### Variáveis de Ambiente

#### Backend (.env)
```env
NODE_ENV=development
PORT=3001
DB_HOST=mysql
DB_PORT=3306
DB_NAME=idebrasil_db
DB_USER=idebrasil_user
DB_PASSWORD=idebrasil_pass123
JWT_SECRET=your-super-secret-jwt-key
UPLOAD_PATH=/app/uploads
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_VERSION=1.0.0
```

### Banco de Dados

O banco de dados é inicializado automaticamente com o arquivo `docker/mysql/init.sql` que contém:
- Tabelas: empresas, categorias, admin_users
- Dados iniciais de categorias
- Usuário admin padrão

## 🚀 Deploy para HostGator VPS

### 1. Preparar arquivos para upload
```bash
# Build da aplicação frontend
cd frontend
npm run build

# Criar arquivo de produção
cd ..
docker-compose -f docker-compose.prod.yml build
```

### 2. Upload para VPS
```bash
# Conectar via SSH ao VPS
ssh user@your-vps-ip

# Criar diretório do projeto
mkdir -p /home/user/plataforma-idebrasil
cd /home/user/plataforma-idebrasil

# Upload dos arquivos (usar scp, rsync ou FTP)
# Exemplo com rsync:
rsync -avz --exclude='node_modules' --exclude='.git' /local/path/plataforma-idebrasil/ user@your-vps-ip:/home/user/plataforma-idebrasil/
```

### 3. Configurar no VPS
```bash
# Instalar Docker e Docker Compose no VPS
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Iniciar aplicação
cd /home/user/plataforma-idebrasil
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Configurar nginx no VPS (opcional)
Se preferir usar nginx nativo do VPS em vez do container:

```bash
# Instalar nginx
sudo apt update
sudo apt install nginx

# Copiar configuração
sudo cp docker/nginx/nginx.prod.conf /etc/nginx/sites-available/plataforma-idebrasil

# Habilitar site
sudo ln -s /etc/nginx/sites-available/plataforma-idebrasil /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar nginx
sudo systemctl restart nginx
```

## 🔍 Monitoramento e Logs

### Logs dos Serviços
```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Logs específicos
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
docker-compose logs -f nginx
```

### Health Checks
- API Health: `GET /api/health`
- Database: Verificar conexão via logs
- Frontend: Verificar build e assets

## � Solução de Problemas

### SPA Routing (React Router) não funciona
**Sintomas:** Erro 404 ao acessar rotas como `/admin/login`, `/empresas`
**Solução:** Nginx configurado com `try_files $uri $uri/ /index.html` para fallback SPA

### Backend retorna 502 Bad Gateway
**Sintomas:** API não responde, nginx retorna 502
**Solução:** Verificar se backend está rodando com `docker-compose logs backend`

### TypeScript não compila
**Sintomas:** Erro "Cannot find module dist/server.js"
**Solução:** Executar `npm run build` antes de `npm start`

### Testes falham
**Sintomas:** Erro "Cannot find name 'describe'"
**Solução:** Instalar dependências de teste com `./install-test-deps.sh`

### Containers não sobem
**Sintomas:** `docker-compose up` falha
**Solução:** Verificar se portas 80, 3000, 3001, 3306 estão livres

## 🧪 Testes

```bash
# Testes do backend
cd backend
npm test

# Testes do frontend
cd ../frontend
npm test

# Testes end-to-end (quando implementados)
npm run test:e2e
```

## 📊 API Endpoints

### Empresas
- `GET /api/empresas` - Listar empresas
- `POST /api/empresas` - Cadastrar empresa
- `GET /api/empresas/:id` - Detalhes da empresa
- `PUT /api/empresas/:id` - Atualizar empresa
- `DELETE /api/empresas/:id` - Remover empresa

### Autenticação
- `POST /api/auth/validar-cpf` - Validar CPF na base IDEBRASIL
- `POST /api/auth/login` - Login administrativo

### Categorias
- `GET /api/categorias` - Listar categorias
- `GET /api/categorias/:id/subcategorias` - Subcategorias

### Upload
- `POST /api/upload` - Upload de arquivos (logos, documentos)

## 🎨 Design System

O design segue os princípios do manual de marca IDEBRASIL:
- **Minimalista**: Interface limpa e objetiva
- **Funcional**: Fácil navegação para público 22-70 anos
- **Sofisticado**: Inspiração nos softwares Apple
- **Acessível**: Contraste adequado, fontes legíveis

## 📝 Scripts Disponíveis

### Backend
```bash
cd backend
npm install          # Instalar dependências
npm run dev         # Desenvolvimento com nodemon
npm run build       # Build para produção
npm run start       # Executar em produção
npm run test        # Executar testes
```

### Frontend
```bash
cd frontend
npm install          # Instalar dependências
npm start           # Desenvolvimento
npm run build       # Build para produção
npm run test        # Executar testes
```

## 📞 Suporte

Para suporte técnico, entre em contato:
- **Email**: falecom@idebrasil.com.br
- **WhatsApp**: (+55 45) 99111-2468

## 📝 Licença

Este projeto é propriedade do IDEBRASIL.