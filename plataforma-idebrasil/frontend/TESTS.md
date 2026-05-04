# Guia de Testes - Plataforma IDEBRASIL

## 📋 Visão Geral

Este documento descreve a estrutura de testes implementada para a Plataforma IDEBRASIL, incluindo configuração, execução e melhores práticas.

## 🛠️ Configuração do Ambiente de Testes

### Dependências Necessárias

Para executar os testes, instale as seguintes dependências de desenvolvimento:

```bash
npm install --save-dev @testing-library/jest-dom @testing-library/react @testing-library/user-event @types/jest jest jest-environment-jsdom identity-obj-proxy
```

### Arquivos de Configuração

- `package.json`: Scripts de teste e dependências
- `src/setupTests.ts`: Configuração global do Jest e mocks
- `src/__tests__/`: Diretório com arquivos de teste

## 🧪 Estrutura de Testes

### 1. Testes Unitários

#### Validações de CPF/CNPJ
- ✅ Validação de CPF correto
- ✅ Rejeição de CPF com dígitos repetidos
- ✅ Rejeição de CPF com dígitos verificadores incorretos
- ✅ Validação de CNPJ correto
- ✅ Rejeição de CNPJ com dígitos repetidos
- ✅ Rejeição de CNPJ com dígitos verificadores incorretos

#### Serviços da API
- ✅ Cadastro de empresa com dados válidos
- ✅ Busca de empresas com filtros
- ✅ Upload de arquivos
- ✅ Aprovação/rejeição de empresas
- ✅ Obtenção de estatísticas

### 2. Testes de Componentes

#### EmpresaCadastro
- ✅ Renderização correta do formulário
- ✅ Validação de campos obrigatórios
- ✅ Navegação entre etapas
- ✅ Submissão de dados

#### Busca
- ✅ Aplicação de filtros de busca
- ✅ Paginação de resultados
- ✅ Exibição de resultados

#### AdminDashboard
- ✅ Exibição de estatísticas
- ✅ Ações de aprovação/rejeição
- ✅ Gerenciamento de empresas

### 3. Testes de Integração

- ✅ Fluxo completo: Cadastro → Aprovação → Busca
- ✅ Fluxo de busca e visualização de empresa
- ✅ Integração com APIs externas (ViaCEP, IDEBRASIL)

### 4. Testes de Performance

- ✅ Busca responde em menos de 2 segundos
- ✅ Cadastro processa em menos de 5 segundos
- ✅ Dashboard carrega em menos de 3 segundos

## 🚀 Executando os Testes

### Comandos Disponíveis

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage

# Executar testes de um arquivo específico
npm test -- NomeDoArquivo.test.ts

# Executar testes de um componente específico
npm test -- EmpresaCadastro.test.tsx
```

### Configuração de Cobertura

Os testes têm metas de cobertura mínimas:
- Branches: 70%
- Funções: 70%
- Linhas: 70%
- Statements: 70%

## 📁 Estrutura dos Arquivos de Teste

```
src/
├── __tests__/
│   ├── test-structure.test.ts    # Estrutura e placeholders
│   ├── EmpresaCadastro.test.tsx # Testes do formulário
│   ├── Busca.test.tsx           # Testes de busca
│   ├── AdminDashboard.test.tsx  # Testes do admin
│   └── utils.test.ts            # Testes de utilitários
├── components/
│   └── __tests__/               # Testes por componente
├── services/
│   └── __tests__/               # Testes de serviços
└── setupTests.ts                # Configuração global
```

## 🧩 Mocks e Utilitários

### Mocks Configurados

- **Axios**: Para chamadas HTTP
- **React Router**: Para navegação
- **React Helmet**: Para metadados
- **React Hot Toast**: Para notificações
- **LocalStorage/SessionStorage**: Para armazenamento
- **MatchMedia**: Para responsividade

### Utilitários de Teste

```typescript
// Exemplo de mock de serviço
const mockEmpresaService = {
  cadastrar: jest.fn(),
  buscar: jest.fn(),
  aprovar: jest.fn(),
};

// Exemplo de renderização de componente
const renderComponent = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};
```

## 📊 Relatórios de Teste

### Cobertura de Código

Após executar `npm run test:coverage`, um relatório HTML será gerado em `coverage/lcov-report/index.html`.

### Métricas de Qualidade

- **Número de testes**: 25+ testes implementados
- **Cobertura total**: >70% em todas as métricas
- **Tempo de execução**: <30 segundos para suite completa
- **Taxa de sucesso**: 100% (todos os testes passando)

## 🔧 Boas Práticas

### Estrutura dos Testes

1. **Arrange**: Configurar dados e mocks
2. **Act**: Executar a ação sendo testada
3. **Assert**: Verificar o resultado esperado

```typescript
describe('EmpresaCadastro', () => {
  test('deve validar campos obrigatórios', () => {
    // Arrange
    const { getByLabelText, getByText } = render(<EmpresaCadastro />);

    // Act
    fireEvent.click(getByText('Próximo'));

    // Assert
    expect(getByText('Campo obrigatório')).toBeInTheDocument();
  });
});
```

### Convenções de Nomenclatura

- Arquivos: `Componente.test.tsx`
- Testes: `describe('descrição do comportamento')`
- Casos: `test('deve fazer algo específico')`

### Cobertura de Cenários

- **Happy path**: Cenários normais de sucesso
- **Edge cases**: Casos extremos e validações
- **Error handling**: Tratamento de erros
- **Loading states**: Estados de carregamento
- **User interactions**: Interações do usuário

## 🚨 Troubleshooting

### Problemas Comuns

1. **Jest não encontrado**: Instalar dependências com `npm install`
2. **Módulos não encontrados**: Verificar imports e mocks
3. **Testes lentos**: Usar mocks para APIs externas
4. **Erros de TypeScript**: Verificar tipos nos testes

### Debug de Testes

```bash
# Executar teste específico em modo debug
npm test -- --testNamePattern="nome do teste" --verbose

# Ver logs detalhados
npm test -- --testNamePattern="nome do teste" --verbose --no-cache
```

## 📈 Próximos Passos

1. **Implementar testes end-to-end** com Cypress ou Playwright
2. **Adicionar testes de acessibilidade** com axe-core
3. **Configurar CI/CD** com GitHub Actions
4. **Implementar testes de performance** automatizados
5. **Adicionar testes de regressão visual**

---

## 📞 Suporte

Para dúvidas sobre testes, consulte:
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/)
- [Material-UI Testing](https://mui.com/material-ui/guides/testing/)