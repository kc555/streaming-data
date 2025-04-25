"""
TODO: Replace with your real scraping logic.
This example simply rewrites a dummy rankingData.json file.
"""

import json

sample_data = {
    "usa": {
        "Netflix": {
            "tv": [{"nameZh": "黑鏡", "nameEn": "Black Mirror", "platform": "Netflix", "rating": "TV-MA", "genre": "科幻", "imdb": "8.8", "rt": "92%"}],
            "movie": [{"nameZh": "奧本海默", "nameEn": "Oppenheimer", "platform": "Netflix", "rating": "R", "genre": "歷史", "imdb": "8.4", "rt": "93%"}]
        }
    }
}

with open("rankingData.json", "w", encoding="utf-8") as f:
    json.dump(sample_data, f, ensure_ascii=False, indent=2)
