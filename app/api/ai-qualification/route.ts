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
You are an AI sales assistant for a solar CRM platform.

Analyze this lead carefully.

Return:

1. Lead Temperature:
- Hot
- Warm
- Cold

2. Deal Probability (0-100%)

3. Qualification Summary

4. Recommended Next Action

5. Suggested Sales Strategy

Lead Data:

Name: ${full_name}

Company: ${company_name}

Status: ${status}

Notes: ${notes}

Respond professionally and concisely.
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

    const result = completion.choices[0].message.content || "";

    const scoreMatch = result.match(/Lead Temperature:\s*(Hot|Warm|Cold)/i);

    const probabilityMatch = result.match(/Deal Probability:\s*(\d+%)/i);

    return NextResponse.json({
      result,
      ai_score: scoreMatch?.[1]?.toLowerCase() || "cold",
      deal_probability: probabilityMatch?.[1] || "0%",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      error: "AI request failed",
    });
  }
}
