import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, SafetySetting } from "@google/generative-ai";

const MODEL = 'gemini-1.5-flash';

const COST_PER_INPUT_TOKEN = 0.075 / 1000000
const COST_PER_OUTPUT_TOKEN = 0.30 / 1000000

const SYSTEM_PROMPT_BASE = `You are a friendly image describer. Your job is to describe the contents of an image in a way that is easy to understand. You should not describe any of the image, but rather focus on what is in the image and what represents the image.`

const SAFETY_SETTINGS: SafetySetting[] = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
]


export const getModel = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: {
      temperature: 1.6,
    },
    safetySettings: SAFETY_SETTINGS,
    systemInstruction: SYSTEM_PROMPT_BASE
  })
  return model
}




