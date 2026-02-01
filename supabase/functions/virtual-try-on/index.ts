import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

interface VirtualTryOnRequest {
  personImage: string;
  clothingImage: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  try {
    const { personImage, clothingImage }: VirtualTryOnRequest = await req.json();

    if (!personImage) {
      return new Response(
        JSON.stringify({ error: "请上传人物照片" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!clothingImage) {
      return new Response(
        JSON.stringify({ error: "请选择服装图片" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Processing virtual try-on request...");

    const prompt = `You are a virtual try-on AI. I'm giving you two images:
1. First image: A photo of a person
2. Second image: A clothing item

Your task: Generate a new image showing the person from image 1 wearing the clothing from image 2.

Requirements:
- Keep the person's face, body, pose, skin tone, and hair exactly the same
- Replace their current clothing with the clothing from image 2
- The clothing should fit naturally on the person's body
- Maintain realistic lighting and shadows
- Keep the same background as the original person photo
- Output only the final edited image, no text explanation needed`;

    const response = await fetch("https://www.needware.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        modalities: ["text", "image"],
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: personImage
              },
              {
                type: "image_url",
                image_url: clothingImage
              }
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI service error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "请求过于频繁，请稍后再试" }),
          { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI服务配额已用尽" }),
          { status: 402, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      let errorMessage = "AI服务暂时不可用";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorJson.message || errorMessage;
      } catch {
        if (errorText) errorMessage = errorText.slice(0, 200);
      }

      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const result = await response.json();
    console.log("AI response received");

    // 解析响应，提取生成的图片
    let generatedImageUrl: string | null = null;
    let textContent: string | null = null;
    const message = result.choices?.[0]?.message;
    const messageContent = message?.content;

    // Format 1: content_parts (Gemini native format)
    if (message?.content_parts && Array.isArray(message.content_parts)) {
      for (const part of message.content_parts) {
        if (part.inline_data?.data) {
          const mimeType = part.inline_data.mime_type || "image/png";
          generatedImageUrl = `data:${mimeType};base64,${part.inline_data.data}`;
          break;
        }
      }
    }

    // Format 2: content array with various structures
    if (!generatedImageUrl && Array.isArray(messageContent)) {
      for (const part of messageContent) {
        if (part.type === "image_url" && part.image_url?.url) {
          generatedImageUrl = part.image_url.url;
        } else if (part.type === "text") {
          textContent = part.text;
        } else if (part.type === "image" && part.data) {
          generatedImageUrl = `data:image/png;base64,${part.data}`;
        } else if (part.inline_data?.data) {
          const mimeType = part.inline_data.mime_type || "image/png";
          generatedImageUrl = `data:${mimeType};base64,${part.inline_data.data}`;
        }
      }
    }

    // Format 3: Direct string in content
    if (!generatedImageUrl && typeof messageContent === "string" && messageContent) {
      // 检查是否包含 base64 图片
      const base64Match = messageContent.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/);
      // 检查是否包含图片 URL
      const urlMatch = messageContent.match(/https?:\/\/[^\s"']+\.(jpg|jpeg|png|gif|webp)/i);

      if (base64Match) {
        generatedImageUrl = base64Match[0];
      } else if (urlMatch) {
        generatedImageUrl = urlMatch[0];
      } else if (messageContent.length > 1000 && /^[A-Za-z0-9+/=\s]+$/.test(messageContent)) {
        // 可能是纯 base64 数据
        generatedImageUrl = `data:image/png;base64,${messageContent.replace(/\s/g, '')}`;
      }
      textContent = messageContent;
    }

    if (!generatedImageUrl) {
      console.error("No image in response:", JSON.stringify(result));
      return new Response(
        JSON.stringify({
          success: false,
          error: "AI未能生成换装图片，请重试或更换照片",
          textContent,
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Virtual try-on completed successfully");

    return new Response(
      JSON.stringify({
        success: true,
        image: generatedImageUrl,
        textContent,
        personImage,
        clothingImage,
        model: "google/gemini-3-pro-image-preview",
        usage: result.usage || null,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Virtual try-on error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "换装失败，请重试" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
