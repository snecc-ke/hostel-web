function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && port && user && pass) {
    try {
      // Lazy require so missing nodemailer doesn't crash dev when not used
      const nodemailer = require("nodemailer");
      return nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465,
        auth: { user, pass },
      });
    } catch (err) {
      console.warn("nodemailer not installed or failed to load; falling back to console: ", err.message);
    }
  }

  // Fallback: use a no-op transporter that logs to console
  return {
    sendMail: async (opts) => {
      console.log("[email-fallback] sendMail called with:", opts);
      return { accepted: [opts.to] };
    },
  };
}

const transporter = getTransporter();

export async function sendEmail({ to, subject, text, html, from }) {
  const fromAddr = from || process.env.FROM_EMAIL || "no-reply@hostel-platform.local";
  try {
    const res = await transporter.sendMail({ from: fromAddr, to, subject, text, html });
    return res;
  } catch (err) {
    console.error("sendEmail error:", err);
    throw err;
  }
}
