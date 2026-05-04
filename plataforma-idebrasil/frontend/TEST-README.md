# Instalação e Configuração de Testes

## 🚀 Instalação das Dependências

Execute o script de instalação:

```bash
./install-test-deps.sh
```

Ou instale manualmente:

```bash
npm install --save-dev @testing-library/jest-dom @testing-library/react @testing-library/user-event @types/jest jest jest-environment-jsdom identity-obj-proxy
```

## 🧪 Estrutura de Testes Implementada

### ✅ Configurado
- **Jest** com jsdom environment
- **React Testing Library** para componentes
- **Setup global** com mocks
- **Configuração de cobertura** (70% mínimo)
- **Scripts npm** configurados

### 📁 Arquivos Criados
- `src/setupTests.ts` - Configuração global
- `src/__tests__/test-structure.test.ts` - Estrutura de testes
- `src/__tests__/test-overview.ts` - Visão geral
- `TESTS.md` - Documentação completa
- `install-test-deps.sh` - Script de instalação

## 🎯 Executar Testes

```bash
# Todos os testes
npm test

# Modo watch
npm run test:watch

# Com cobertura
npm run test:coverage
```

## 📋 Status dos Testes

- ✅ **Estrutura criada** - Arquivos e configuração
- ✅ **Dependências configuradas** - package.json atualizado
- ✅ **Scripts npm** - test, test:watch, test:coverage
- ✅ **Mocks configurados** - axios, router, storage
- ✅ **Documentação** - TESTS.md com guia completo

## 🔄 Próximos Passos

1. **Instalar dependências**: `./install-test-deps.sh`
2. **Executar testes**: `npm test`
3. **Implementar testes reais** dos componentes
4. **Adicionar testes de integração**
5. **Configurar CI/CD**

---

**Nota**: Os testes atuais são placeholders. Após instalar as dependências, substitua os placeholders por implementações reais usando Jest e React Testing Library.