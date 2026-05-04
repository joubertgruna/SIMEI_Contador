# IDEBRASIL Design System

## Visão Geral
O design system da Plataforma IDEBRASIL foi desenvolvido seguindo princípios de design minimalista e profissional, inspirado na estética da Apple, com foco na usabilidade para o público de 22-70 anos.

## Paleta de Cores

### Cores Primárias
- **Azul Institucional**: `#1e88e5` - Representa confiança, profissionalismo e tecnologia
- **Verde de Sucesso**: `#4caf50` - Indica validação, acesso e crescimento
- **Laranja de Destaque**: `#ff9800` - Atrai atenção para elementos importantes

### Cores de Estado
- **Sucesso**: Verde (`#4caf50`) - Ações positivas e validações
- **Aviso**: Laranja (`#ff9800`) - Atenção necessária
- **Erro**: Vermelho (`#f44336`) - Problemas ou validações falhadas
- **Info**: Azul claro (`#2196f3`) - Informações gerais

### Escala de Cinzas
- **Texto Principal**: `#212121` - Alto contraste para acessibilidade
- **Texto Secundário**: `#616161` - Texto de suporte
- **Fundo**: `#fafafa` - Fundo limpo e minimalista
- **Superfícies**: `#ffffff` - Papel/card backgrounds

## Tipografia

### Família de Fontes
- **Primária**: Inter (sans-serif moderna)
- **Fallback**: Roboto, Helvetica, Arial

### Escala Tipográfica
- **H1**: 2.5rem (40px) - Títulos principais
- **H2**: 2rem (32px) - Seções importantes
- **H3**: 1.75rem (28px) - Subseções
- **Corpo**: 1rem (16px) - Texto principal
- **Pequeno**: 0.875rem (14px) - Texto secundário

## Componentes

### Botões
- **Border Radius**: 8px
- **Padding**: 12px 24px
- **Transições**: 0.2s ease-in-out
- **Estados**: Hover com elevação sutil

### Cards
- **Border Radius**: 12px
- **Shadow**: 0 2px 8px rgba(0, 0, 0, 0.1)
- **Hover**: Elevação aumentada + translateY

### Formulários
- **Border Radius**: 8px para inputs
- **Focus**: Outline azul institucional
- **Estados**: Hover e focus com transições suaves

## Espaçamentos

### Sistema de Spacing
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px
- **xxxl**: 64px

## Acessibilidade

### Contraste
- Texto principal: 21:1 (WCAG AAA)
- Texto secundário: 4.5:1 (WCAG AA)

### Foco
- Outline: 2px solid azul institucional
- Offset: 2px para visibilidade

### Navegação por Teclado
- Todos os elementos interativos são acessíveis
- Estados de foco claramente visíveis

## Princípios de Design

1. **Minimalismo**: Interfaces limpas com foco no conteúdo
2. **Consistência**: Padrões visuais uniformes
3. **Acessibilidade**: Design inclusivo para todas as idades
4. **Profissionalismo**: Aparência institucional confiável
5. **Usabilidade**: Fluxos intuitivos e eficientes

## Implementação

O design system está implementado usando:
- **Material-UI**: Componentes base com tema customizado
- **CSS Custom Properties**: Para consistência de cores
- **TypeScript**: Tipagem forte para propriedades de design
- **Responsive Design**: Adaptação para diferentes dispositivos

## Arquivos do Design System

- `src/styles/theme.ts` - Tema principal do Material-UI
- `src/styles/constants.ts` - Constantes de design reutilizáveis
- `src/styles/index.css` - Estilos globais e utilitários