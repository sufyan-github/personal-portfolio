import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

class ContactValidationError extends Error {}

// Input validation function
const validateContactInput = (data: unknown): ContactEmailRequest => {
  if (!data || typeof data !== 'object') {
    throw new ContactValidationError('Invalid request body');
  }

  const { name, email, subject, message } = data as Record<string, unknown>;

  // Validate name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new ContactValidationError('Name is required');
  }
  if (name.trim().length > 100) {
    throw new ContactValidationError('Name must be less than 100 characters');
  }

  // Validate email
  if (!email || typeof email !== 'string') {
    throw new ContactValidationError('Email is required');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    throw new ContactValidationError('Invalid email format');
  }
  if (email.trim().length > 255) {
    throw new ContactValidationError('Email must be less than 255 characters');
  }

  // Validate subject
  if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
    throw new ContactValidationError('Subject is required');
  }
  if (subject.trim().length > 200) {
    throw new ContactValidationError('Subject must be less than 200 characters');
  }

  // Validate message
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    throw new ContactValidationError('Message must be at least 10 characters');
  }
  if (message.trim().length > 2000) {
    throw new ContactValidationError('Message must be less than 2000 characters');
  }

  return {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject.trim(),
    message: message.trim(),
  };
};

// Simple email sending using Resend API via fetch
const sendEmail = async (to: string[], subject: string, html: string, from: string, replyTo: string) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      reply_to: replyTo,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send email: ${response.statusText} - ${errorText}`);
  }

  return await response.json();
};

// Rate limiting storage (in production, use Redis or similar)
const rateLimits = new Map<string, { count: number; resetTime: number }>();

const isRateLimited = (clientIP: string): boolean => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5; // Max 5 requests per 15 minutes

  const existing = rateLimits.get(clientIP);

  if (!existing || now > existing.resetTime) {
    rateLimits.set(clientIP, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (existing.count >= maxRequests) {
    return true;
  }

  existing.count++;
  return false;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check
  const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
  if (isRateLimited(clientIP)) {
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded. Please try again later."
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        },
      }
    );
  }

  try {
    let rawData: unknown;
    try {
      rawData = await req.json();
    } catch {
      throw new ContactValidationError('Invalid JSON body');
    }

    // Validate and sanitize input
    const { name, email, subject, message } = validateContactInput(rawData);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Save to database first
    const { error: dbError } = await supabase
      .from('contacts')
      .insert([{ name, email, subject, message }]);

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save contact form');
    }

    // Saving the message is the primary operation. Email failure must not invite
    // duplicate submissions for a message that has already been received.
    const fromEmail = Deno.env.get("CONTACT_FROM_EMAIL");
    if (!fromEmail || !Deno.env.get("RESEND_API_KEY")) {
      console.warn("Contact saved; email notification is not configured");
      return new Response(JSON.stringify({ success: true, emailSent: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[char]!);
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);
    const deliveries = await Promise.allSettled([

    // Send notification email to Abu Sufyan
    sendEmail(
      ["abusufyan.cse20@gmail.com"],
      `New Contact Form Submission: ${subject}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>

          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e293b;">Contact Details:</h3>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
          </div>

          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e293b;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${safeMessage}</p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #64748b; font-size: 14px;">
              This email was sent from your portfolio contact form.
            </p>
          </div>
        </div>
      `,
      fromEmail,
      email
    ),

    // Send confirmation email to the sender
    sendEmail(
      [email],
      "Thank you for contacting me!",
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            Thank you for reaching out!
          </h2>

          <p>Hi ${safeName},</p>

          <p>Thank you for contacting me through my portfolio website. I have received your message about "<strong>${safeSubject}</strong>" and will get back to you as soon as possible.</p>

          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
            <p style="margin: 0; color: #0c4a6e;">
              <strong>Expected Response Time:</strong> I typically respond within 24-48 hours during business days.
            </p>
          </div>

          <p>In the meantime, feel free to explore my portfolio and recent projects:</p>
          <ul>
            <li><a href="https://abusufyan.online/#projects" style="color: #2563eb;">View My Projects</a></li>
            <li><a href="https://abusufyan.online/#blog" style="color: #2563eb;">Read My Blog</a></li>
            <li><a href="https://linkedin.com/in/md-abu-sufyan" style="color: #2563eb;">Connect on LinkedIn</a></li>
          </ul>

          <p>Best regards,<br>
          <strong>Md. Abu Sufyan</strong><br>
          <em>Machine Learning & AI Instructor</em></p>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #64748b; font-size: 14px;">
              This is an automated confirmation. You can reply to this email to reach me directly.
            </p>
          </div>
        </div>
      `,
      fromEmail,
      "abusufyan.cse20@gmail.com"
    )
    ]);
    const notificationSent = deliveries[0].status === 'fulfilled';
    const confirmationSent = deliveries[1].status === 'fulfilled';
    const emailSent = notificationSent && confirmationSent;
    deliveries.forEach((delivery, index) => {
      if (delivery.status === 'rejected') {
        console.error(`Contact saved; ${index === 0 ? 'notification' : 'confirmation'} email failed:`, delivery.reason);
      }
    });

    // Analytics must not turn an already-saved message into a retry/duplicate.
    try {
    await supabase.from('analytics').insert([
      {
        event_type: 'contact_received',
        metadata: { subject, email_sent: emailSent, notification_sent: notificationSent, confirmation_sent: confirmationSent }
      }
    ]);
    } catch (error) {
      console.warn('Contact saved; analytics failed:', error);
    }

    return new Response(
      JSON.stringify({
        success: true,
        emailSent,
        message: "Message received"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof ContactValidationError ? error.message : "Unable to receive message. Please try again later."
      }),
      {
        status: error instanceof ContactValidationError ? 400 : 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        },
      }
    );
  }
};

serve(handler);
