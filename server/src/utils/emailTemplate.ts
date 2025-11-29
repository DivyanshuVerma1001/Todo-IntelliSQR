export const generateEmailTemplate = (verificationCode: number): string => {
  return `
    <div style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 20px; 
      border: 1px solid #2e2e2e; 
      border-radius: 10px; 
      background-color: #121212; 
      color: #e0e0e0;
    ">

      <!-- Header -->
      <h2 style="
        color: #00e6c3; 
        text-align: center; 
        margin-bottom: 10px;
        font-weight: 700;
      ">
        Verify Your Email
      </h2>

      <p style="font-size: 15px; color: #bdbdbd; text-align: center;">
        Welcome to <span style="color:#00e6c3; font-weight:bold;">Your Todo App</span>!
      </p>

      <!-- Verification Code Box -->
      <p style="font-size: 15px; color: #cccccc; margin-top: 20px;">
        Dear User,
      </p>

      <p style="font-size: 15px; color: #cccccc;">
        Enter the verification code below to activate your account:
      </p>
      
      <div style="text-align: center; margin: 25px 0;">
        <span style="
          display: inline-block; 
          font-size: 28px; 
          font-weight: bold; 
          color: #121212; 
          padding: 14px 34px; 
          border-radius: 8px; 
          background-color: #00e6c3;
          box-shadow: 0px 4px 10px rgba(0,0,0,0.3);
        ">
          ${verificationCode}
        </span>
      </div>

      <!-- Expiry Warning -->
      <p style="font-size: 14px; color: #cccccc;">
        This code will expire in 
        <span style="color:#00e6c3; font-weight:bold;">10 minutes</span>.
      </p>

      <p style="font-size: 14px; color: #cccccc;">
        If you didn’t request this, simply ignore this email.
      </p>

      <!-- Footer -->
      <footer style="margin-top: 28px; text-align: center; font-size: 13px; color: #777;">
        <p style="margin: 0;">
          Your Todo App — Organize. Focus. Achieve.
        </p>
        <p style="font-size: 11px; color: #666; margin-top: 8px;">
          This is an automated message. Please do not reply.
        </p>
      </footer>
    </div>
  `;
};
