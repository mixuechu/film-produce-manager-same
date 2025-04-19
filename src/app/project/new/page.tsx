"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SparkMD5 from "spark-md5";

export default function NewProjectPage() {
  const [mode, setMode] = useState<'text'|'file'|''>('');
  const [textInput, setTextInput] = useState('');
  const [file, setFile] = useState<File|null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 文件表单提交逻辑
  async function handleFileSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      let text = '';
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        text = await file.text();
      } else {
        alert('目前仅支持txt文本文件上传');
        setLoading(false);
        return;
      }
      if (!text.trim()) {
        alert('文件读取失败或内容为空');
        setLoading(false);
        return;
      }
      const scriptHash = SparkMD5.hash(text);
      router.push(`/project/parse?script=${encodeURIComponent(text)}&scriptHash=${scriptHash}`);
    } catch (error) {
      alert('解析文件失败，请重试');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-8 items-center bg-zinc-50">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-8 mt-10">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">新建制片项目</h2>
        <div className="flex gap-6 mb-6">
          <button
            className={`px-4 py-2 rounded ${mode==='text'?'bg-zinc-900 text-white':'bg-zinc-200 text-zinc-900'}`}
            onClick={() => setMode('text')}
          >文本粘贴剧本</button>
          <button
            className={`px-4 py-2 rounded ${mode==='file'?'bg-zinc-900 text-white':'bg-zinc-200 text-zinc-900'}`}
            onClick={() => setMode('file')}
          >上传txt文件</button>
        </div>
        {mode==='' && <div className="text-zinc-500">请选择剧本导入方式</div>}
        {mode==='text' && (
          <form className="flex flex-col gap-4" onSubmit={e => {
            e.preventDefault();
            if (textInput.trim().length===0) return;
            const scriptHash = SparkMD5.hash(textInput);
            router.push(`/project/parse?script=${encodeURIComponent(textInput)}&scriptHash=${scriptHash}`);
          }}>
            <textarea
              placeholder="请粘贴剧本内容..."
              value={textInput}
              onChange={e=>setTextInput(e.target.value)}
              className="h-60 border rounded w-full p-3 border-zinc-300"
              required
            />
            <button className="bg-zinc-900 text-white px-8 py-2 rounded mt-4" type="submit">
              提交剧本
            </button>
          </form>
        )}
        {mode==='file' && (
          <form className="flex flex-col gap-4" onSubmit={handleFileSubmit}>
            <input
              type="file"
              accept=".txt"
              onChange={e=>setFile(e.target.files?.[0]||null)}
              className="file:mr-4 file:py-2 file:px-4 file:rounded"
              required
            />
            <button disabled={!file || loading} className="bg-zinc-900 text-white px-8 py-2 rounded mt-2 disabled:bg-zinc-400" type="submit">
              {loading?"读取中...":"上传并解析"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
