"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SparkMD5 from "spark-md5";

// 字段类型定义
interface Character { name: string; 描述: string; 主要出场场景编号: number[]; }
interface Scene { 编号: number|string; 场景标题: string; 发生地点: string; 涉及角色: string[]; 场景简介: string; }
interface Prop { 名称: string; 出现场景编号: (number|string)[]; 道具说明: string; }
interface Costume { 角色名: string; 服装描述: string; 涉及场景编号: (number|string)[]; }
interface Section { 序号: number|string; 内容要点: string; }

export default function ParsePage() {
  const searchParams = useSearchParams();
  const scriptHash = searchParams.get("scriptHash");
  // 读取原文
  let script = '';
  if (scriptHash) {
    script = typeof window !== 'undefined' ? localStorage.getItem(`film_script_raw_${scriptHash}`) || '' : '';
  }
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [data, setData] = useState<null|{
    角色: Character[];
    场景: Scene[];
    道具: Prop[];
    服装: Costume[];
    分段: Section[];
    originScript: string;
  }>(null);

  // 新增：用于受控编辑角色表格
  const [editableChars, setEditableChars] = useState<Character[]>([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!script || !scriptHash) {
      setError("缺少剧本内容，请返回重新导入");
      return;
    }
    setLoading(true);
    // 缓存结构化key
    const cacheKey = `film_structured_data_${scriptHash}`;
    let cached: any = null;
    try {
      const cacheRaw = localStorage.getItem(cacheKey);
      if (cacheRaw) cached = JSON.parse(cacheRaw);
    } catch {}
    if (cached) {
      setData(cached);
      setEditableChars(cached.角色 || []);
      setLoading(false);
      return;
    }
    // 发请求AI解析
    fetch("/api/parse-script", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script }),
    })
      .then(async r => {
        if (!r.ok) throw await r.json();
        return r.json();
      })
      .then(res => {
        setData(res);
        setEditableChars(res.角色 || []);
        try {
          localStorage.setItem(cacheKey, JSON.stringify(res));
        } catch {}
      })
      .catch(err => {
        setError((typeof err==='string') ? err : (err?.error||"解析失败"));
      })
      .finally(()=>setLoading(false));
  }, [scriptHash]);

  // 编辑角色表格的增删改
  function handleCharChange(val: string, idx: number, key: keyof Character) {
    setEditableChars(list => list.map((row, i) => i===idx ? {...row, [key]: val} : row));
  }
  function handleCharSceneChange(val: string, idx: number) {
    setEditableChars(list => list.map((row, i) => i===idx ? {...row, 主要出场场景编号: val.split(/[，, \/]+/).filter(Boolean).map(Number)} : row));
  }
  function addCharRow() {
    setEditableChars(list => [...list, { name: '', 描述: '', 主要出场场景编号: [] }]);
  }
  function removeCharRow(idx: number) {
    setEditableChars(list => list.filter((_, i) => i !== idx));
  }
  function saveChars() {
    if (!data) return;
    const updated = { ...data, 角色: editableChars };
    setData(updated);
    setEditMode(false);
    // 覆盖本地缓存，保持一致
    try {
      localStorage.setItem(`film_structured_data_${scriptHash}`, JSON.stringify(updated));
    } catch {}
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-4">剧本结构化解析</h2>
        {loading && <div className="text-lg text-zinc-500">AI解析中，请稍候……</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && data && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-semibold">剧本原文：</h3>
              <pre className="whitespace-pre-wrap p-3 bg-zinc-100 rounded border border-zinc-200 max-h-60 overflow-y-auto text-sm">{script}</pre>
            </div>
            <div>
              <h3 className="font-semibold flex items-center gap-3">角色列表
                {!editMode && (<button className="ml-2 px-2 py-1 text-xs bg-zinc-100 border rounded hover:bg-zinc-200" onClick={()=>setEditMode(true)}>编辑</button>)}
                {editMode && (
                  <>
                    <button className="ml-2 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700" onClick={saveChars}>保存</button>
                    <button className="ml-2 px-2 py-1 text-xs bg-zinc-200 text-zinc-700 rounded hover:bg-zinc-300" onClick={()=>{setEditMode(false);setEditableChars(data.角色);}}>取消</button>
                  </>
                )}
              </h3>
              <table className="w-full text-left border mb-2">
                <thead><tr><th>姓名</th><th>描述</th><th>出场场景</th><th>{editMode && (<button className="px-1 text-green-600" title="新增" onClick={addCharRow}>＋</button>)}</th></tr></thead>
                <tbody>
                  {editMode
                  ? editableChars.map((r,i) => (
                      <tr key={i}>
                        <td><input className="border rounded px-1 py-0.5 w-20" value={r.name} onChange={e=>handleCharChange(e.target.value, i, 'name')} /></td>
                        <td><input className="border rounded px-1 py-0.5 w-32" value={r.描述} onChange={e=>handleCharChange(e.target.value, i, '描述')} /></td>
                        <td><input className="border rounded px-1 py-0.5 w-28" value={r.主要出场场景编号.join(',')} onChange={e=>handleCharSceneChange(e.target.value, i)} /></td>
                        <td><button className="text-red-600 px-2" title="删除" onClick={()=>removeCharRow(i)}>删</button></td>
                      </tr>
                    ))
                  : data.角色.map((r,i) => <tr key={i}><td>{r.name}</td><td>{r.描述}</td><td>{r.主要出场场景编号?.join(", ")}</td><td></td></tr>)}
                </tbody>
              </table>
            </div>
            {/* 其余表格（保持原有只读） ... */}
          </div>
        )}
      </div>
    </div>
  );
}
