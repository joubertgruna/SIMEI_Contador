#!/bin/bash

# Script de instalação das dependências de teste
# Plataforma IDEBRASIL - Frontend

echo "🚀 Instalando dependências de teste para a Plataforma IDEBRASIL..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório do frontend (plataforma-idebrasil/frontend/)"
    exit 1
fi

echo "📦 Instalando bibliotecas de teste..."

# Instalar dependências de desenvolvimento para testes
npm install --save-dev \
    @testing-library/jest-dom \
    @testing-library/react \
    @testing-library/user-event \
    @types/jest \
    jest \
    jest-environment-jsdom \
    identity-obj-proxy

if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso!"
    echo ""
    echo "🎯 Para executar os testes:"
    echo "  npm test              # Executar todos os testes"
    echo "  npm run test:watch    # Modo watch para desenvolvimento"
    echo "  npm run test:coverage # Com relatório de cobertura"
    echo ""
    echo "📖 Consulte TESTS.md para mais informações sobre a estrutura de testes."
else
    echo "❌ Erro ao instalar dependências. Verifique sua conexão com a internet."
    exit 1
fi