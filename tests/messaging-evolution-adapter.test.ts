import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@/lib/messaging/adapters/whatsapp-evolution/client", () => ({
  postJson: vi.fn(async () => ({ key: { id: "msg-123" } })),
}));

import { evolutionAdapter } from "@/lib/messaging/adapters/whatsapp-evolution/adapter";
import { postJson } from "@/lib/messaging/adapters/whatsapp-evolution/client";

describe("whatsapp-evolution adapter", () => {
  beforeEach(() => {
    vi.mocked(postJson).mockClear();
  });

  test("sendMessage sends text payload nested under textMessage", async () => {
    const config = {
      baseUrl: "https://evo.exemplo.com",
      apiKey: "secret-key-123",
      instanceName: "inst1",
      webhookSecret: "a".repeat(32),
    };

    const result = await evolutionAdapter.sendMessage(config, {
      to: "+5511999999999",
      body: "Olá mundo",
    });

    expect(result.externalId).toBe("msg-123");
    expect(vi.mocked(postJson)).toHaveBeenCalledWith(
      "https://evo.exemplo.com/message/sendText/inst1",
      "secret-key-123",
      {
        number: "5511999999999",
        textMessage: { text: "Olá mundo" },
      },
    );
  });

  test("sendMessage includes quoted id when replyToExternalId is provided", async () => {
    const config = {
      baseUrl: "https://evo.exemplo.com",
      apiKey: "secret-key-123",
      instanceName: "inst1",
      webhookSecret: "a".repeat(32),
    };

    await evolutionAdapter.sendMessage(config, {
      to: "+5511999999999",
      body: "Oi",
      replyToExternalId: "reply-123",
    });

    expect(vi.mocked(postJson)).toHaveBeenCalledWith(
      "https://evo.exemplo.com/message/sendText/inst1",
      "secret-key-123",
      {
        number: "5511999999999",
        textMessage: { text: "Oi" },
        quoted: { key: { id: "reply-123" } },
      },
    );
  });
});
