#!/bin/bash

# Script de Deploy para Plataforma IDEBRASIL
# Uso: ./deploy.sh [dev|prod]

set -e

ENVIRONMENT=${1:-dev}
PROJECT_NAME="plataforma-idebrasil"

echo "🚀 Iniciando deploy da $PROJECT_NAME para ambiente: $ENVIRONMENT"

# Verificar se Docker e Docker Compose estão instalados
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Instale o Docker primeiro."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Instale o Docker Compose primeiro."
    exit 1
fi

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado. Copiando .env.example..."
    cp .env.example .env
    echo "✅ Arquivo .env criado. Edite as variáveis de ambiente se necessário."
fi

case $ENVIRONMENT in
    "dev")
        echo "🏗️  Construindo ambiente de desenvolvimento..."

        # Parar containers existentes
        echo "🛑 Parando containers existentes..."
        docker-compose down || true

        # Construir e iniciar serviços
        echo "🔨 Construindo imagens..."
        docker-compose build --no-cache

        echo "▶️  Iniciando serviços..."
        docker-compose up -d

        echo "📊 Verificando status..."
        docker-compose ps

        echo "✅ Deploy de desenvolvimento concluído!"
        echo "🌐 Acesse: http://localhost"
        echo "📋 API: http://localhost/api"
        ;;

    "prod")
        echo "🏗️  Construindo ambiente de produção..."

        # Parar containers existentes
        echo "🛑 Parando containers existentes..."
        docker-compose -f docker-compose.prod.yml down || true

        # Limpar imagens não utilizadas (opcional)
        echo "🧹 Limpando imagens não utilizadas..."
        docker image prune -f || true

        # Construir imagens de produção
        echo "🔨 Construindo imagens de produção..."
        docker-compose -f docker-compose.prod.yml build --no-cache

        # Iniciar serviços em produção
        echo "▶️  Iniciando serviços em produção..."
        docker-compose -f docker-compose.prod.yml up -d

        echo "📊 Verificando status..."
        docker-compose -f docker-compose.prod.yml ps

        # Aguardar serviços ficarem prontos
        echo "⏳ Aguardando serviços ficarem prontos..."
        sleep 10

        # Verificar health check
        echo "🏥 Verificando health check..."
        if curl -f http://localhost/health &> /dev/null; then
            echo "✅ Health check passou!"
        else
            echo "⚠️  Health check falhou. Verifique os logs:"
            docker-compose -f docker-compose.prod.yml logs nginx
        fi

        echo "✅ Deploy de produção concluído!"
        echo "🌐 Acesse: http://localhost"
        ;;

    *)
        echo "❌ Ambiente inválido. Use 'dev' ou 'prod'."
        echo "Exemplo: ./deploy.sh prod"
        exit 1
        ;;
esac

echo ""
echo "📋 Comandos úteis:"
echo "  Ver logs: docker-compose logs -f"
echo "  Parar: docker-compose down"
echo "  Reiniciar: docker-compose restart"
echo ""
echo "🎉 Deploy finalizado com sucesso!"