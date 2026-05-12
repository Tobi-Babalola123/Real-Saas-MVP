import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { full_name, company_name, status, notes } = body;

    const prompt = `
You are an expert solar sales representative.

Generate:

1. A professional WhatsApp follow-up message

2. A short sales email

3. A persuasive proposal introduction

Lead Info:

Name: ${full_name}

Company: ${company_name}

Status: ${status}

Notes: ${notes}

Keep responses concise, professional, and conversion-focused.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return NextResponse.json({
      result: completion.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      error: "Follow-up generation failed",
    });
  }
}
