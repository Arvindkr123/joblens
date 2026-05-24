import Groq from "groq-sdk"

const client = new Groq({ apiKey: process.env.GROQ_API_KEY! })

export async function generateInterviewPrep(jobTitle: string, companyName: string) {
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{
      role: "user",
      content: `Generate 8 likely interview questions for a ${jobTitle} role at ${companyName}, with a brief tip for answering each. Respond ONLY with a JSON array: [{"question": "...", "tip": "..."}]`
    }],
    max_tokens: 1024,
  })
  return completion.choices[0].message.content ?? ""
}

export async function generateCoverLetter(jobTitle: string, companyName: string, jobDescription: string) {
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{
      role: "user",
      content: `Write a professional cover letter for a ${jobTitle} position at ${companyName}. Job description: ${jobDescription}. Keep it concise, 3 paragraphs.`
    }],
    max_tokens: 1024,
  })
  return completion.choices[0].message.content ?? ""
}

export async function generateResumeTips(jobTitle: string, companyName: string, jobDescription: string) {
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{
      role: "user",
      content: `Give 6 specific resume tips for someone applying to a ${jobTitle} role at ${companyName}. Job description: ${jobDescription}. Respond ONLY with a JSON array: [{"tip": "...", "reason": "..."}]`
    }],
    max_tokens: 1024,
  })
  return completion.choices[0].message.content ?? ""
}