# Makefile para Plataforma IDEBRASIL
.PHONY: help install dev prod build clean logs stop restart

# Cores para output
GREEN := \033[0;32m
BLUE := \033[0;34m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Variáveis
COMPOSE_FILE_DEV = docker-compose.yml
COMPOSE_FILE_PROD = docker-compose.prod.yml

help: ## Mostra esta ajuda
	@echo "$(BLUE)Plataforma IDEBRASIL - Comandos disponíveis:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-15s$(NC) %s\n", $$1, $$2}'

install: ## Instala dependências dos projetos
	@echo "$(BLUE)Instalando dependências do backend...$(NC)"
	cd backend && npm install
	@echo "$(BLUE)Instalando dependências do frontend...$(NC)"
	cd frontend && npm install
	@echo "$(GREEN)Dependências instaladas!$(NC)"

dev: ## Inicia ambiente de desenvolvimento
	@echo "$(BLUE)Iniciando ambiente de desenvolvimento...$(NC)"
	docker-compose -f $(COMPOSE_FILE_DEV) up -d --build
	@echo "$(GREEN)Ambiente de desenvolvimento iniciado!$(NC)"
	@echo "$(YELLOW)Acesse: http://localhost$(NC)"

prod: ## Inicia ambiente de produção
	@echo "$(BLUE)Iniciando ambiente de produção...$(NC)"
	docker-compose -f $(COMPOSE_FILE_PROD) up -d --build
	@echo "$(GREEN)Ambiente de produção iniciado!$(NC)"
	@echo "$(YELLOW)Acesse: http://localhost$(NC)"

build: ## Build das imagens Docker
	@echo "$(BLUE)Construindo imagens...$(NC)"
	docker-compose -f $(COMPOSE_FILE_DEV) build --no-cache
	docker-compose -f $(COMPOSE_FILE_PROD) build --no-cache
	@echo "$(GREEN)Imagens construídas!$(NC)"

clean: ## Remove containers, volumes e imagens
	@echo "$(RED)Removendo containers e volumes...$(NC)"
	docker-compose -f $(COMPOSE_FILE_DEV) down -v --remove-orphans
	docker-compose -f $(COMPOSE_FILE_PROD) down -v --remove-orphans
	@echo "$(RED)Limpando imagens não utilizadas...$(NC)"
	docker image prune -f
	docker volume prune -f
	@echo "$(GREEN)Limpeza concluída!$(NC)"

logs: ## Mostra logs dos containers
	@echo "$(BLUE)Mostrando logs (pressione Ctrl+C para sair)...$(NC)"
	docker-compose -f $(COMPOSE_FILE_DEV) logs -f

logs-prod: ## Mostra logs da produção
	@echo "$(BLUE)Mostrando logs de produção (pressione Ctrl+C para sair)...$(NC)"
	docker-compose -f $(COMPOSE_FILE_PROD) logs -f

stop: ## Para todos os containers
	@echo "$(YELLOW)Parando containers...$(NC)"
	docker-compose -f $(COMPOSE_FILE_DEV) down
	docker-compose -f $(COMPOSE_FILE_PROD) down
	@echo "$(GREEN)Containers parados!$(NC)"

restart: ## Reinicia os containers
	@echo "$(BLUE)Reiniciando containers...$(NC)"
	docker-compose -f $(COMPOSE_FILE_DEV) restart
	@echo "$(GREEN)Containers reiniciados!$(NC)"

restart-prod: ## Reinicia containers de produção
	@echo "$(BLUE)Reiniciando containers de produção...$(NC)"
	docker-compose -f $(COMPOSE_FILE_PROD) restart
	@echo "$(GREEN)Containers de produção reiniciados!$(NC)"

status: ## Mostra status dos containers
	@echo "$(BLUE)Status dos containers de desenvolvimento:$(NC)"
	docker-compose -f $(COMPOSE_FILE_DEV) ps
	@echo "$(BLUE)Status dos containers de produção:$(NC)"
	docker-compose -f $(COMPOSE_FILE_PROD) ps

shell-backend: ## Acessa shell do container backend
	@echo "$(BLUE)Acessando shell do backend...$(NC)"
	docker-compose -f $(COMPOSE_FILE_DEV) exec backend sh

shell-db: ## Acessa shell do container MySQL
	@echo "$(BLUE)Acessando MySQL...$(NC)"
	docker-compose -f $(COMPOSE_FILE_DEV) exec mysql mysql -u idebrasil_user -p idebrasil_db

test: ## Executa testes
	@echo "$(BLUE)Executando testes do backend...$(NC)"
	cd backend && npm test
	@echo "$(BLUE)Executando testes do frontend...$(NC)"
	cd frontend && npm test

lint: ## Executa linting
	@echo "$(BLUE)Executando linting do backend...$(NC)"
	cd backend && npm run lint
	@echo "$(BLUE)Executando linting do frontend...$(NC)"
	cd frontend && npm run lint

format: ## Formata código
	@echo "$(BLUE)Formatando código do backend...$(NC)"
	cd backend && npm run format
	@echo "$(BLUE)Formatando código do frontend...$(NC)"
	cd frontend && npm run format

update: ## Atualiza dependências
	@echo "$(BLUE)Atualizando dependências do backend...$(NC)"
	cd backend && npm update
	@echo "$(BLUE)Atualizando dependências do frontend...$(NC)"
	cd frontend && npm update
	@echo "$(GREEN)Dependências atualizadas!$(NC)"

backup-db: ## Faz backup do banco de dados
	@echo "$(BLUE)Fazendo backup do banco...$(NC)"
	docker-compose -f $(COMPOSE_FILE_DEV) exec mysql mysqldump -u idebrasil_user -p idebrasil_db > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)Backup criado!$(NC)"

deploy: ## Deploy simplificado (usa script deploy.sh)
	@echo "$(BLUE)Executando deploy...$(NC)"
	./deploy.sh prod