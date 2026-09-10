import { describe, it, expect } from "vitest";
import {
  translateText,
  getSupportedLanguages,
  INDICTRANS2_LANG_CODES,
  SUPPORTED_LANGUAGES
} from "../controllers/translationController";

// Helper to mock Express Request and Response
function createMockReqRes(body: any = {}, query: any = {}) {
  const req = { body, query } as any;
  let statusCode = 200;
  let responseData: any = null;

  const res = {
    status: (code: number) => {
      statusCode = code;
      return res;
    },
    json: (data: any) => {
      responseData = data;
      return res;
    }
  } as any;

  return { req, res, getStatus: () => statusCode, getData: () => responseData };
}

describe("AI4Bharat IndicTrans2 Translation Controller", () => {
  it("should have correct IndicTrans2 language codes for en, hi, and te", () => {
    expect(INDICTRANS2_LANG_CODES["en"]).toBe("eng_Latn");
    expect(INDICTRANS2_LANG_CODES["hi"]).toBe("hin_Deva");
    expect(INDICTRANS2_LANG_CODES["te"]).toBe("tel_Telu");
  });

  it("should return supported languages including English, Hindi, and Telugu", async () => {
    const { req, res, getStatus, getData } = createMockReqRes();
    await getSupportedLanguages(req, res);

    expect(getStatus()).toBe(200);
    const data = getData();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.languages)).toBe(true);

    const codes = data.languages.map((l: any) => l.code);
    expect(codes).toContain("en");
    expect(codes).toContain("hi");
    expect(codes).toContain("te");
  });

  it("should reject translation requests with missing text", async () => {
    const { req, res, getStatus, getData } = createMockReqRes({ targetLang: "hi" });
    await translateText(req, res);

    expect(getStatus()).toBe(400);
    expect(getData().success).toBe(false);
  });

  it("should reject translation requests with missing targetLang", async () => {
    const { req, res, getStatus, getData } = createMockReqRes({ text: "Hello" });
    await translateText(req, res);

    expect(getStatus()).toBe(400);
    expect(getData().success).toBe(false);
  });

  it("should return original text immediately if source and target languages are identical", async () => {
    const { req, res, getStatus, getData } = createMockReqRes({
      text: "Electrician",
      sourceLang: "en",
      targetLang: "en"
    });
    await translateText(req, res);

    expect(getStatus()).toBe(200);
    const data = getData();
    expect(data.success).toBe(true);
    expect(data.translatedText).toBe("Electrician");
    expect(data.cached).toBe(true);
  });

  it("should translate domain trade terms into Hindi accurately", async () => {
    const { req, res, getStatus, getData } = createMockReqRes({
      text: "Electrician",
      sourceLang: "en",
      targetLang: "hi"
    });
    await translateText(req, res);

    expect(getStatus()).toBe(200);
    const data = getData();
    expect(data.success).toBe(true);
    expect(data.translatedText).toBe("इलेक्ट्रीशियन");
  });

  it("should translate domain trade terms into Telugu accurately", async () => {
    const { req, res, getStatus, getData } = createMockReqRes({
      text: "Electrician",
      sourceLang: "en",
      targetLang: "te"
    });
    await translateText(req, res);

    expect(getStatus()).toBe(200);
    const data = getData();
    expect(data.success).toBe(true);
    expect(data.translatedText).toBe("ఎలక్ట్రీషియన్");
  });

  it("should cache translation results and return cached: true on duplicate calls", async () => {
    const testText = "Cooperative Society";
    
    // First call
    const first = createMockReqRes({
      text: testText,
      sourceLang: "en",
      targetLang: "hi"
    });
    await translateText(first.req, first.res);
    expect(first.getStatus()).toBe(200);
    expect(first.getData().translatedText).toBe("सहकारी समिति");

    // Second call with same text and languages
    const second = createMockReqRes({
      text: testText,
      sourceLang: "en",
      targetLang: "hi"
    });
    await translateText(second.req, second.res);
    expect(second.getStatus()).toBe(200);
    expect(second.getData().translatedText).toBe("सहकारी समिति");
    expect(second.getData().cached).toBe(true);
  });
});

