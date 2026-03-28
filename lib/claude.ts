import Anthropic from '@anthropic-ai/sdk'
import type { GenerateRequest, GenerateResponse, Platform } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PLATFORM_CONSTRAINTS: Record<Platform, string> = {
  instagram: 'Max 2200 caractères. Ajoute 5-10 hashtags pertinents à la fin. Emojis bienvenus. Caption engageante avec CTA.',
  facebook: 'Ton conversationnel. Max 500 caractères recommandés. CTA encouragé. Pas trop de hashtags (2-3 max).',
  twitter: 'Max 280 caractères. Percutant et direct. 1-2 hashtags max. Hook fort en première phrase.',
  linkedin: 'Ton professionnel et inspirant. Max 1300 caractères recommandés. Pas de hashtags excessifs (3 max). Structure lisible avec sauts de ligne.',
  tiktok: 'Court et dynamique. Max 300 caractères. Hook fort en première phrase. 3-5 hashtags tendance.',
  youtube: 'Description vidéo optimisée SEO. Inclus mots-clés naturellement. CTA pour s\'abonner.',
  pinterest: 'Descriptif et inspirant. Mots-clés importants. Max 500 caractères.',
}

const TONE_INSTRUCTIONS: Record<string, string> = {
  professionnel: 'Adopte un ton professionnel, expert et crédible. Langage soigné, données et faits si pertinents.',
  decontracte: 'Ton décontracté, accessible et authentique. Parle directement à l\'audience, comme un ami.',
  inspirant: 'Ton motivant et inspirant. Élève l\'audience, crée de l\'émotion et de l\'aspiration.',
  humoristique: 'Ton léger et humoristique. Wit intelligent, légèreté, mais reste pertinent au sujet.',
}

export async function generatePosts(req: GenerateRequest): Promise<GenerateResponse> {
  const platformInstructions = req.platforms
    .map(p => `**${p.toUpperCase()}**: ${PLATFORM_CONSTRAINTS[p]}`)
    .join('\n')

  const brandContext = req.brand_name
    ? `Marque : ${req.brand_name}${req.brand_description ? `. Description : ${req.brand_description}` : ''}.`
    : ''

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Tu es un expert Community Manager. Génère des posts pour les réseaux sociaux suivants.

${brandContext}
Sujet / brief : ${req.brief}
Ton : ${TONE_INSTRUCTIONS[req.tone]}

Contraintes par plateforme :
${platformInstructions}

Réponds UNIQUEMENT en JSON valide avec ce format exact :
{
  "variants": {
    ${req.platforms.map(p => `"${p}": "texte du post"`).join(',\n    ')}
  }
}

Aucun texte avant ou après le JSON.`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const parsed = JSON.parse(text.trim())
  return parsed as GenerateResponse
}

export async function rewritePost(content: string, platform: Platform, instruction: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Réécris ce post ${platform} selon cette instruction : "${instruction}"

Post original :
${content}

Contraintes ${platform} : ${PLATFORM_CONSTRAINTS[platform]}

Réponds UNIQUEMENT avec le texte du post réécrit, sans explication.`,
      },
    ],
  })

  return message.content[0].type === 'text' ? message.content[0].text.trim() : content
}

export async function suggestHashtags(content: string, platform: Platform): Promise<string[]> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `Suggère 10 hashtags pertinents pour ce post ${platform}. Mélange populaires et de niche.

Post : ${content}

Réponds UNIQUEMENT en JSON : {"hashtags": ["#tag1", "#tag2", ...]}`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
  const parsed = JSON.parse(text.trim())
  return parsed.hashtags || []
}
