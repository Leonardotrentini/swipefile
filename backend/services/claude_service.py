import anthropic
import json
from config import ANTHROPIC_API_KEY

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)


DISSECTION_PROMPT = """Você é um especialista em marketing direto e copywriting. Analise a oferta abaixo e extraia uma dissecação completa e estruturada.

## DADOS DA OFERTA
Nome: {name}
Produto: {product}
Nicho: {niche}
Headline: {headline}
Promessa: {promise}
Mecanismo: {mechanism}
Avatar/Público: {avatar}
Dor Principal: {pain_point}
Copy do Anúncio:
{ad_copy}

## SUA TAREFA
Responda APENAS com um JSON válido no formato abaixo, sem texto adicional:

{{
  "main_angle": "O ângulo principal da oferta em 1 frase curta (ex: Medo de perda, Curiosidade, Identidade, Autoridade, Prova social)",
  "broken_belief": "Qual crença limitante do avatar esta oferta quebra? Explique em 2-3 frases.",
  "copy_framework": "PAS | AIDA | 4Ps | Story-Sell | Outro (especifique)",
  "big_promise": "A grande promessa em 1 frase direta, como aparece implicitamente na oferta",
  "unique_mechanism": "O mecanismo único que justifica por que ISSO funciona quando outras coisas falharam. 2-4 frases.",
  "why_it_works_hypothesis": "Hipótese de por que essa oferta converte: o que ela faz psicologicamente com o avatar? 3-5 frases analíticas.",
  "similarity_tags": ["tag1", "tag2", "tag3"],
  "hook_type": "Qual tipo de hook está sendo usado (ex: Choque, Pergunta, Estatística, Promessa Audaciosa, Relato Pessoal)",
  "cta_type": "Tipo do CTA principal (ex: Urgência, Escassez, Benefício direto, Curiosidade)",
  "target_awareness": "Qual nível de consciência do avatar (Não consciente | Consciente do problema | Consciente da solução | Consciente do produto | Totalmente consciente)",
  "strengths": ["Ponto forte 1", "Ponto forte 2", "Ponto forte 3"],
  "weaknesses": ["Ponto fraco 1", "Ponto fraco 2"]
}}

similarity_tags deve conter 3-6 tags descritivas que facilitem encontrar ofertas similares (ex: "quick-win-7-dias", "mecanismo-cientifico", "avatar-mulher-40+")."""


async def analyze_offer(offer_data: dict) -> dict:
    """Chama o Claude para dissecar uma oferta completa."""
    prompt = DISSECTION_PROMPT.format(
        name=offer_data.get("name", "N/A"),
        product=offer_data.get("product", "N/A"),
        niche=offer_data.get("niche", "N/A"),
        headline=offer_data.get("headline", "N/A"),
        promise=offer_data.get("promise", "N/A"),
        mechanism=offer_data.get("mechanism", "N/A"),
        avatar=offer_data.get("avatar", "N/A"),
        pain_point=offer_data.get("pain_point", "N/A"),
        ad_copy=offer_data.get("ad_copy", "N/A"),
    )

    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=2048,
        messages=[{"role": "user", "content": prompt}],
    )

    raw_response = message.content[0].text

    try:
        parsed = json.loads(raw_response)
    except json.JSONDecodeError:
        import re
        match = re.search(r'\{.*\}', raw_response, re.DOTALL)
        if match:
            parsed = json.loads(match.group())
        else:
            parsed = {"error": "Falha ao parsear resposta do Claude", "raw": raw_response}

    return {
        "main_angle": parsed.get("main_angle", ""),
        "broken_belief": parsed.get("broken_belief", ""),
        "copy_framework": parsed.get("copy_framework", ""),
        "big_promise": parsed.get("big_promise", ""),
        "unique_mechanism": parsed.get("unique_mechanism", ""),
        "why_it_works_hypothesis": parsed.get("why_it_works_hypothesis", ""),
        "similarity_tags": json.dumps(parsed.get("similarity_tags", []), ensure_ascii=False),
        "raw_claude_response": raw_response,
        "extra": {
            "hook_type": parsed.get("hook_type", ""),
            "cta_type": parsed.get("cta_type", ""),
            "target_awareness": parsed.get("target_awareness", ""),
            "strengths": parsed.get("strengths", []),
            "weaknesses": parsed.get("weaknesses", []),
        },
    }
