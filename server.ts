import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

interface ConceptRequestBody {
  phaseId?: string;
  phaseTitle?: string;
  subSectionLabel?: string;
  userIdea?: string;
}

function getPhasePromptGuidance(phaseId: string): string {
  switch (phaseId) {
    case "overview":
      return "Focus on Gate 1 Story Outline (9:16 vertical micro-drama, 2-sentence logline with immediate Hook & Conflict) and a clear 6-step production roadmap checklist.";
    case "production":
      return "Focus on practical execution: 3-act 60~75s narrative beats (Hook 0~10s, Conflict 10~55s, Cliffhanger 55~75s), visual action cues (no abstract emotions), signature character anchors (2~3 traits), invariant spatial detail, key light continuity, and a ready-to-copy I2V prompt following the standard formula.";
    case "tools":
      return "Focus on recommending an optimal AI tool stack (LLM, Image, I2V Video, Audio TTS/BGM/SFX, and Canvas) tailored to the concept, with practical workflow tips and pricing/commercial-use precautions.";
    case "legal":
      return "Focus on copyright human authorship documentation (modification & arrangement), AI labeling compliance (AI Basic Act Art. 31, FTC virtual human label, YouTube disclosure), likeness/voice consent requirements, and a practical legal compliance checklist.";
    case "faq":
      return "Focus on preemptive QA & troubleshooting checks (preventing character drift with @Character1, full-body face masking separation, 1-scene 1-action rule, invariant spatial/lighting anchors, and native lip-sync / 480p draft verification).";
    default:
      return "Provide a concise, actionable AI micro-drama concept aligned with the 6-stage pipeline.";
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.post("/api/generate-concept", async (req: Request, res: Response) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({
        error:
          "GEMINI_API_KEY가 설정되지 않았습니다. Settings > Secrets 패널에서 API 키를 확인해 주세요.",
      });
      return;
    }

    const body = (req.body || {}) as ConceptRequestBody;
    const phaseId = typeof body.phaseId === "string" ? body.phaseId : "overview";
    const phaseTitle =
      typeof body.phaseTitle === "string" && body.phaseTitle.trim()
        ? body.phaseTitle.trim()
        : "01. 개요 및 제작 로드맵";
    const subSectionLabel =
      typeof body.subSectionLabel === "string" ? body.subSectionLabel.trim() : "";
    const userIdea =
      typeof body.userIdea === "string" ? body.userIdea.trim().slice(0, 300) : "";

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const phaseGuidance = getPhasePromptGuidance(phaseId);

    const prompt = [
      `현재 제작 단계: ${phaseTitle}${subSectionLabel ? ` (${subSectionLabel})` : ""}`,
      `사용자 드라마 아이디어/키워드: ${userIdea || "미지정 (초보자가 바로 따라 하기 좋은 매력적인 60~75초 9:16 숏폼 드라마 컨셉을 직접 제안해 주세요)"}`,
      `단계별 지침: ${phaseGuidance}`,
      "모든 설명은 자연스럽고 전문적인 한국어로 작성하되, copyableAsset의 영문 I2V/이미지 프롬프트 예시나 태그는 영문 표준 포맷(@Character1, cinematic lighting 등)을 포함해 바로 복사해 쓸 수 있게 작성하세요.",
    ].join("\n\n");

    try {
      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: prompt,
        config: {
          systemInstruction:
            "You are a senior AI short-drama producer and pipeline director helping beginners build 60-75s vertical micro-dramas following the All-in-One AI Drama Production Manual (6 stages, 5 review gates, visual action cues, @Character1 tagging, 1-scene 1-action, 480p draft -> 1080p upscale, and legal compliance). Keep each field concise, concrete, and immediately actionable.",
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              conceptTitle: {
                type: Type.STRING,
                description: "Short catchy drama concept or phase deliverable title in Korean.",
              },
              logline: {
                type: Type.STRING,
                description:
                  "Crisp 2-sentence micro-drama logline showing character goal and immediate conflict.",
              },
              keyFocus: {
                type: Type.STRING,
                description:
                  "Key visual style, anchor setup, or compliance focus for this production phase.",
              },
              phaseActionPlan: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  "3 to 4 concrete, sequential action steps tailored to the current manual stage.",
              },
              copyableAssetTitle: {
                type: Type.STRING,
                description:
                  "Label for the copyable prompt/template (e.g., 'I2V 실전 프롬프트 예시' or '체크 포인트 템플릿').",
              },
              copyableAsset: {
                type: Type.STRING,
                description:
                  "Ready-to-copy prompt formula, shot table snippet, or compliance clause tailored to the current phase.",
              },
              recommendedTools: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  "3 to 4 recommended AI tools from the manual (e.g., Claude MCP, Midjourney, Kling, Seedance 2.0, Supertone).",
              },
            },
            required: [
              "conceptTitle",
              "logline",
              "keyFocus",
              "phaseActionPlan",
              "copyableAssetTitle",
              "copyableAsset",
              "recommendedTools",
            ],
          },
        },
      });

      const rawText = (response.text ?? "").trim();
      if (!rawText) {
        res.status(502).json({ error: "AI 응답이 비어 있습니다. 다시 시도해 주세요." });
        return;
      }

      const parsed = JSON.parse(rawText);
      res.json(parsed);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "AI 컨셉 생성 중 오류가 발생했습니다.";
      if (message.includes("403") || message.includes("PERMISSION_DENIED") || message.includes("API_KEY_INVALID")) {
        res.status(403).json({
          error:
            "API 키 권한 오류가 발생했습니다. Settings > Secrets 패널에서 GEMINI_API_KEY를 확인해 주세요.",
        });
        return;
      }
      if (message.includes("429") || message.includes("RESOURCE_EXHAUSTED")) {
        res.status(429).json({
          error: "요청 한도가 초과되었습니다. 잠시 후 다시 시도해 주세요.",
        });
        return;
      }
      res.status(500).json({ error: message });
    }
  });

  app.get("/api/single-html", async (_req: Request, res: Response) => {
    try {
      const distIndexPath = path.resolve(__dirname, "dist", "index.html");
      if (!fs.existsSync(distIndexPath)) {
        const { build } = await import("vite");
        await build();
      }
      if (!fs.existsSync(distIndexPath)) {
        res.status(404).json({ error: "단일 HTML 빌드 파일을 생성하지 못했습니다." });
        return;
      }
      const html = fs.readFileSync(distIndexPath, "utf-8");
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="index.html"'
      );
      res.send(html);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "단일 HTML 파일을 불러오는 중 오류가 발생했습니다.";
      res.status(500).json({ error: msg });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("/{*path}", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
