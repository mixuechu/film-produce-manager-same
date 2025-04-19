"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as echarts from "echarts";

export default function GraphPage() {
  const router = useRouter();
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let structured: any = null;
    try {
      const record = localStorage.getItem("film_structured_data");
      if (record) structured = JSON.parse(record);
    } catch {}
    if (!structured || !structured.场景 || !structured.角色) return;
    // 简单抽取三类节点 及常见关系
    const nodes: any[] = [], links: any[] = [];
    // 添加角色节点
    structured.角色.forEach((r:any, idx:number)=>{
      nodes.push({ id: 'actor-'+idx, name: r.name, category: 0, symbolSize: 40 });
    });
    // 添加场景节点
    structured.场景.forEach((s:any, idx:number)=>{
      nodes.push({ id: 'scene-'+idx, name: s.场景标题, category: 1, symbolSize: 45 });
    });
    // 添加道具节点（如有）
    (structured.道具||[]).forEach?.((p:any, idx:number)=>{
      nodes.push({ id: 'prop-'+idx, name: p.名称, category: 2, symbolSize: 33 });
    });
    // 连接：角色—场景(同涉及)
    structured.场景.forEach((s:any, idxS:number) => {
      (s.涉及角色||[]).forEach((rName:string) => {
        const actorIdx = structured.角色.findIndex((r:any)=>r.name===rName);
        if(actorIdx>=0)
          links.push({ source: 'actor-'+actorIdx, target: 'scene-'+idxS, value:"出演" });
      });
    });
    // 连接：场景—道具
    (structured.道具||[]).forEach?.((p:any, idxP:number) => {
      (p.出现场景编号||[]).forEach((sceneNo:number|string) => {
        const sIdx = structured.场景.findIndex((s:any) => s.编号===sceneNo);
        if(sIdx>=0)
          links.push({ source: 'scene-'+sIdx, target: 'prop-'+idxP, value:"道具" });
      });
    });

    // 渲染ECharts知识图谱
    if(chartRef.current) {
      const chart = echarts.init(chartRef.current);
      chart.setOption({
        tooltip: {},
        legend: [{data: ["角色","场景","道具"]}],
        series: [{
          type: 'graph',
          layout: 'force',
          roam: true,
          categories: [
            {name: "角色"},
            {name: "场景"},
            {name: "道具"},
          ],
          force: {
            repulsion: 200,
            edgeLength: [80,160]
          },
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: [4, 8],
          data: nodes,
          links: links,
          label: { show: true, fontSize: 13 },
        }]
      });
      // Resize自适应
      setTimeout(()=>chart.resize(), 300);
      return ()=>chart.dispose();
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 p-10">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">知识图谱</h2>
        <div ref={chartRef} className="w-full h-[550px] border rounded mb-8"></div>
        <button className="bg-zinc-900 text-white px-6 py-2 rounded" onClick={()=>router.push("/")}>返回首页</button>
      </div>
    </div>
  );
}
