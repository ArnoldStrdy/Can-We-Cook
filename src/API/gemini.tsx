import {
  GoogleGenerativeAI,
  SchemaType,
  GenerationConfig,
  ResponseSchema,
} from "@google/generative-ai";

const geminiAPIKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(geminiAPIKey);

const receiptgenAI = new GoogleGenerativeAI(geminiAPIKey);

const schema: ResponseSchema = {
  description: "Review Summary Schema",
  type: SchemaType.OBJECT,
  properties: {
    summary: {
      type: SchemaType.STRING,
      description: "Summary of the reviews",
      nullable: false,
    },
    overallSentiment: {
      type: SchemaType.STRING,
      description:
        "Overall sentiment of the reviews (positive, negative, neutral)",
      nullable: false,
    },
  },
  required: ["summary", "overallSentiment"],
};

const generationConfig: GenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: schema,
};

const receiptSchema: ResponseSchema = {
  description: "To check if the receipt is valid",
  type: SchemaType.OBJECT,
  properties: {
    isReceipt: {
      type: SchemaType.BOOLEAN,
      description: "True if the receipt is valid, false otherwise",
      nullable: false,
    },
  },
  required: ["isReceipt"],
};

const receiptGenerationConfig: GenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: receiptSchema,
};

export const receiptModel = receiptgenAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: receiptGenerationConfig,
});

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: generationConfig,
});

export default model;
