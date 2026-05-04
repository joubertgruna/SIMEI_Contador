import { default as axios } from 'axios';
import { getApiUrl } from '../utils/runtimeConfig';

export interface EmailNotificacao {
  para: string;
  assunto: string;
  corpo: string;
  tipo: 'aprovacao' | 'rejeicao' | 'pendente' | 'boas_vindas' | 'atualizacao';
}

export interface NotificacaoResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

class NotificacaoService {
  private baseURL = getApiUrl() || process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  async enviarNotificacaoAprovacao(email: string, nomeEmpresa: string, observacao?: string): Promise<NotificacaoResponse> {
    const notificacao: EmailNotificacao = {
      para: email,
      assunto: '🎉 Sua empresa foi aprovada no IDEBRASIL!',
      corpo: this.gerarCorpoAprovacao(nomeEmpresa, observacao),
      tipo: 'aprovacao'
    };

    return this.enviarEmail(notificacao);
  }

  async enviarNotificacaoRejeicao(email: string, nomeEmpresa: string, motivo: string): Promise<NotificacaoResponse> {
    const notificacao: EmailNotificacao = {
      para: email,
      assunto: '⚠️ Cadastro não aprovado - IDEBRASIL',
      corpo: this.gerarCorpoRejeicao(nomeEmpresa, motivo),
      tipo: 'rejeicao'
    };

    return this.enviarEmail(notificacao);
  }

  async enviarNotificacaoPendente(email: string, nomeEmpresa: string): Promise<NotificacaoResponse> {
    const notificacao: EmailNotificacao = {
      para: email,
      assunto: '⏳ Cadastro em análise - IDEBRASIL',
      corpo: this.gerarCorpoPendente(nomeEmpresa),
      tipo: 'pendente'
    };

    return this.enviarEmail(notificacao);
  }

  async enviarNotificacaoBoasVindas(email: string, nome: string): Promise<NotificacaoResponse> {
    const notificacao: EmailNotificacao = {
      para: email,
      assunto: '👋 Bem-vindo ao IDEBRASIL!',
      corpo: this.gerarCorpoBoasVindas(nome),
      tipo: 'boas_vindas'
    };

    return this.enviarEmail(notificacao);
  }

  async enviarNotificacaoAtualizacao(email: string, nomeEmpresa: string, alteracoes: string[]): Promise<NotificacaoResponse> {
    const notificacao: EmailNotificacao = {
      para: email,
      assunto: '📝 Perfil atualizado - IDEBRASIL',
      corpo: this.gerarCorpoAtualizacao(nomeEmpresa, alteracoes),
      tipo: 'atualizacao'
    };

    return this.enviarEmail(notificacao);
  }

  private async enviarEmail(notificacao: EmailNotificacao): Promise<NotificacaoResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/notificacoes/email`, notificacao, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        messageId: response.data.messageId
      };
    } catch (error: any) {
      console.error('Erro ao enviar email:', error);

      // Em desenvolvimento, simular envio
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Email simulado enviado:', notificacao);
        return {
          success: true,
          messageId: `simulado-${Date.now()}`
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao enviar email'
      };
    }
  }

  private gerarCorpoAprovacao(nomeEmpresa: string, observacao?: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: linear-gradient(135deg, #1a365d, #2d3748); color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; max-width: 600px; margin: 0 auto; }
    .button { background: #48bb78; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
    .footer { background: #f7fafc; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 Parabéns!</h1>
    <p>Sua empresa foi aprovada no IDEBRASIL</p>
  </div>

  <div class="content">
    <h2>Olá!</h2>
    <p>Estamos felizes em informar que <strong>${nomeEmpresa}</strong> foi aprovada em nossa plataforma!</p>

    ${observacao ? `<p><strong>Observação:</strong> ${observacao}</p>` : ''}

    <p>Agora sua empresa está visível para todos os usuários da plataforma e você pode:</p>
    <ul>
      <li>Receber contatos de potenciais clientes</li>
      <li>Gerenciar seu perfil empresarial</li>
      <li>Acessar estatísticas de visualização</li>
      <li>Participar de nossa rede de negócios</li>
    </ul>

    <a href="${process.env.REACT_APP_FRONTEND_URL || 'https://idebrasil.com.br'}/perfil" class="button">
      Acessar Meu Perfil
    </a>

    <p>Em caso de dúvidas, entre em contato conosco.</p>
  </div>

  <div class="footer">
    <p>IDEBRASIL - Plataforma de Classificados Empresariais</p>
    <p>Este é um email automático, por favor não responda.</p>
  </div>
</body>
</html>
    `.trim();
  }

  private gerarCorpoRejeicao(nomeEmpresa: string, motivo: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: linear-gradient(135deg, #c53030, #742a2a); color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; max-width: 600px; margin: 0 auto; }
    .button { background: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
    .footer { background: #f7fafc; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>⚠️ Cadastro Não Aprovado</h1>
  </div>

  <div class="content">
    <h2>Olá,</h2>
    <p>Informamos que o cadastro de <strong>${nomeEmpresa}</strong> não foi aprovado em nossa plataforma.</p>

    <div style="background: #fed7d7; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <strong>Motivo da rejeição:</strong><br>
      ${motivo}
    </div>

    <p>Para corrigir as pendências e tentar novamente:</p>
    <ol>
      <li>Faça as correções necessárias nos dados</li>
      <li>Certifique-se de que todos os documentos estão válidos</li>
      <li>Envie uma nova solicitação de cadastro</li>
    </ol>

    <a href="${process.env.REACT_APP_FRONTEND_URL || 'https://idebrasil.com.br'}/cadastro" class="button">
      Refazer Cadastro
    </a>

    <p>Em caso de dúvidas, entre em contato com nosso suporte.</p>
  </div>

  <div class="footer">
    <p>IDEBRASIL - Plataforma de Classificados Empresariais</p>
    <p>Este é um email automático, por favor não responda.</p>
  </div>
</body>
</html>
    `.trim();
  }

  private gerarCorpoPendente(nomeEmpresa: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: linear-gradient(135deg, #ed8936, #dd6b20); color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; max-width: 600px; margin: 0 auto; }
    .footer { background: #f7fafc; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>⏳ Cadastro em Análise</h1>
  </div>

  <div class="content">
    <h2>Olá!</h2>
    <p>O cadastro de <strong>${nomeEmpresa}</strong> foi recebido e está sendo analisado por nossa equipe.</p>

    <p>O processo de análise geralmente leva de 2 a 5 dias úteis. Você receberá um email assim que houver uma decisão.</p>

    <p>Enquanto isso, você pode acompanhar o status do seu cadastro através da plataforma.</p>

    <p>Agradecemos pela paciência!</p>
  </div>

  <div class="footer">
    <p>IDEBRASIL - Plataforma de Classificados Empresariais</p>
    <p>Este é um email automático, por favor não responda.</p>
  </div>
</body>
</html>
    `.trim();
  }

  private gerarCorpoBoasVindas(nome: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: linear-gradient(135deg, #1a365d, #2d3748); color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; max-width: 600px; margin: 0 auto; }
    .button { background: #48bb78; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
    .footer { background: #f7fafc; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>👋 Bem-vindo ao IDEBRASIL!</h1>
  </div>

  <div class="content">
    <h2>Olá, ${nome}!</h2>
    <p>Seja muito bem-vindo à plataforma IDEBRASIL, a maior rede de classificados empresariais do Brasil!</p>

    <p>Para completar seu cadastro, você precisa fornecer algumas informações sobre sua empresa. Assim que aprovado, você poderá:</p>

    <ul>
      <li>Divulgar seus produtos e serviços</li>
      <li>Conectar-se com outros empresários</li>
      <li>Encontrar fornecedores e parceiros</li>
      <li>Crescer seu negócio na rede IDEBRASIL</li>
    </ul>

    <a href="${process.env.REACT_APP_FRONTEND_URL || 'https://idebrasil.com.br'}/cadastro-empresa" class="button">
      Completar Cadastro
    </a>

    <p>Qualquer dúvida, estamos à disposição!</p>
  </div>

  <div class="footer">
    <p>IDEBRASIL - Plataforma de Classificados Empresariais</p>
    <p>Este é um email automático, por favor não responda.</p>
  </div>
</body>
</html>
    `.trim();
  }

  private gerarCorpoAtualizacao(nomeEmpresa: string, alteracoes: string[]): string {
    const listaAlteracoes = alteracoes.map(alt => `<li>${alt}</li>`).join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: linear-gradient(135deg, #3182ce, #2c5282); color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; max-width: 600px; margin: 0 auto; }
    .button { background: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
    .footer { background: #f7fafc; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📝 Perfil Atualizado</h1>
  </div>

  <div class="content">
    <h2>Olá!</h2>
    <p>As informações de <strong>${nomeEmpresa}</strong> foram atualizadas com sucesso.</p>

    <p><strong>Alterações realizadas:</strong></p>
    <ul>
      ${listaAlteracoes}
    </ul>

    <a href="${process.env.REACT_APP_FRONTEND_URL || 'https://idebrasil.com.br'}/perfil" class="button">
      Ver Perfil Atualizado
    </a>

    <p>Se você não realizou essas alterações, entre em contato conosco imediatamente.</p>
  </div>

  <div class="footer">
    <p>IDEBRASIL - Plataforma de Classificados Empresariais</p>
    <p>Este é um email automático, por favor não responda.</p>
  </div>
</body>
</html>
    `.trim();
  }
}

export const notificacaoService = new NotificacaoService();