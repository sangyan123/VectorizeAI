import { GoogleGenAI } from "@google/genai";
import { VectorStyle } from '../types';

const getSystemInstruction = () => `
You are an expert technical vector artist and SVG coder. Your task is to convert raster images into clean, optimized, and scalable SVG code.
1. Return ONLY the raw SVG code. Do not wrap it in markdown code blocks (e.g., \`\`\`xml). Do not add any conversational text.
2. The SVG must be self-contained. DO NOT use <img> tags with base64 data or external links. You must draw the image using <path>, <rect>, <circle>, <polygon>, etc.
3. Use the 'viewBox' attribute correctly to match the aspect ratio.
4. Optimize the code for size where possible, but prioritize visual fidelity to the requested style.
`;

const getPromptForStyle = (style: VectorStyle): string => {
  switch (style) {
    case VectorStyle.FLAT_DESIGN:
      return "Convert this image into a 'Flat Design' style SVG. Use solid, vibrant colors, simplified shapes, and remove gradients or textures. Focus on clarity and icon-like aesthetics.";
    case VectorStyle.MINIMALIST:
      return "Convert this image into 'Minimalist Line Art' SVG. Use strokes (lines) primarily, with minimal fills. Focus on the essential contours and outline of the subject. Black and white or single color preferred unless color is essential.";
    case VectorStyle.LOW_POLY:
      return "Convert this image into a 'Low Poly' geometric SVG. Compose the image entirely of triangles and polygons with solid fill colors to create a faceted, 3D-like effect.";
    case VectorStyle.ABSTRACT:
      return "Create an 'Abstract' artistic interpretation of this image in SVG. Focus on the mood, dominant colors, and flowing shapes rather than strict realism.";
    case VectorStyle.PIXEL_ART:
      return "Convert this image into a 'Pixel Art' style SVG. Use small squares (<rect>) to simulate a retro 8-bit or 16-bit look.";
    case VectorStyle.REALISTIC:
    default:
      return "Convert this image into a highly detailed SVG vector illustration. Trace the shapes and colors as accurately as possible using vector paths to recreate the image appearance. Use layers of paths to achieve depth.";
  }
};

export const generateSvg = async (base64Image: string, style: VectorStyle): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Clean base64 string if it contains metadata prefix
  const cleanBase64 = base64Image.split(',')[1] || base64Image;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming JPEG for simplicity, API handles most types
              data: cleanBase64
            }
          },
          {
            text: getPromptForStyle(style)
          }
        ]
      },
      config: {
        systemInstruction: getSystemInstruction(),
        temperature: 0.4, // Lower temperature for more deterministic/precise code generation
      }
    });

    const text = response.text || "";
    
    // Cleanup: Remove markdown code blocks if the model ignores the system instruction
    let svgCode = text.trim();
    if (svgCode.startsWith('```')) {
      svgCode = svgCode.replace(/^```(xml|svg)?\n/, '').replace(/\n```$/, '');
    }
    
    // Validate it starts with <svg
    const svgStartIndex = svgCode.indexOf('<svg');
    const svgEndIndex = svgCode.lastIndexOf('</svg>');
    
    if (svgStartIndex === -1 || svgEndIndex === -1) {
       // Fallback: sometimes models write "Here is the code: <svg..."
       if (svgStartIndex > -1) {
           svgCode = svgCode.substring(svgStartIndex, svgEndIndex + 6);
       } else {
           throw new Error("The AI failed to generate valid SVG code. Please try a different image or style.");
       }
    } else {
        svgCode = svgCode.substring(svgStartIndex, svgEndIndex + 6);
    }

    return svgCode;

  } catch (error) {
    console.error("Gemini SVG Generation Error:", error);
    throw error;
  }
};
