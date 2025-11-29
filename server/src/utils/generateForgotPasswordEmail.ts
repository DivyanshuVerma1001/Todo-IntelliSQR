export const generateForgotPasswordEmail = (resetUrl: string) => {
  return `
    <div style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 600px; 
      margin: 0 auto; 
      padding: 20px; 
      background-color: #121212; 
      border-radius: 10px; 
      border: 1px solid #2e2e2e;
      color: #e0e0e0;
    ">

      <!-- Header -->
      <h2 style="
        text-align: center; 
        color: #00e6c3; 
        margin-bottom: 5px;
        font-weight: 700;
      ">
        Reset Your Password
      </h2>

      <p style="text-align:center; font-size:14px; color:#bdbdbd;">
        For <span style="color:#00e6c3; font-weight:bold;">Your Todo App</span>
      </p>

      <hr style="border: none; border-top: 1px solid #2e2e2e; margin: 20px 0;" />

      <!-- Message -->
      <p style="font-size:15px; color:#cccccc;">
        Dear User,
      </p>

      <p style="font-size:15px; color:#cccccc;">
        We received a password reset request. Click the button below to set a new password:
      </p>

      <!-- Reset Button -->
      <div style="text-align:center; margin: 30px 0;">
        <a href="${resetUrl}" 
          style="
            background-color: #00e6c3;
            color: #121212;
            padding: 14px 30px;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
            border-radius: 8px;
            display: inline-block;
          ">
          Reset Password
        </a>
      </div>

      <!-- Direct Link -->
      <p style="font-size:14px; color:#cccccc;">
        If the button doesn’t work, use this link:
      </p>

      <p style="
        font-size:13px; 
        color:#00e6c3;
        word-break: break-all;
      ">
        ${resetUrl}
      </p>

      <!-- Expiry Info -->
      <p style="font-size:14px; color:#cccccc;">
        The link is valid for <span style="color:#00e6c3; font-weight:bold;">10 minutes</span>.
      </p>

      <p style="font-size:14px; color:#cccccc;">
        If this wasn’t you, please ignore this email.
      </p>

      <hr style="border: none; border-top: 1px solid #2e2e2e; margin: 25px 0;" />

      <!-- Footer -->
      <footer style="text-align:center; font-size:12px; color:#666;">
        <p style="margin: 0;">Your Todo App — Organize. Focus. Achieve.</p>
        <p style="margin-top: 8px;">This is an automated message, please do not reply.</p>
      </footer>

    </div>
  `;
};
