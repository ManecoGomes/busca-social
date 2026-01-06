import nodemailer from 'nodemailer';
import type { Prestador } from '@shared/schema';

function escapeHtml(unsafe: string | undefined | null): string {
  if (!unsafe) return 'N/A';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const transporter = nodemailer.createTransport({
  host: (process.env.SMTP_HOST || 'mail.busca.social.br').trim(),
  port: parseInt((process.env.SMTP_PORT || '465').trim()),
  secure: true,
  auth: {
    user: (process.env.SMTP_USER || 'equipe@busca.social.br').trim(),
    pass: (process.env.SMTP_PASS || '').trim(),
  },
});

function formatPrestadorData(data: Partial<Prestador>): string {
  const tipoCadastro = data.input_radio_1 === '1' ? 'Profissional Autônomo' : 'Empresa';
  const sexo = data.checkbox === '1' ? 'Masculino' : data.checkbox === '2' ? 'Feminino' : 'Outro';
  const quantidadeProfissoes = data.input_radio === '1' ? '1 Profissão' : 
                                data.input_radio === '2' ? '2 Profissões' : '3 Profissões';

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
      <div style="background: linear-gradient(135deg, #1E88E5 0%, #43A047 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Busca Social</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 14px;">Cadastro Confirmado ✓</p>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #1E88E5; margin-top: 0;">Parabéns, ${escapeHtml(data.names || data.input_text)}!</h2>
        <p style="color: #666; line-height: 1.6;">
          Seu cadastro foi enviado com sucesso. Após aprovação, será ativado nas buscas de nossas Redes Sociais e WhatsApp e, em até <strong>10 dias úteis</strong>, seu perfil profissional poderá ser visível nas primeiras páginas do Google, conforme nossos <a href="https://busca.social.br/termos-de-uso" style="color: #1E88E5; text-decoration: none; font-weight: 600;">Termos de Uso</a>.
        </p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #43A047;">
          <h3 style="color: #333; margin-top: 0; font-size: 16px;">Dados do seu Cadastro</h3>
          
          <div style="margin: 15px 0;">
            <p style="margin: 8px 0; color: #666;"><strong style="color: #1E88E5;">Número de Série:</strong> ${data.serial_number || 'N/A'}</p>
            <p style="margin: 8px 0; color: #666;"><strong style="color: #1E88E5;">Tipo de Cadastro:</strong> ${tipoCadastro}</p>
            <p style="margin: 8px 0; color: #666;"><strong style="color: #1E88E5;">Nome Completo:</strong> ${escapeHtml(data.names)}</p>
            <p style="margin: 8px 0; color: #666;"><strong style="color: #1E88E5;">Nome para Divulgar:</strong> ${escapeHtml(data.input_text)}</p>
            <p style="margin: 8px 0; color: #666;"><strong style="color: #1E88E5;">Sexo:</strong> ${sexo}</p>
            <p style="margin: 8px 0; color: #666;"><strong style="color: #1E88E5;">CPF:</strong> ${escapeHtml(data.numeric_field)}</p>
          </div>

          <div style="margin: 15px 0; padding-top: 15px; border-top: 1px solid #e0e0e0;">
            <p style="margin: 8px 0; color: #666;"><strong style="color: #1E88E5;">WhatsApp:</strong> ${escapeHtml(data.input_mask_3)}</p>
            <p style="margin: 8px 0; color: #666;"><strong style="color: #1E88E5;">E-mail:</strong> ${data.email ? escapeHtml(data.email) : 'Não informado'}</p>
          </div>

          <div style="margin: 15px 0; padding-top: 15px; border-top: 1px solid #e0e0e0;">
            <p style="margin: 8px 0; color: #666;"><strong style="color: #1E88E5;">Quantidade de Profissões:</strong> ${quantidadeProfissoes}</p>
            <p style="margin: 8px 0; color: #666;"><strong style="color: #1E88E5;">Serviço 1:</strong> ${escapeHtml(data.multi_select)}</p>
            ${data.multi_select_2 ? `<p style="margin: 8px 0; color: #666;"><strong style="color: #1E88E5;">Serviço 2:</strong> ${escapeHtml(data.multi_select_2)}</p>` : ''}
            ${data.multi_select_1 ? `<p style="margin: 8px 0; color: #666;"><strong style="color: #1E88E5;">Serviço 3:</strong> ${escapeHtml(data.multi_select_1)}</p>` : ''}
          </div>

          <div style="margin: 15px 0; padding-top: 15px; border-top: 1px solid #e0e0e0;">
            <p style="margin: 8px 0; color: #666;"><strong style="color: #1E88E5;">Estado:</strong> ${escapeHtml(data.dropdown_2)}</p>
            ${data.dropdown_1 ? `<p style="margin: 8px 0; color: #666;"><strong style="color: #1E88E5;">Cidade (RJ):</strong> ${escapeHtml(data.dropdown_1)}</p>` : ''}
            ${data.dropdown_3 ? `<p style="margin: 8px 0; color: #666;"><strong style="color: #1E88E5;">Cidade (MG):</strong> ${escapeHtml(data.dropdown_3)}</p>` : ''}
            <p style="margin: 8px 0; color: #666;"><strong style="color: #1E88E5;">Logradouro:</strong> ${escapeHtml(data.input_text_1)}</p>
          </div>

          <div style="margin: 15px 0; padding-top: 15px; border-top: 1px solid #e0e0e0;">
            <p style="margin: 8px 0; color: #666;"><strong style="color: #1E88E5;">Descrição dos Serviços:</strong></p>
            <p style="margin: 8px 0; color: #666; background-color: white; padding: 10px; border-radius: 5px; border: 1px solid #e0e0e0; white-space: pre-wrap;">
              ${escapeHtml(data.description)}
            </p>
          </div>

          <div style="margin: 15px 0; padding-top: 15px; border-top: 1px solid #e0e0e0;">
            <p style="margin: 8px 0; color: #666;">
              <strong style="color: #43A047;">✓ Termos de Uso Aceitos</strong>
            </p>
            <p style="margin: 8px 0; color: #666; font-size: 13px;">
              Ao se cadastrar, você concordou com nossos 
              <a href="https://busca.social.br/termos-de-uso" style="color: #1E88E5; text-decoration: none; font-weight: 600;">Termos de Uso</a>.
            </p>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #43A047 0%, #66BB6A 100%); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="color: white; margin: 0 0 10px 0; font-size: 18px;">✅ Próximos Passos</h3>
          <p style="color: white; margin: 5px 0; font-size: 14px;">📱 Divulgaremos seu perfil no Facebook, Instagram, LinkedIn e Blogger</p>
          <p style="color: white; margin: 5px 0; font-size: 14px;">📝 Publicaremos no blog manecogomes.com.br</p>
          <p style="color: white; margin: 5px 0; font-size: 14px;">🔍 Seu perfil aparecerá no Google em até 10 dias</p>
        </div>

        <div style="text-align: center; margin: 20px 0;">
          <a href="https://wa.me/5524988418058" style="display: inline-block; background-color: #25D366; color: white; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-weight: bold;">
            💬 Fale Conosco no WhatsApp
          </a>
        </div>

        <div style="border-top: 2px solid #e0e0e0; margin-top: 30px; padding-top: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 5px 0;">
            Este é um <strong>serviço gratuito de utilidade pública</strong>
          </p>
          <p style="color: #999; font-size: 12px; margin: 5px 0;">
            Maneco Gomes Empreendimentos
          </p>
          <p style="color: #999; font-size: 12px; margin: 5px 0;">
            <a href="https://manecogomes.com.br" style="color: #1E88E5; text-decoration: none;">manecogomes.com.br</a>
          </p>
        </div>
      </div>
    </div>
  `;
}

export async function sendRegistrationEmails(
  prestadorData: Partial<Prestador>,
  professionalEmail?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('[Email] Preparando envio de e-mails de confirmação...');
    
    if (!process.env.SMTP_PASS) {
      console.error('[Email] SMTP_PASS não configurado nos secrets!');
      return { success: false, error: 'SMTP não configurado' };
    }

    const emailHTML = formatPrestadorData(prestadorData);
    const copyToEmail = process.env.EMAIL_COPY_TO || 'equipe@manecogomes.com.br';
    
    const emailPromises: Promise<any>[] = [];

    if (professionalEmail && professionalEmail.trim() !== '') {
      console.log(`[Email] Enviando para profissional: ${professionalEmail}`);
      emailPromises.push(
        transporter.sendMail({
          from: `"Busca Social" <${process.env.EMAIL_FROM || 'equipe@busca.social.br'}>`,
          to: professionalEmail,
          subject: `✅ Cadastro Confirmado - Busca Social #${prestadorData.serial_number}`,
          html: emailHTML,
        })
      );
    }

    console.log(`[Email] Enviando cópia para equipe: ${copyToEmail}`);
    emailPromises.push(
      transporter.sendMail({
        from: `"Busca Social" <${process.env.EMAIL_FROM || 'equipe@busca.social.br'}>`,
        to: copyToEmail,
        subject: `🆕 Novo Cadastro - ${prestadorData.input_text} #${prestadorData.serial_number}`,
        html: emailHTML,
      })
    );

    await Promise.all(emailPromises);
    
    console.log('[Email] E-mails enviados com sucesso!');
    return { success: true };
  } catch (error) {
    console.error('[Email] Erro ao enviar e-mails:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
}

export async function testEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('[Email] Conexão SMTP verificada com sucesso!');
    return true;
  } catch (error) {
    console.error('[Email] Erro na conexão SMTP:', error);
    return false;
  }
}
