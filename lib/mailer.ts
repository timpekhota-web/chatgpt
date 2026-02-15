export async function sendOrderConfirmationEmail(email: string, orderId: string): Promise<void> {
  // Placeholder: integrate with Resend/SendGrid/Brevo in production.
  console.info(`Order confirmation sent to ${email} for order ${orderId}`);
}
