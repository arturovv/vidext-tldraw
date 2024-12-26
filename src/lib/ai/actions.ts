'use server'
import { getModel } from "./ai";

const DESCRIBE_IMAGE_PROMPT = "Describe the provided image. It was drawn by a human using tldraw.";

export const describeImageWithAI = async (image: Blob) => {
  const arrayBuffer = await image.arrayBuffer();

  const model = getModel()

  const result = await model.generateContent([
    {
      inlineData: {
        data: Buffer.from(arrayBuffer).toString("base64"),
        mimeType: image.type,
      }
    },
    DESCRIBE_IMAGE_PROMPT
  ])

  return result.response.text()
}