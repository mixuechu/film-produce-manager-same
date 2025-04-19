import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { script } = await req.json();
    if (!script || typeof script !== 'string') {
      return new Response(JSON.stringify({ error: 'Script内容无效' }), {
        status: 400,
      });
    }

    // 检查优先使用Azure OpenAI
    const azApiKey = process.env.AZURE_OPENAI_API_KEY;
    const azEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const azDeployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const azApiVer = process.env.AZURE_OPENAI_API_VERSION || '2024-08-01-preview';

    // 系统prompt
    const systemPrompt = `你是一名专业的影视文学剧本制片助手。请将以下剧本文本解析为结构化JSON数据，输出字段包括：
      - 角色（name，描述，主要出场场景编号数组）
      - 场景（编号、场景标题、发生地点、涉及角色数组、场景简介）
      - 道具（名称、出现场景编号数组、道具说明）
      - 服装（角色名、服装描述、涉及场景编号数组）
      - 分段（序号、内容要点）
      输出格式如下：
      {"角色":[],"场景":[],"道具":[],"服装":[],"分段":[]}
      字段若无内容不可缺失。
      最后保留原始文本在originScript字段。
    `;

    let res, errDetail = '';
    if (azApiKey && azEndpoint && azDeployment) {
      // 使用Azure OpenAI
      const url = `${azEndpoint}/openai/deployments/${azDeployment}/chat/completions?api-version=${azApiVer}`;
      res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": azApiKey,
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: script },
          ],
          temperature: 0.2,
          max_tokens: 2200,
        }),
      });
    } else {
      // Fallback: OpenAI官方API
      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey)
        return new Response(JSON.stringify({ error: '未配置任何可用API Key' }), { status: 500 });
      res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: script }
          ],
          temperature: 0.2,
          max_tokens: 2200,
        }),
      });
    }
    if (!res.ok) {
      errDetail = await res.text();
      return new Response(JSON.stringify({ error: '语言模型接口异常', detail: errDetail }), { status: 500 });
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content;
    // biome-ignore lint/suspicious/noExplicitAny: AI结构复杂，初版允许any
    let responseData: any;
    try {
      responseData = JSON.parse(raw as string);
    } catch {
      return new Response(JSON.stringify({ error: "AI解析返回非有效JSON", raw }), { status: 502 });
    }
    return new Response(JSON.stringify(responseData), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: '服务异常', detail: (error as Error).message }), { status: 500 });
  }
}
