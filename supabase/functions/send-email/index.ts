// supabase/functions/send-email/index.ts
// supabase/functions/send-email/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import React from "react";
import ReactDOMServer from "react-dom/server";

// Import email templates
import UserVerificationEmail from "../emails/user-verification-email.jsx";
import SearchAlertEmail from "../emails/search-alert-email.jsx";
import PasswordResetEmail from "../emails/password-reset-email.jsx";

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  const { to, subject, template, templateProps } = await req.json();
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

  let htmlContent = "";

  switch (template) {
    case "UserVerificationEmail":
      htmlContent = ReactDOMServer.renderToString(
        React.createElement(UserVerificationEmail, templateProps)
      );
      break;
    case "SearchAlertEmail":
      htmlContent = ReactDOMServer.renderToString(
        React.createElement(SearchAlertEmail, templateProps)
      );
      break;
    case "PasswordResetEmail":
      htmlContent = ReactDOMServer.renderToString(
        React.createElement(PasswordResetEmail, templateProps)
      );
      break;
    default:
      return new Response(
        JSON.stringify({ error: "Invalid email template specified." }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        }
      );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Rentory <noreply@mecwebcraft.com>",
      to,
      subject,
      html: htmlContent,
    }),
  });

  const result = await response.json();
  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://localhost:3000",
    },
    status: response.status,
  });
});
