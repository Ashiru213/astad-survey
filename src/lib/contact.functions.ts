import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ContactInput = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().default(""),
  service: z.string().trim().max(100).optional().default(""),
  message: z.string().trim().min(1).max(2000),
});

async function generateAiReply(input: z.infer<typeof ContactInput>): Promise<string | null> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are the friendly assistant for ASTAD Survey & Consultants, a Nigerian land surveying, GIS, and geospatial firm based in Ojodu Berger, Lagos. Write a warm, professional acknowledgement (3-5 short sentences) confirming we received the enquiry, referencing the requested service if given, and telling them a licensed surveyor will follow up within one business day via phone or email. Do not invent prices or timelines.",
          },
          {
            role: "user",
            content: `Name: ${input.name}\nEmail: ${input.email}\nPhone: ${input.phone || "n/a"}\nService: ${input.service || "n/a"}\nMessage: ${input.message}`,
          },
        ],
      }),
    });
    if (!res.ok) {
      console.error("AI reply failed", res.status, await res.text());
      return null;
    }
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch (err) {
    console.error("AI reply error", err);
    return null;
  }
}

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => ContactInput.parse(raw))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const aiReply = await generateAiReply(data);
    const { error } = await supabaseAdmin.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      service: data.service || null,
      message: data.message,
      ai_reply: aiReply,
    });
    if (error) {
      console.error("Failed to save submission", error);
      throw new Error("Could not save your message. Please try again.");
    }
    return {
      ok: true as const,
      reply:
        aiReply ??
        `Thank you, ${data.name.split(" ")[0]}! We've received your message and a licensed surveyor from ASTAD will contact you within one business day.`,
    };
  });