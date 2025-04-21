import { Review } from "@/pages/WrapperObjects";
import { GenerateContentResponse, GoogleGenAI, Type } from "@google/genai"

const geminiAPIKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenAI(geminiAPIKey);

const schema = {
  description: "Review Summary Schema",
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "Summary of the reviews",
      nullable: false,
    },
    overallSentiment: {
      type: Type.STRING,
      description:
        "Overall sentiment of the reviews (positive, negative, neutral)",
      nullable: false,
    },
  },
  required: ["summary", "overallSentiment"],
};

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: schema,
};

const model = async (data: string): Promise<GenerateContentResponse> => {
  return genAI.models.generateContent({
      model: "gemini-2.0-flash",
      config: generationConfig,
      contents: ["Provide a summary of the reviews and their overall sentiment.", data],
  });
}

const generateReviewSummary = async (reviews: Review[]): Promise<{summary: string, overallSentiment: string}> => {
  const reviewTexts = reviews.map((review) => `Review: ${review.reviewText} \n Rating: ${review.rating}\n\n`).join(" ");
  const response = await model(reviewTexts);
  const content: { summary: string; overallSentiment: string } = response?.data[0] as { summary: string; overallSentiment: string };
  const summary = content.summary;
  const overallSentiment = content.overallSentiment;
  return {
    summary,
    overallSentiment,
  };
}

export { generateReviewSummary };
