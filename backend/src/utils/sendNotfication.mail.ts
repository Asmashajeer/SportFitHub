import { transporter } from '@/utils/mailer';
type NotificationDetailValue = string | number | boolean | Date | undefined | null;
interface NotificationEmailProps {
  to: string;
  title: string;
  description: string;
  details: Record<string,  NotificationDetailValue> & { userName: string };
  closingLine: string;
}

export const sendNotificationEmail = async ({ to, title, description, details, closingLine }: NotificationEmailProps): Promise<void> => {
  const buildDetailsRows = (details: Record<string, NotificationDetailValue> & { userName: string }): string => {
    return Object.entries(details)
      .filter(([key, value]) => key !== 'userName' && value !== undefined && value !== null)
      .map(([key, value]) => `<p style="margin: 4px 0;"><strong>${key}:</strong> ${value}</p>`)
      .join('');
  };
  try {
    await transporter.sendMail({
      from: `"SportFitHub" <${process.env.GMAIL_USER}>`,
      to,
      subject: `App Notification - ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #2563eb;">${title}</h2>
          <p>Hi <strong>${details.userName}</strong>,</p>
          <p>${description}</p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
            <p style="margin: 0;">${buildDetailsRows(details)}</p>
          </div>
          <p>${closingLine}</p>
          <footer style="margin-top: 20px; font-size: 11px; color: #888;">
            SportFit Hub Dubai - 2026
          </footer>
        </div>`,
    });
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Email send failed:', error);
  }
};
