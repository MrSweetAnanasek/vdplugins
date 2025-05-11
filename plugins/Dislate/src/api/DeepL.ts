import { DeepLResponse } from "../type"

const API_URL = "https://api-free.deepl.com/v2/translate"
const API_KEY = "d416dbac-ef8d-4685-95f8-85a15c896f5c:fx"

const translate = async (
    text: string,
    source_lang: string = "auto",
    target_lang: string,
    original: boolean = false
) => {
    try {
        if (original) return { source_lang, text }

        const params = new URLSearchParams()
        params.append("auth_key", API_KEY)
        params.append("text", text)
        params.append("target_lang", target_lang)
        if (source_lang !== "auto") {
            params.append("source_lang", source_lang)
        }

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params.toString()
        })

        const data = await response.json() as {
  translations: { detected_source_language: string; text: string }[]
}

        if (!response.ok) {
            throw Error(`Failed to translate text from DeepL: ${data["message"] ?? response.statusText}`)
        }

        return {
            source_lang: data.translations?.[0]?.detected_source_language || source_lang,
            text: data.translations?.[0]?.text || text
        }
    } catch (e) {
        throw Error(`Failed to fetch from DeepL: ${e}`)
    }
}

export default { translate }
