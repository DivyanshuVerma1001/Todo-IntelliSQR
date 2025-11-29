import { Resend } from 'resend';

interface SendEmailParams {
  email: string;
  subject: string;
  message: string;
}

const getResendInstance = (): Resend => {
  const apiKey = process.env.RESEND_API;
  if (!apiKey) {
    throw new Error('RESEND_API environment variable is not set');
  }
  return new Resend(apiKey);
};

export const sendEmailR = async ({ email, subject, message }: SendEmailParams): Promise<void> => {
  try {
    const resend = getResendInstance();
    await resend.emails.send({
      from: 'Todo <noreply@divyanshu-verma.me>',
      to: [email],
      subject,
      html: message,
    });
    console.log('Email sent successfully via Resend');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

