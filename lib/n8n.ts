const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET!

export async function schedulePost(params: {
  postId: string
  userId: string
  scheduledAt: string
}) {
  const webhookUrl = process.env.N8N_WEBHOOK_SCHEDULE_POST!
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Secret': N8N_WEBHOOK_SECRET,
    },
    body: JSON.stringify(params),
  })
  if (!res.ok) throw new Error('n8n schedule webhook failed')
  return res.json()
}

export function verifyInternalSecret(secret: string): boolean {
  return secret === N8N_WEBHOOK_SECRET
}
