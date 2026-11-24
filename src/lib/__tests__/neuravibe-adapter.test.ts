import { describe, it, expect, vi } from "vitest";
import {
  isNeuraVibe,
  extractPromptFromMessages,
  neuravibeAdapterFetch,
  NEURAVIBE_CHAT_ENDPOINT,
} from "../neuravibe-adapter";

describe("neuravibe-adapter", () => {
  it("correctly identifies NeuraVibe endpoints", () => {
    expect(isNeuraVibe("https://neuravibemmo.dpdns.org")).toBe(true);
    expect(isNeuraVibe("https://neuravibemmo.dpdns.org/v1/chat/completions")).toBe(true);
    expect(isNeuraVibe("https://api.openai.com/v1")).toBe(false);
    expect(isNeuraVibe(undefined)).toBe(false);
  });

  it("extracts prompt from messages array", () => {
    const messages = [
      { role: "system", content: "You are a director." },
      { role: "user", content: "Write a script for coffee." },
    ];
    const prompt = extractPromptFromMessages(messages);
    expect(prompt).toContain("[System Directive]\nYou are a director.");
    expect(prompt).toContain("Write a script for coffee.");
  });

  it("extracts text from multi-part content in messages", () => {
    const messages = [
      {
        role: "user",
        content: [
          { type: "text", text: "Part 1" },
          { type: "image_url", image_url: { url: "https://example.com/img.png" } },
          { type: "text", text: "Part 2" },
        ],
      },
    ];
    const prompt = extractPromptFromMessages(messages);
    expect(prompt).toBe("Part 1\nPart 2");
  });

  it("passes through non-NeuraVibe requests untouched", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    const adaptedFetch = neuravibeAdapterFetch(mockFetch);

    const res = await adaptedFetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      body: JSON.stringify({ model: "gpt-4o", messages: [{ role: "user", content: "hi" }] }),
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.openai.com/v1/chat/completions",
      expect.anything()
    );
    expect(res.status).toBe(200);
  });

  it("intercepts NeuraVibe chat completions and calls native chat endpoint", async () => {
    const mockResponsePayload = {
      status: "success",
      text: "Xin chào từ NeuraVibe",
      raw: {
        id: "chatcmpl-test",
        choices: [
          {
            index: 0,
            message: { role: "assistant", content: "Xin chào từ NeuraVibe" },
            finish_reason: "stop",
          },
        ],
      },
    };

    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(mockResponsePayload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const adaptedFetch = neuravibeAdapterFetch(mockFetch);

    const res = await adaptedFetch("https://neuravibemmo.dpdns.org/chat/completions", {
      method: "POST",
      body: JSON.stringify({
        model: "auto",
        messages: [{ role: "user", content: "Viết kịch bản" }],
      }),
    });

    expect(mockFetch).toHaveBeenCalledWith(
      NEURAVIBE_CHAT_ENDPOINT,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          prompt: "Viết kịch bản",
          model: "auto",
        }),
      })
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.choices[0].message.content).toBe("Xin chào từ NeuraVibe");
  });

  it("wraps NeuraVibe plain text/result responses in standard OpenAI choices", async () => {
    const mockResponsePayload = {
      status: "success",
      result: "Nội dung kết quả",
    };

    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(mockResponsePayload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const adaptedFetch = neuravibeAdapterFetch(mockFetch);

    const res = await adaptedFetch("https://neuravibemmo.dpdns.org/v1/chat/completions", {
      method: "POST",
      body: JSON.stringify({
        model: "auto",
        messages: [{ role: "user", content: "test" }],
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.choices[0].message.content).toBe("Nội dung kết quả");
  });
});
