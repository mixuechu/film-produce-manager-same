"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// 简化字段定义
interface Scene { 编号: number|string; 场景标题: string; 发生地点: string; 涉及角色: string[]; 场景简介: string; }

export default function SequencePage() {
  const router = useRouter();
  const [scenes, setScenes] = useState<Scene[]|null>(null);
  const [pageError, setPageError] = useState("");

  // 优先查localStorage，回溯上一次解析确认的数据
  useEffect(() => {
    let record: any = null;
    try {
      record = localStorage.getItem("film_structured_data");
      if (record) record = JSON.parse(record);
    } catch {}
    if (!record || !record.场景) {
      setPageError("请先上传剧本并完成结构化解析/编辑，再进入顺场表页面。");
      return;
    }
    setScenes(record.场景);
  }, []);

  function moveUp(idx:number) {
    if (!scenes || idx===0) return;
    const arr = scenes.slice();
    [arr[idx-1], arr[idx]] = [arr[idx], arr[idx-1]];
    setScenes(arr);
  }
  function moveDown(idx:number) {
    if (!scenes || idx===scenes.length-1) return;
    const arr = scenes.slice();
    [arr[idx+1], arr[idx]] = [arr[idx], arr[idx+1]];
    setScenes(arr);
  }

  function saveSequence() {
    // 顺场表仅影响场景顺序，把场景覆盖回localStorage
    try {
      let record: any = localStorage.getItem("film_structured_data");
      if (record) record = JSON.parse(record);
      if (record && scenes) {
        record.场景 = scenes;
        localStorage.setItem("film_structured_data", JSON.stringify(record));
        alert("顺场表已保存！");
      }
    } catch {}
  }

  if (pageError) return <div className="p-10 text-lg text-red-600">{pageError}</div>;
  if (!scenes) return <div className="p-10 text-lg text-zinc-500">加载中…</div>;

  return (
    <div className="min-h-screen bg-zinc-50 p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">顺场表</h2>
        <table className="w-full border mb-4 text-left">
          <thead>
            <tr className="bg-zinc-100">
              <th className="px-2">顺序</th><th>编号</th><th>场景标题</th><th>发生地点</th><th>涉及角色</th><th className="px-2">调整顺序</th>
            </tr>
          </thead>
          <tbody>
            {scenes.map((s, i) => (
              <tr key={String(s.编号)+i} className="border-b">
                <td>{i+1}</td>
                <td>{s.编号}</td>
                <td>{s.场景标题}</td>
                <td>{s.发生地点}</td>
                <td>{s.涉及角色?.join(", ")}</td>
                <td className="flex gap-1">
                  <button className="px-1" disabled={i===0} onClick={()=>moveUp(i)}>↑</button>
                  <button className="px-1" disabled={i===scenes.length-1} onClick={()=>moveDown(i)}>↓</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={saveSequence} className="bg-zinc-900 text-white px-6 py-2 rounded">保存顺序</button>
        <button className="ml-4 text-zinc-500 underline" onClick={()=>router.push("/project/parse")}>返回结构化编辑</button>
      </div>
    </div>
  );
}
