import { Resend } from "resend";

const key = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM || "The Luxe Edit <onboarding@resend.dev>";

export const resend = key ? new Resend(key) : null;

export async function sendEmail({ to, subject, html }) {
  if (!resend) {
    console.log("[email stub]", { to, subject });
    return { id: "stub" };
  }
  return resend.emails.send({ from, to, subject, html });
}
