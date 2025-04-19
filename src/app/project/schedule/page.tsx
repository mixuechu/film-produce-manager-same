"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Scene {
  编号: number|string;
  场景标题: string;
  发生地点: string;
  涉及角色: string[];
  场景简介: string;
}
export default function SchedulePage() {
  const router = useRouter();
  const [plan, setPlan] = useState<Array<{
    date: string;
    scene: Scene;
    dayIndex: number;
  }>>([]);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    // 取顺场表数据
    let record: any = null;
    try {
      record = localStorage.getItem("film_structured_data");
      if (record) record = JSON.parse(record);
    } catch {}
    if (!record || !record.场景 || !record.场景.length) {
      setPageError("请先完成剧本结构化和顺场表后再排期！");
      return;
    }
    // 默认每日只拍一场，后续可调整配置
    const scenes: Scene[] = record.场景;
    const baseDate = new Date();
    const rows = scenes.map((scene, i) => {
      // 按顺序分配日期
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const day = d.toISOString().split("T")[0];
      return { date: day, scene, dayIndex: i+1 };
    });
    setPlan(rows);
  }, []);

  if (pageError) return <div className="p-10 text-lg text-red-600">{pageError}</div>;
  if (!plan.length) return <div className="p-10 text-lg text-zinc-500">自动生成排期中…</div>;

  return (
    <div className="min-h-screen bg-zinc-50 p-10">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">拍摄排期表</h2>
        <table className="w-full border mb-4 text-left">
          <thead>
            <tr className="bg-zinc-100">
              <th className="px-2">日期</th><th>顺场序号</th><th>场景编号</th><th>场景标题</th><th>涉及角色</th>
            </tr>
          </thead>
          <tbody>
            {plan.map((row,i)=>(
              <tr key={row.dayIndex+"-"+row.scene.编号} className="border-b">
                <td>{row.date}</td>
                <td>{row.dayIndex}</td>
                <td>{row.scene.编号}</td>
                <td>{row.scene.场景标题}</td>
                <td>{row.scene.涉及角色?.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="bg-zinc-900 text-white px-6 py-2 rounded" onClick={()=>router.push("/project/sequence")}>返回顺场表</button>
      </div>
    </div>
  );
}
