import nodemailer from 'nodemailer';
import { prisma } from './prisma';

export async function sendEmail(options: { to: string; subject: string; html: string }) {
  // Fetch SMTP settings
  const settings = await prisma.systemSetting.findMany({
    where: {
      key: { in: ['senderEmail', 'smtpHost', 'smtpPort', 'smtpUser', 'smtpPass', 'smtpSsl', 'smtpTls'] }
    }
  });

  const config: Record<string, string> = {};
  settings.forEach(s => config[s.key] = s.value);

  if (!config.smtpHost || !config.smtpUser || !config.smtpPass) {
    console.log('[Email] SMTP não configurado. Simulando envio:');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Content: ${options.html}`);
    return false;
  }

  const transport = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort) || 587,
    secure: config.smtpSsl === 'true',
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    const info = await transport.sendMail({
      from: config.senderEmail || config.smtpUser,
      to: options.to,
      subject: options.subject,
      html: options.html
    });
    console.log('[Email] Enviado:', info.messageId);
    return true;
  } catch (err) {
    console.error('[Email] Erro ao enviar:', err);
    throw err;
  }
}
