import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-50 via-white to-zinc-100 p-8">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-10 flex flex-col gap-8 items-center">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-zinc-900">制片管理平台首页</h1>
          <p className="text-zinc-600 text-lg">一站式智能剧本解析与制作全流程管理</p>
        </div>
        <ul className="text-zinc-700 list-disc px-5 self-start text-base">
          <li>支持剧本上传、粘贴和智能结构化分析</li>
          <li>自动生成角色、场景、服化道等元素表格</li>
          <li>生成剧情知识图谱和顺场表排期表</li>
          <li>流程数据可编辑、可导出</li>
        </ul>
        <Link href="/project/new">
          <button className="h-12 px-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-lg font-semibold shadow transition-all">
            新建项目
          </button>
        </Link>
        <Link href="/project/sequence">
          <button className="h-12 px-8 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-lg font-semibold shadow transition-all">
            顺场表
          </button>
        </Link>
        <Link href="/project/schedule">
          <button className="h-12 px-8 rounded-lg bg-lime-700 hover:bg-lime-600 text-white text-lg font-semibold shadow transition-all">
            排期表
          </button>
        </Link>
        <Link href="/project/graph">
          <button className="h-12 px-8 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-lg font-semibold shadow transition-all">
            知识图谱
          </button>
        </Link>
      </div>
    </main>
  );
}
