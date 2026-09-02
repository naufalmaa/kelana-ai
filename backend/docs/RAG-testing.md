# 📚 RAG (Knowledge Base) Testing Documentation

This document records the evaluation results of **KelanaAI RAG Assistant** powered by **AWS Bedrock Knowledge Base** (`EW7EM5BPON`) in region `ap-southeast-2` using `amazon.nova-lite-v1:0`.

In this mode, user queries retrieve high-affinity text chunks from indexed travel guides stored in Amazon S3, and the foundation model generates grounded, highly specific responses with source attribution and relevance scores.

---

## 📋 Summary Table of RAG Test Cases

| # | User Query | Primary Source Document | Top Chunk Score | Key Knowledge Grounded |
|---|---|---|---|---|
| **1** | *"Guide me trip to Osaka, Japan"* | `Osaka_Travel_Guide_EN.md` | **0.723** (72.3%) | KIX Airport trains (Nankai Rapi:t vs JR Haruka), Midosuji line, right-side escalator rule |
| **2** | *"Guide me trip to Kyoto, Japan"* | `Kyoto_Travel_Guide_EN.md` | **0.795** (79.5%) | Bus vs Subway dynamics, Gion photography ban (10,000 JPY fine), 6:30 AM overtourism hack |
| **3** | *"Guide me halal dining trip in Japan"* | `japan-halal-dining-guide.md` | **0.895** (89.5%) | JHA/NAHA/JIT certifications, Kanji label reading (豚肉, 豚脂, みりん), Konbini safe picks |
| **4** | *"Guide me trip to Kazakhstan"* | `Kazakhstan.pdf` | **0.494** (49.4%) | Koryo Tours 9-day itinerary: Nur-Sultan -> Akmol -> Kurchatov -> Semey -> Karaganda -> Almaty |
| **5** | *"Guide me trip spesific in Astana, Kazakhstan"* | `Kazakhstan.pdf` | **0.580** (58.0%) | Bayterek Tower (97m / 1997 founding), Norman Foster's Khan Shatyr & Peace Pyramid |

---

## 🔍 Test Case 1: Guide me trip to Osaka, Japan

### 💬 User Question
> **"Guide me trip to Osaka, Japan"**

### 🤖 Grounded AI Response
*Konnichiwa!* Here is your well-structured guide to planning an unforgettable trip to Osaka, Japan:

#### 🚆 1. Transportation
* **Airport Access (KIX):**
  * **Nankai Rapi:t:** Express train connecting Kansai International Airport to Namba in ~35 minutes.
  * **JR Haruka:** Direct express connecting KIX to Tennoji & Shin-Osaka in ~45 minutes.
* **City Transport:**
  * **Osaka Metro (Subway):** The most practical system. The **Midosuji Line (Red Line)** connects Kita (Umeda) and Minami (Namba/Shinsaibashi).
  * **JR Osaka Loop Line:** Circles central Osaka (fully covered by JR Pass).
* **Recommended Travel Passes:**
  * **Osaka Amazing Pass (1 or 2 days):** Unlimited subway/bus rides + free entry to 40+ attractions (Osaka Castle, Umeda Sky Building).
  * **Kansai Thru Pass:** Seamless multi-day trips to Kyoto, Nara, and Kobe.
  * **ICOCA Card:** Tap-and-go IC smart card for easy subway and convenience store payments.

#### 🏨 2. Where to Stay (Best Neighborhoods)
* **Namba / Shinsaibashi (Minami / South):**
  * *Vibe:* Neon-lit, bustling, endless street food & shopping (Dotonbori).
  * *Best for:* Food lovers, nightlife seekers, and first-timers wanting to be in the center.
* **Umeda / Osaka Station (Kita / North):**
  * *Vibe:* Sleek, modern skyscrapers, luxury department stores, major transit hub.
  * *Best for:* Travelers planning day trips to Kyoto/Kobe/Hiroshima via the Shinkansen at Shin-Osaka.
* **Tennoji:**
  * *Vibe:* Blend of retro charm and modern architecture (home to Abeno Harukas).
  * *Best for:* Families and budget travelers wanting quieter stays with direct KIX rail access.

#### 🍜 3. Must-Try Food (*Kuidaore* Philosophy)
* **Okonomiyaki:** Savory grilled cabbage pancakes loaded with pork, seafood, and bonito flakes.
* **Takoyaki:** Crispy batter balls stuffed with tender octopus pieces and sweet-savory glaze.
* **Kushikatsu:** Deep-fried meat and vegetable skewers (remember: *never double-dip!*).
* **Kobe Beef:** World-renowned marbled beef available at Teppanyaki grills.
* **Osaka-style Ramen:** Rich, thick broth with distinct curly noodles.

#### 💡 4. Essential Travel Tips
* **Best Time to Visit:** Spring (March – May for Cherry Blossoms) or Autumn (October – November for Maple Foliage).
* **Escalator Etiquette:** Stand on the **RIGHT**, walk on the **LEFT** (opposite of Tokyo!).
* **Tax-Free Shopping:** Carry your physical passport; spending over 5,000 JPY waives the 10% consumption tax instantly.
* **Internet:** Rent a Pocket WiFi or get an eSIM for Google Maps transit navigation.

---

### 📑 Retrieved Knowledge Base Sources
| Document Title | Similarity Score | S3 Source URI | Chunk ID |
|---|---|---|---|
| `Osaka_Travel_Guide_EN.md` | **0.7234** (72.3%) | `s3://kelana-bucket-.../Osaka_Travel_Guide_EN.md` | `dS6dRud-xwzemlApxt5GXs7CfqYnvWYAKWiD5bHK4y0` |
| `Osaka_Travel_Guide_EN.md` | **0.7174** (71.7%) | `s3://kelana-bucket-.../Osaka_Travel_Guide_EN.md` | `TJYO9DgbtDG6s7d4R3tZ278wErbMHUhFj4gzhr1tYtk` |
| `Osaka_Travel_Guide_EN.md` | **0.6677** (66.8%) | `s3://kelana-bucket-.../Osaka_Travel_Guide_EN.md` | `50ssB9dyxUrx3HQ5ia2cpsGCUXOJgF95J_Si_JLhclc` |
| `Osaka_Travel_Guide_EN.md` | **0.6344** (63.4%) | `s3://kelana-bucket-.../Osaka_Travel_Guide_EN.md` | `KwNCgVYmwdc79npWg-R2I8aVL4_vqWzZx5_uSi3oy3A` |
| `Osaka_Travel_Guide_EN.md` | **0.6080** (60.8%) | `s3://kelana-bucket-.../Osaka_Travel_Guide_EN.md` | `QSBaXcJ3Lp1s7tyv_h8aswW-mc0ppUgbBw2YdM5hzMM` |

<details>
<summary>🔍 Click to view Raw RAG JSON Payload</summary>

```json
{
  "question": "Guide me trip to Osaka, Japan",
  "answer": "Konnichiwa! Here's your well-structured guide to planning an unforgettable trip to Osaka, Japan...",
  "source_documents": [
    {
      "document_title": "Osaka_Travel_Guide_EN.md",
      "source_uri": "https://kelana-bucket-837933860729-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/Osaka_Travel_Guide_EN.md",
      "score": 0.7234382629394531,
      "metadata": {
        "_file_type": "PLAIN_TEXT",
        "_chunk_id": "dS6dRud-xwzemlApxt5GXs7CfqYnvWYAKWiD5bHK4y0",
        "_data_source_id": "WGORFSLRMV"
      }
    }
  ]
}
```
</details>

---

## 🔍 Test Case 2: Guide me trip to Kyoto, Japan

### 💬 User Question
> **"Guide me trip to Kyoto, Japan"**

### 🤖 Grounded AI Response
**Welcome to Kyoto!** The cultural heart of Japan captivates with tranquil zen temples, centuries-old shrines, historic wooden *machiya* houses, and exquisite kaiseki gastronomy.

#### 🚆 1. Transportation: Navigating the Ancient City
* **City Bus Network:** Reaches nearly every heritage site, but gets heavily congested during peak spring/autumn seasons.
* **Kyoto City Subway (Karasuma & Tozai Lines):** The fastest way to bypass road traffic; take the subway into districts and walk or take short bus hops.
* **Railways (JR, Keihan, Hankyu, Randen):**
  * **JR Line:** Direct to Arashiyama and Fushimi Inari.
  * **Keihan Main Line:** Direct to Gion, Kiyomizu-dera, and Higashiyama.
  * **Randen Tramway:** Scenic historic tram into western Kyoto.
* **Recommended Passes:**
  * **Subway & Bus 1-Day Pass:** Saves money and lets you switch between subway and bus to skip traffic jams.
  * **Bicycle Rental:** Kyoto's flat topography makes cycling one of the most rewarding ways to sightsee.

#### 🏨 2. Where to Stay
* **Downtown Kyoto (Kawaramachi / Shijo):** Lively, walking distance to Nishiki Market, dining arcades, and evening walks.
* **Kyoto Station Area:** High convenience for day trips (Nara, Uji, Osaka) and bullet train (Shinkansen) departures.
* **Higashiyama / Gion:** Historic atmosphere; prime location for luxury traditional *Ryokan* stays.
* **Arashiyama:** Scenic riverside retreat surrounded by forested mountains.

#### 🍵 3. Must-Try Refined Cuisine
* **Kaiseki Ryori:** Traditional multi-course fine dining celebrating seasonal themes.
* **Yudofu (Silken Tofu Hot Pot):** Clean broth made from Kyoto's renowned pure spring water (specialty of Nanzen-ji & Arashiyama).
* **Uji Matcha Sweets:** Authentic matcha parfaits, soft serves, and tea-ceremony wagashi.
* **Obanzai:** Traditional Kyoto home-style small dishes prepared from local heirloom vegetables.
* **Nishiki Market Bites:** *Tako tamago* (glazed baby octopus with quail egg), fresh soy milk donuts, and sashimi skewers.

#### 💡 4. Insider Tips to Avoid Overtourism
1. **Beat the Crowds:** Arrive at Fushimi Inari and Arashiyama Bamboo Grove before **7:00 AM**.
2. **Photography Ban in Gion:** Strictly forbidden on private alleys to protect Geiko/Maiko privacy (**fines up to 10,000 JPY**).
3. **Temple Fatigue:** Pace yourself: visit maximum 2 major sites and 1 smaller temple per day.
4. **Footwear:** Wear comfortable slip-on shoes; you will frequently remove shoes when entering temples.

---

### 📑 Retrieved Knowledge Base Sources
| Document Title | Similarity Score | S3 Source URI | Chunk ID |
|---|---|---|---|
| `Kyoto_Travel_Guide_EN.md` | **0.7954** (79.5%) | `s3://kelana-bucket-.../Kyoto_Travel_Guide_EN.md` | `IioDjknhOA5dS7uv77nbFCYZd1IqM2u92UM7ngPunkw` |
| `Kyoto_Travel_Guide_EN.md` | **0.7020** (70.2%) | `s3://kelana-bucket-.../Kyoto_Travel_Guide_EN.md` | `pgOckjMzzzG6NyeQXVDY-PEpuEQjOaatlsrRm2COV1U` |
| `Kyoto_Travel_Guide_EN.md` | **0.6302** (63.0%) | `s3://kelana-bucket-.../Kyoto_Travel_Guide_EN.md` | `kbAOlCCCHlGOni1c_q-zz1oi0lC2G3H38dU_CjU3LHQ` |
| `Kyoto_Travel_Guide_EN.md` | **0.5931** (59.3%) | `s3://kelana-bucket-.../Kyoto_Travel_Guide_EN.md` | `uOSJXJvoGHTJhRd28hFfe6PZfz9dR1aJkWU8cxmAxH8` |
| `Kyoto_Travel_Guide_EN.md` | **0.5899** (59.0%) | `s3://kelana-bucket-.../Kyoto_Travel_Guide_EN.md` | `T-05NbAvyekIs-D7kd-6sRgVTWK0B4BEHrWKURkjA_0` |

---

## 🔍 Test Case 3: Guide me halal dining trip in Japan

### 💬 User Question
> **"Guide me halal dining trip in Japan"**

### 🤖 Grounded AI Response
### 🕌 Halal Dining Guide for Muslim Travelers in Japan

#### Step 1: Recognized Halal Certification Bodies
Look for restaurant certifications from recognized authorities:
1. **Japan Halal Association (JHA)** (Recognized by JAKIM Malaysia & MUI Indonesia).
2. **Nippon Asia Halal Association (NAHA)**.
3. **Japan Islamic Trust (JIT) / Otsuka Mosque**.
4. **Kyoto Council for Sharia and Halal Affairs**.

*These certifications guarantee 100% pork-free kitchens, certified halal meats, and total absence of cooking alcohol or mirin.*

#### Step 2: Essential Japanese Phrases for Inquiring Ingredients
| English Inquiry | Japanese Kanji / Kana | Romaji Pronunciation |
|---|---|---|
| **Does this contain pork?** | これに豚肉は入っていますか？ | *Kore ni butaniku wa haitte imasu ka?* |
| **Does this contain alcohol or mirin?** | これにお酒やみりんは入っていますか？ | *Kore ni osake ya mirin wa haitte imasu ka?* |
| **I cannot eat pork or alcohol.** | 私は豚肉とお酒が食べられません | *Watashi wa butaniku to osake ga taberaremasen.* |
| **Does this soup use meat broth?** | このスープに肉エキスは入っていますか？ | *Kono sūpu ni niku ekisu wa haitte imasu ka?* |

#### Step 3: Critical Ingredients to Check on Food Labels (`原材料名`)
Scan packaging for prohibited non-halal items:
* **Pork / Pig Meat:** `豚` or `豚肉` (*Buta / Butaniku*), `ポーク` (*Pōku*)
* **Lard / Animal Fat:** `ラード` (*Rādo*), `豚脂` (*Tonshi*), `動物性油脂` (*Dōbutsusei yushi*)
* **Meat Broth / Extract:** `肉エキス` (*Niku ekisu*), `ポークエキス` (*Pōku ekisu*)
* **Alcohol / Sake:** `酒` / `清酒` (*Sake / Seishu*), `アルコール` (*Arukōru*), `酒精` (*Shusei*)
* **Cooking Mirin:** `みりん` / `味醂` (*Mirin* - sweet rice wine with 10–14% alcohol)
* **Gelatin:** `ゼラチン` (*Zerachin* - universally pork collagen unless certified)

#### Step 4: Convenience Store (Konbini) Safe Food Hacks
When shopping at 7-Eleven, Lawson, or FamilyMart:
* **Plain Salt Onigiri:** Look for `塩むすび` (*Shio Musubi*) — 100% plain salted rice with no meat or mirin seasoning.
* **Boiled Eggs:** `ゆで卵` (*Yude Tamago*) — pure water and salt.
* **Produce & Snacks:** Steamed edamame, fresh cut fruit, and baked sweet potato (*Yakiimo*).
* **Pure Dairy:** Pure fresh milk (`牛乳` - *Gyūnyū*) and plain unflavored yogurts without gelatin.

#### Step 5: Prayer Facilities (Musholla)
Major transit hubs (Tokyo Station, Kyoto Station, KIX, Haneda, Narita) feature dedicated prayer rooms with wudhu facilities.

---

### 📑 Retrieved Knowledge Base Sources
| Document Title | Similarity Score | S3 Source URI | Chunk ID |
|---|---|---|---|
| `japan-halal-dining-guide.md` | **0.8948** (89.5%) | `s3://kelana-bucket-.../japan-halal-dining-guide.md` | `edTTrHoV0kr7UCRB3bwrWTB0o4Jkk1OlQTYqlM8fkAc` |
| `japan-halal-dining-guide.md` | **0.8337** (83.4%) | `s3://kelana-bucket-.../japan-halal-dining-guide.md` | `h70tzm8W3R48cY1viSrswu6dnnjdSSxlkOvmPLLXLag` |
| `japan-halal-dining-guide.md` | **0.7402** (74.0%) | `s3://kelana-bucket-.../japan-halal-dining-guide.md` | `O*-Ebabrg6lTILxCwg9qGlkTotJ0cyV83YhEwsoa1L4` |
| `japan-halal-dining-guide.md` | **0.6684** (66.8%) | `s3://kelana-bucket-.../japan-halal-dining-guide.md` | `gNX5XvaUCDePxvVcs2irr4Y4QuaCjON-9gNq6aFR_h8` |
| `japan-halal-dining-guide.md` | **0.5599** (56.0%) | `s3://kelana-bucket-.../japan-halal-dining-guide.md` | `ibgfp3ehrUEkfZ_yJaDX1d2mOzRz3AW9NgtNWNGi__c` |

---

## 🔍 Test Case 4: Guide me trip to Kazakhstan

### 💬 User Question
> **"Guide me trip to Kazakhstan"**

### 🤖 Grounded AI Response
*Based on the Koryo Tours Kazakhstan Expedition itinerary:*

#### 🗺️ 9-Day Kazakhstan Historic & Nuclear Heritage Route
* **Day 1: Arrival in Nur-Sultan (Astana)**
  * Airport transfer, city view welcome dinner, briefing. Visit Bayterek Tower and Nur-Astana Mosque.
* **Day 2: Nur-Sultan to Akmol**
  * Drive ~1 hr to Akmol. Visit ALZHIR memorial museum for wives of Soviet 'traitors'.
* **Day 3: Akmol to Kurchatov**
  * Drive ~1.5 hrs. Explore the former secret Soviet nuclear command city ("Los Alamos of the USSR").
* **Day 4: Kurchatov to Semey**
  * Drive ~4 hrs. Visit Lenin Alley, Victory Park, and the exiled Dostoyevsky Memorial Museum. Overnight at retro Soviet-style Semey Hotel.
* **Day 5: Semey to Ust-Kamenogorsk**
  * Drive ~4 hrs across eastern steppes toward the Russian border region.
* **Day 6: Ust-Kamenogorsk to Karaganda**
  * Drive ~8 hrs. Visit the KarLag Gulag system museum (former NKVD Headquarters) and children's memorial. Lunch in industrial Shahtinsk.
* **Day 7: Karaganda to Shahtinsk**
  * Visit historical execution grounds memorials and coal mining areas; evening boarding of overnight train.
* **Day 8: Karaganda to Almaty**
  * Overnight train ride (10 hrs / 1,000 km) south to Almaty nestled against the Tian Shan mountains.
* **Day 9: Almaty Exploration**
  * Explore the historic cultural capital, Green Bazaar, and mountain viewpoints.

#### 💡 Practical Travel Tips
* **Currency:** Kazakhstani Tenge (KZT).
* **Languages:** Kazakh and Russian are primary.
* **Packing:** Northern steppe cities require warm windproof layers even in transition seasons.

---

### 📑 Retrieved Knowledge Base Sources
| Document Title | Similarity Score | S3 Source URI | Chunk ID |
|---|---|---|---|
| `Kazakhstan.pdf` | **0.4936** (49.4%) | `s3://kelana-bucket-.../Kazakhstan.pdf` | `4au3toJxLtj3VjwmbXEZoCurbEcWxoj2lGz7-AtVhok` |
| `Kazakhstan.pdf` | **0.4664** (46.6%) | `s3://kelana-bucket-.../Kazakhstan.pdf` | `u5cJg7OVp07SnR7XlANps1DqtQHL-69BscmMPwJZh0Y` |
| `Kazakhstan.pdf` | **0.4112** (41.1%) | `s3://kelana-bucket-.../Kazakhstan.pdf` | `9F9t_q-3vwU-jlsAjMXCGvoA7HyQhLGkQqfinJppgps` |
| `Kazakhstan.pdf` | **0.3965** (39.7%) | `s3://kelana-bucket-.../Kazakhstan.pdf` | `uKpiKVr8xYLOSa1adKBqf1NbRt2BCcSZlkVoXFbhdaw` |
| `Kazakhstan.pdf` | **0.3918** (39.2%) | `s3://kelana-bucket-.../Kazakhstan.pdf` | `CyjyoHvI0uyaec3uCPQ9VUiCZKPHIGLAfZzdaEYNxQg` |

---

## 🔍 Test Case 5: Guide me trip spesific in Astana, Kazakhstan

### 💬 User Question
> **"Guide me trip spesific in Astana, Kazakhstan"**

### 🤖 Grounded AI Response
Here is your specialized architectural and cultural travel guide for **Astana (Nur-Sultan), Kazakhstan**:

#### 🏛️ Day-by-Day Astana Itinerary
* **Day 1: Arrival & Capital Introduction**
  * **Airport Arrival (TSE):** International arrivals into Nursultan Nazarbayev International Airport.
  * **Evening Welcome Dinner:** Dinner at a restaurant with skyline panoramic views, followed by trip briefing.
  * **Overnight:** Modern central Astana hotel.
* **Day 2: Iconic Architectural Exploration**
  * **Bayterek Tower:** The symbol of Kazakhstan. Rise 97 meters to the golden observation sphere (commemorating 1997, the year Astana became capital) evoking the mythic *Samruk* bird laying its golden egg atop the Tree of Life.
  * **Palace of Peace and Reconciliation:** Norman Foster’s iconic 62-meter glass pyramid created to host global interfaith summits.
  * **Hazret Sultan Mosque:** The largest classical mosque in Kazakhstan, accommodating up to 5,000 worshippers with intricate Kazakh ornamental calligraphy.
  * **Khan Shatyr Entertainment Centre:** Norman Foster’s futuristic 150m-high translucent tensile tent structure with indoor beach resort and temperature regulation.
  * **River Ishim Waterfront:** Evening sunset walk along the river promenade to experience vibrant local capital life.

#### 💡 Highlights & Key Information
* **Postmodern Cityscape:** Astana's master plan combines utopian futuristic design by Kisho Kurokawa and Norman Foster.
* **Historical Roots:** Center of the Soviet Virgin Lands agricultural campaign before transforming into Central Asia's modern diplomatic hub.
* **Currency & Languages:** Kazakhstani Tenge (KZT); Kazakh (state) and Russian (official communication).

---

### 📑 Retrieved Knowledge Base Sources
| Document Title | Similarity Score | S3 Source URI | Chunk ID |
|---|---|---|---|
| `Kazakhstan.pdf` | **0.5804** (58.0%) | `s3://kelana-bucket-.../Kazakhstan.pdf` | `HR2Ygn0YuzDKmjpS3JV47lsvJB8ONwl0uIVC1gTirWw` |
| `Kazakhstan.pdf` | **0.5036** (50.4%) | `s3://kelana-bucket-.../Kazakhstan.pdf` | `9F9t_q-3vwU-jlsAjMXCGvoA7HyQhLGkQqfinJppgps` |
| `Kazakhstan.pdf` | **0.4844** (48.4%) | `s3://kelana-bucket-.../Kazakhstan.pdf` | `lLpgqu9pM8GxSW9skkOIkFvUBMhk1XJI1GqHUbugX4A` |
| `Kazakhstan.pdf` | **0.4820** (48.2%) | `s3://kelana-bucket-.../Kazakhstan.pdf` | `6iDWIg733cWJCWgEq1Yhy7cyaZ2Dy-Ii86qIytMB5Oo` |
| `Kazakhstan.pdf` | **0.4667** (46.7%) | `s3://kelana-bucket-.../Kazakhstan.pdf` | `4au3toJxLtj3VjwmbXEZoCurbEcWxoj2lGz7-AtVhok` |

<details>
<summary>🔍 Click to view Raw RAG JSON Payload</summary>

```json
{
  "question": "Guide me trip spesific in Astana, Kazakhstan",
  "answer": "Certainly! Here’s a detailed guide to your trip in Astana, Kazakhstan...",
  "source_documents": [
    {
      "document_title": "Kazakhstan.pdf",
      "source_uri": "https://kelana-bucket-837933860729-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/Kazakhstan.pdf",
      "score": 0.580353856086731,
      "metadata": {
        "_file_type": "PDF",
        "_chunk_id": "HR2Ygn0YuzDKmjpS3JV47lsvJB8ONwl0uIVC1gTirWw",
        "_data_source_id": "WGORFSLRMV"
      }
    }
  ]
}
```
</details>
