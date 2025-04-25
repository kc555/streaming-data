import { useState, useEffect } from "react";

const platforms = ["Prime Video", "Netflix", "Max", "Disney+", "Apple TV+"];

export default function App() {
  const [rankingData, setRankingData] = useState(null);
  const [region, setRegion] = useState("japan");
  const [platform, setPlatform] = useState(platforms[0]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("imdb");
  const [activeTab, setActiveTab] = useState("tv");
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetch("/streaming-data/rankingData.json")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then((data) => {
        setRankingData(data);
        setLoadError(false);
      })
      .catch((err) => {
        console.error("載入排行榜資料失敗", err);
        setLoadError(true);
      });
  }, []);

  useEffect(() => {
    if (rankingData && !rankingData[region]?.[platform]) {
      const available = Object.keys(rankingData[region] || {});
      if (available.length > 0) {
        setPlatform(available[0]);
      }
    }
  }, [rankingData, region, platform]);

  if (loadError) return <div className="p-4 text-center text-red-500">❌ 載入資料失敗</div>;
  if (!rankingData) return <div className="p-4 text-center">📡 正在載入...</div>;

  const dataList = rankingData[region]?.[platform]?.[activeTab] || [];
  const filtered = dataList
    .filter((item) =>
      !search || item.nameZh.includes(search) || item.nameEn.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (parseFloat(b[sortBy]) || 0) - (parseFloat(a[sortBy]) || 0));

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">🎬 串流平台排行榜</h1>
      <div className="grid grid-cols-2 md:w-1/4 gap-2">
        <button onClick={() => setActiveTab("tv")} className={activeTab === "tv" ? "bg-black text-white p-2 rounded" : "bg-white border p-2 rounded"}>影集</button>
        <button onClick={() => setActiveTab("movie")} className={activeTab === "movie" ? "bg-black text-white p-2 rounded" : "bg-white border p-2 rounded"}>電影</button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {Object.keys(rankingData).map((r) => (
          <button key={r} onClick={() => setRegion(r)} className={`px-3 py-1 rounded-full border ${region === r ? "bg-black text-white" : ""}`}>
            {r === "japan" ? "日本" : r === "usa" ? "美國" : "台灣"}
          </button>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {platforms.map((p) => (
          <button key={p} onClick={() => setPlatform(p)} className={`px-3 py-1 rounded-full border ${platform === p ? "bg-black text-white" : ""}`}>
            {p}
          </button>
        ))}
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜尋片名..." className="border p-2 rounded w-full md:w-1/2" />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded">
          <option value="imdb">IMDb 評分</option>
          <option value="rt">爛番茄分數</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">中文片名</th>
              <th className="p-2">英文片名</th>
              <th className="p-2">平台</th>
              <th className="p-2">分級</th>
              <th className="p-2">分類</th>
              <th className="p-2">IMDb</th>
              <th className="p-2">爛番茄</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{idx + 1}</td>
                <td className="p-2">{item.nameZh}</td>
                <td className="p-2">{item.nameEn}</td>
                <td className="p-2">{item.platform}</td>
                <td className="p-2">{item.rating}</td>
                <td className="p-2">{item.genre}</td>
                <td className="p-2">{item.imdb}</td>
                <td className="p-2">{item.rt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
