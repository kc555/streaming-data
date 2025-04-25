
import json
import requests
from bs4 import BeautifulSoup

# 設定平台、國家、類型
platforms = {
    "Netflix": "netflix",
    "Prime Video": "amazon-prime",
    "Disney+": "disney-plus",
    "Apple TV+": "apple-tv-plus",
    "Max": "hbo-max"
}

regions = {
    "taiwan": "taiwan",
    "japan": "japan",
    "usa": "united-states"
}

types = {
    "tv": "tv",
    "movie": "movies"
}

BASE_URL = "https://flixpatrol.com/top10/{platform}/{region}/"

def fetch_top10(platform_code, region_code):
    url = BASE_URL.format(platform=platform_code, region=region_code)
    print(f"Fetching: {url}")
    res = requests.get(url)
    soup = BeautifulSoup(res.text, "html.parser")

    data = {"tv": [], "movie": []}

    for section in soup.select(".card.mb-3"):
        title = section.select_one("h3")
        if not title:
            continue
        list_type = "tv" if "TV" in title.text else "movie"
        entries = section.select(".table tbody tr")
        for i, row in enumerate(entries[:10]):
            cells = row.select("td")
            if len(cells) < 3:
                continue
            rank_title = cells[1].text.strip()
            link = cells[1].select_one("a")
            english_title = link.get("title") if link else rank_title
            year = cells[2].text.strip()
            data[list_type].append({
                "nameZh": rank_title,
                "nameEn": english_title,
                "platform": platform_code.capitalize(),
                "rating": "N/A",
                "genre": "N/A",
                "imdb": "N/A",
                "rt": "N/A"
            })
    return data

result = {}

for region_key, region_code in regions.items():
    result[region_key] = {}
    for platform_name, platform_code in platforms.items():
        print(f"[{region_key.upper()}] {platform_name}")
        try:
            platform_data = fetch_top10(platform_code, region_code)
            result[region_key][platform_name] = platform_data
        except Exception as e:
            print(f"⚠️ Error: {e}")
            continue

with open("rankingData.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("✅ rankingData.json 更新完成")
