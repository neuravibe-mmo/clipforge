/**
 * Adapter for NeuraVibe private LLM endpoint (https://neuravibemmo.dpdns.org).
 *
 * Intercepts OpenAI-compatible chat completion calls and translates them to
 * NeuraVibe's native API:
 *   POST https://neuravibemmo.dpdns.org/api/chatgpt2api/chat
 *   Body: { prompt: string, model: string }
 *
 * Translates the response back to OpenAI ChatCompletion format so all downstream
 * script generation, JSON parsers, and error handlers work without modification.
 */

export const NEURAVIBE_HOST = "neuravibemmo.dpdns.org";
export const NEURAVIBE_CHAT_ENDPOINT = `https://${NEURAVIBE_HOST}/api/chatgpt2api/chat`;

export function isNeuraVibe(url?: string): boolean {
  if (!url) return false;
  return url.includes(NEURAVIBE_HOST);
}

/**
 * Extract a single textual prompt from an OpenAI messages array.
 */
export function extractPromptFromMessages(messages: unknown): string {
  if (!Array.isArray(messages)) return "";

  return messages
    .map((m) => {
      if (!m || typeof m !== "object") return "";
      const role = (m as { role?: string }).role;
      const content = (m as { content?: unknown }).content;

      let text = "";
      if (typeof content === "string") {
        text = content;
      } else if (Array.isArray(content)) {
        text = content
          .map((part) => {
            if (part && typeof part === "object" && "text" in part && typeof (part as { text?: unknown }).text === "string") {
              return (part as { text: string }).text;
            }
            return "";
          })
          .filter(Boolean)
          .join("\n");
      }

      if (!text.trim()) return "";
      return role === "system" ? `[System Directive]\n${text}` : text;
    })
    .filter(Boolean)
    .join("\n\n");
}

/**
 * Fetch wrapper that intercepts calls to NeuraVibe and bridges them to the chatgpt2api endpoint.
 */
export function neuravibeAdapterFetch(baseFetch: typeof fetch = fetch): typeof fetch {
  return async (input, init) => {
    const urlStr =
      typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

    if (!isNeuraVibe(urlStr)) {
      return baseFetch(input, init);
    }

    // Only intercept chat completion requests
    const isChat = urlStr.includes("/chat/completions") || urlStr.endsWith("/chat");
    if (!isChat) {
      return baseFetch(input, init);
    }

    let bodyObj: Record<string, unknown> = {};
    if (init?.body && typeof init.body === "string") {
      try {
        bodyObj = JSON.parse(init.body);
      } catch {
        // use empty
      }
    }

    const prompt =
      extractPromptFromMessages(bodyObj.messages) ||
      (typeof bodyObj.prompt === "string" ? bodyObj.prompt : "");
    const model =
      typeof bodyObj.model === "string" && bodyObj.model.trim().length > 0
        ? bodyObj.model
        : "auto";

    const neuraVibePayload = {
      prompt,
      model,
    };

    const res = await baseFetch(NEURAVIBE_CHAT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(neuraVibePayload),
      signal: init?.signal,
    });

    if (!res.ok) {
      return res;
    }

    const data = await res.json().catch(() => null);
    if (!data) {
      return new Response(JSON.stringify({ error: { message: "Invalid JSON response from NeuraVibe" } }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (data.status === "error" || data.error) {
      const errMsg = data.error || data.message || "NeuraVibe request failed";
      return new Response(JSON.stringify({ error: { message: errMsg } }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if raw choices is already present from upstream
    if (data.raw && Array.isArray(data.raw.choices) && data.raw.choices.length > 0) {
      return new Response(JSON.stringify(data.raw), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const textContent =
      data.text || data.result || (typeof data === "string" ? data : "");

    const openAiResponse = {
      id: `chatcmpl-${Date.now()}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: textContent,
          },
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    };

    return new Response(JSON.stringify(openAiResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
}
