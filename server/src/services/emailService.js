import { Resend } from 'resend';
import { logger } from '../utils/logger.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || 'Moovie <noreply@moovie.com>';

/**
 * Generate a 6-digit OTP code
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send verification email with OTP
 */
export const sendVerificationEmail = async (email, code, name) => {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verify your Moovie account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #141414; font-family: 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #141414; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
                  <!-- Logo -->
                  <tr>
                    <td align="center" style="padding-bottom: 30px;">
                      <h1 style="color: #E50914; font-size: 36px; font-weight: bold; margin: 0; letter-spacing: 2px;">
                        <span style="color: white;">M</span>OOVIE
                      </h1>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="background-color: #1a1a1a; border-radius: 8px; padding: 40px;">
                      <h2 style="color: white; font-size: 24px; margin: 0 0 20px 0;">
                        Welcome${name ? `, ${name}` : ''}!
                      </h2>
                      <p style="color: #b3b3b3; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                        Thanks for signing up for Moovie. Please use the verification code below to complete your registration:
                      </p>

                      <!-- OTP Code -->
                      <div style="background-color: #2a2a2a; border-radius: 8px; padding: 30px; text-align: center; margin-bottom: 30px;">
                        <p style="color: #808080; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">
                          Your verification code
                        </p>
                        <p style="color: white; font-size: 42px; font-weight: bold; letter-spacing: 8px; margin: 0;">
                          ${code}
                        </p>
                      </div>

                      <p style="color: #808080; font-size: 14px; line-height: 20px; margin: 0;">
                        This code will expire in <strong style="color: white;">10 minutes</strong>.
                        <br><br>
                        If you didn't create a Moovie account, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding-top: 30px; text-align: center;">
                      <p style="color: #808080; font-size: 12px; margin: 0;">
                        This email was sent by Moovie. Please do not reply to this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      logger.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }

    logger.info(`Verification email sent to ${email}`);
    return data;
  } catch (error) {
    logger.error('Email service error:', error);
    throw error;
  }
};

/**
 * Send password reset email with OTP
 */
export const sendPasswordResetEmail = async (email, code, name) => {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Reset your Moovie password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #141414; font-family: 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #141414; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
                  <!-- Logo -->
                  <tr>
                    <td align="center" style="padding-bottom: 30px;">
                      <h1 style="color: #E50914; font-size: 36px; font-weight: bold; margin: 0; letter-spacing: 2px;">
                        <span style="color: white;">M</span>OOVIE
                      </h1>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="background-color: #1a1a1a; border-radius: 8px; padding: 40px;">
                      <h2 style="color: white; font-size: 24px; margin: 0 0 20px 0;">
                        Reset your password
                      </h2>
                      <p style="color: #b3b3b3; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                        Hi${name ? ` ${name}` : ''}, we received a request to reset your password. Use the code below to proceed:
                      </p>

                      <!-- OTP Code -->
                      <div style="background-color: #2a2a2a; border-radius: 8px; padding: 30px; text-align: center; margin-bottom: 30px;">
                        <p style="color: #808080; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">
                          Your reset code
                        </p>
                        <p style="color: white; font-size: 42px; font-weight: bold; letter-spacing: 8px; margin: 0;">
                          ${code}
                        </p>
                      </div>

                      <p style="color: #808080; font-size: 14px; line-height: 20px; margin: 0;">
                        This code will expire in <strong style="color: white;">10 minutes</strong>.
                        <br><br>
                        If you didn't request a password reset, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding-top: 30px; text-align: center;">
                      <p style="color: #808080; font-size: 12px; margin: 0;">
                        This email was sent by Moovie. Please do not reply to this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      logger.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }

    logger.info(`Password reset email sent to ${email}`);
    return data;
  } catch (error) {
    logger.error('Email service error:', error);
    throw error;
  }
};

export default {
  generateOTP,
  sendVerificationEmail,
  sendPasswordResetEmail,
};
