# 🗺️ Base Model Testing Documentation

This document contains test cases executed against the **KelanaAI Base Model Travel Generation Service** (AWS Bedrock Foundation Model without Knowledge Base RAG retrieval). In this mode, the model generates structured travel plans based on parametric knowledge and predefined system prompts.

---

## 📋 Summary Table of Test Cases

| # | Destination | Country | Days | Budget (USD) | Travel Style | Theme | Month |
|---|---|---|---|---|---|---|---|
| **1** | Osaka | Japan | 5 | $3,000 | Solo | Cultural & Culinary | January |
| **2** | Kyoto | Japan | 5 | $3,000 | Family | Luxury & Sightseeing | February |
| **3** | Halal Dining | Japan | 5 | $3,000 | Couple | Cultural & Culinary | March |
| **4** | Kazakhstan | Kazakhstan | 5 | $3,000 | Solo | Cultural & Culinary | April |
| **5** | Astana | Kazakhstan | 5 | $3,000 | Family | Luxury & Sightseeing | May |

---

## 🧪 Test Case 1: Osaka, Japan (Solo Cultural & Culinary)

### 📥 Request Input
```json
{
  "destination": "Osaka",
  "country": "Japan",
  "days": 5,
  "budget": 3000,
  "currency": "USD",
  "travel_style": "Solo",
  "trip_theme": "Cultural & Culinary",
  "travel_month": "January"
}
```

### 📤 Generated Response Summary
* **Trip ID:** `15` | **Category:** `Standard` | **Daily Budget:** `$600/day`
* **Created At:** `2026-09-02T13:58:53.387421`

#### 🌟 Trip Overview
> Discover the vibrant culture and exquisite culinary delights of Osaka, Japan, during the cool winter month of January. This itinerary immerses you in the heart of Osaka's bustling streets, historic temples, and tantalizing street food, providing a rich experience for a solo traveler.

#### 📅 Daily Itinerary
* **Day 1: Arrival and Introduction to Osaka**
  * **Morning:** Arrive at Kansai International Airport (KIX), transfer to hotel, and check in. Explore Dotonbori neon-lit street food district.
  * **Afternoon:** Visit Osaka Castle and stroll through Osaka Castle Park.
  * **Evening:** Dine on Okonomiyaki in Dotonbori; enjoy panoramic night views from Umeda Sky Building Observatory.
  * **Daily Tip:** Download Google Maps for seamless transit navigation.
* **Day 2: Cultural Immersion in Osaka**
  * **Morning:** Visit Shitenno-ji Temple (oldest Buddhist temple in Japan) and serene gardens.
  * **Afternoon:** Explore Sumiyoshi Taisha Shrine.
  * **Evening:** Sample Takoyaki at a local market; experience nightlife in Amerikamura.
  * **Daily Tip:** Purchase an IC card (Suica/Pasmo/ICOCA) for public transit.
* **Day 3: Day Trip to Nara**
  * **Morning:** Train to Nara; visit Todai-ji Temple and the Great Bronze Buddha.
  * **Afternoon:** Stroll Nara Park to feed free-roaming deer; visit Kasuga Taisha Shrine.
  * **Evening:** Return to Osaka for a traditional Kaiseki multi-course dinner.
  * **Daily Tip:** Book express train tickets in advance during peak hours.
* **Day 4: Shopping and Culinary Delights**
  * **Morning:** Visit Kuromon Ichiba Market for fresh seafood and delicacies.
  * **Afternoon:** Explore Umeda high-end shopping and Hankyu Department Store.
  * **Evening:** Dine on Kushikatsu in Namba; experience Ebisu district nightlife.
  * **Daily Tip:** Carry cash as smaller vendors do not accept credit cards.
* **Day 5: Final Day in Osaka**
  * **Morning:** Visit the Osaka Museum of History.
  * **Afternoon:** Relaxing boat ride on the Yodo River.
  * **Evening:** Farewell dinner at a local Izakaya; reflect on the journey.
  * **Daily Tip:** Take a leisurely walk to soak in the atmosphere before departure.

#### 💡 Travel Tips
* **Transport:** Use the Osaka Amazing Pass for unlimited public transit and free entry to 40+ attractions.
* **Season & Weather:** January temperatures range from 5°C to 10°C. Pack warm winter layers and an umbrella.
* **Etiquette:** Bow when greeting, remove shoes indoors, and do not tip (considered rude).
* **Connectivity:** Carry cash for small vendors; use an eSIM for data connectivity.

#### 🍱 Must-Try Food Recommendations
1. **Okonomiyaki:** Savory pancake with cabbage, pork belly, seafood, and bonito flakes (Dotonbori).
2. **Takoyaki:** Crispy battered octopus balls topped with savory sauce and kewpie mayo (Dotonbori).
3. **Kushikatsu:** Deep-fried golden skewers of meat and vegetables with dipping sauce (Namba).

#### 💰 Budget Breakdown ($3,000 Total)
| Category | Percentage | Amount (USD) | Description |
|---|---|---|---|
| **Accommodation** | 35% | $1,050.00 | Solo hotel stays / boutique accommodation |
| **Food & Dining** | 30% | $900.00 | Daily meals, street snacks, and beverages |
| **Activities & Attractions** | 20% | $600.00 | Entry fees, guided tours, and museum passes |
| **Local Transportation** | 10% | $300.00 | Metro, trains, transit passes, and airport rail |
| **Buffer & Miscellaneous** | 5% | $150.00 | Souvenirs, shopping, and emergency reserve |

<details>
<summary>🔍 Click to view Raw Output JSON</summary>

```json
{
  "id": 15,
  "country": "Japan",
  "budget": 3000,
  "category": "Standard",
  "travel_style": "Solo",
  "travel_month": "January",
  "created_at": "2026-09-02T13:58:53.387421",
  "days": 5,
  "users_id": 1,
  "destination": "Osaka",
  "currency": "USD",
  "daily_budget": 600,
  "trip_theme": "Cultural & Culinary",
  "ai_recommendation": {
    "trip_overview": "Discover the vibrant culture and exquisite culinary delights of Osaka, Japan, during the cool winter month of January. This itinerary immerses you in the heart of Osaka's bustling streets, historic temples, and tantalizing street food, providing a rich experience for a solo traveler.",
    "daily_itinerary": [
      {
        "day": 1,
        "title": "Arrival and Introduction to Osaka",
        "morning": "Arrive at Kansai International Airport, transfer to your hotel, and check-in. Explore Dotonbori, the neon-lit entertainment district known for its street food.",
        "afternoon": "Visit Osaka Castle, a historic landmark offering panoramic views of the city. Stroll through the Osaka Castle Park and enjoy the seasonal flora.",
        "evening": "Dine on Okonomiyaki, a savory pancake with various toppings, at a local eatery in Dotonbori. Explore the night view from the Umeda Sky Building Observatory.",
        "daily_tip": "Download the Google Maps app for easy navigation and to find hidden gems in Osaka."
      },
      {
        "day": 2,
        "title": "Cultural Immersion in Osaka",
        "morning": "Visit Shitenno-ji Temple, the oldest Buddhist temple in Japan, and its beautiful gardens.",
        "afternoon": "Explore the Sumiyoshi Taisha Shrine, one of Osaka's oldest Shinto shrines, and enjoy the serene atmosphere.",
        "evening": "Sample Takoyaki, grilled octopus balls, at a local market. Experience the nightlife in the Amerikamura district.",
        "daily_tip": "Consider purchasing a Suica or Pasmo card for convenient travel on public transport."
      },
      {
        "day": 3,
        "title": "Day Trip to Nara",
        "morning": "Take a train to Nara. Visit Todai-ji Temple, home to the world's largest bronze Buddha statue.",
        "afternoon": "Explore Nara Park, where you can feed the free-roaming deer, and visit Kasuga Taisha Shrine.",
        "evening": "Return to Osaka and enjoy a traditional Kaiseki dinner, a multi-course meal that highlights seasonal ingredients.",
        "daily_tip": "Book your train tickets in advance to avoid long queues at the ticket machines."
      },
      {
        "day": 4,
        "title": "Shopping and Culinary Delights",
        "morning": "Visit Kuromon Ichiba Market, a lively market offering fresh seafood, vegetables, and local delicacies.",
        "afternoon": "Explore the Umeda district, known for its high-end shopping and dining. Visit Hankyu Department Store for a taste of luxury.",
        "evening": "Dine on Kushikatsu, deep-fried skewers, in the Namba area. Experience the vibrant nightlife in the Ebisu district.",
        "daily_tip": "Carry cash as many smaller establishments may not accept credit cards."
      },
      {
        "day": 5,
        "title": "Final Day in Osaka",
        "morning": "Visit the Osaka Museum of History, offering insights into the city's rich past.",
        "afternoon": "Enjoy a relaxing boat ride on the Yodo River, providing a unique perspective of the city.",
        "evening": "Farewell dinner at a local Izakaya, a Japanese pub offering a variety of small dishes and drinks. Reflect on your journey through Osaka.",
        "daily_tip": "Take a leisurely walk to soak in the city's atmosphere before departing."
      }
    ],
    "travel_tips": [
      {
        "title": "Local Transport & Navigation",
        "tip": "Use the Osaka Amazing Pass for unlimited rides on public transport and discounts on attractions. Download the HyperDia app for train schedules."
      },
      {
        "title": "Season & Weather in January",
        "tip": "Expect temperatures between 5°C to 10°C. Pack warm clothing, including a coat, and be prepared for occasional rain."
      },
      {
        "title": "Culture & Etiquette",
        "tip": "Respect local customs, such as bowing when greeting, removing shoes when entering homes, and not tipping as it is considered rude."
      },
      {
        "title": "Money & Connectivity",
        "tip": "Carry cash for small purchases and use credit cards for larger transactions. Consider getting an eSIM for internet access."
      }
    ],
    "food_recommendations": [
      {
        "dish": "Okonomiyaki",
        "description": "A savory pancake made with flour, eggs, cabbage, and a choice of toppings such as pork belly, seafood, and cheese, topped with sauce, mayonnaise, and bonito flakes.",
        "recommended_spot": "Dotonbori, local street food stalls"
      },
      {
        "dish": "Takoyaki",
        "description": "Grilled balls made from a batter of flour, eggs, and octopus, filled with pickled ginger, green onion, and topped with mayonnaise and bonito flakes.",
        "recommended_spot": "Dotonbori, local markets"
      },
      {
        "dish": "Kushikatsu",
        "description": "Deep-fried skewers of meat, seafood, and vegetables coated in a light batter, served with a tangy dipping sauce.",
        "recommended_spot": "Namba, local Izakayas"
      }
    ],
    "budget_breakdown": [
      {
        "category": "Accommodation",
        "percentage": 35,
        "estimated_amount": 1050.0,
        "description": "Recommended stays matching Solo style in USD"
      },
      {
        "category": "Food & Dining",
        "percentage": 30,
        "estimated_amount": 900.0,
        "description": "Daily meals, street snacks, and beverages"
      },
      {
        "category": "Activities & Attractions",
        "percentage": 20,
        "estimated_amount": 600.0,
        "description": "Entry fees, guided tours, and museum passes"
      },
      {
        "category": "Local Transportation",
        "percentage": 10,
        "estimated_amount": 300.0,
        "description": "Metro, trains, public transit, and rideshares"
      },
      {
        "category": "Buffer & Miscellaneous",
        "percentage": 5,
        "estimated_amount": 150.0,
        "description": "Souvenirs, shopping, and emergency reserve"
      }
    ]
  }
}
```
</details>

---

## 🧪 Test Case 2: Kyoto, Japan (Family Luxury & Sightseeing)

### 📥 Request Input
```json
{
  "destination": "Kyoto",
  "country": "Japan",
  "days": 5,
  "budget": 3000,
  "currency": "USD",
  "travel_style": "Family",
  "trip_theme": "Luxury & Sightseeing",
  "travel_month": "February"
}
```

### 📤 Generated Response Summary
* **Trip ID:** `16` | **Category:** `Standard` | **Daily Budget:** `$600/day`
* **Created At:** `2026-09-02T14:01:12.475923`

#### 🌟 Trip Overview
> Discover the timeless charm of Kyoto, Japan, where February's crisp air and potential snowfall create a magical winter wonderland. This luxury family sightseeing itinerary immerses you in the rich cultural heritage, scenic beauty, and exquisite culinary delights of Kyoto.

#### 📅 Daily Itinerary
* **Day 1: Arrival and Traditional Kyoto**
  * **Morning:** Arrive at Kyoto Station. Check in at a luxury ryokan. Visit Kinkaku-ji (Golden Pavilion).
  * **Afternoon:** Explore Nijo Castle and gardens. Enjoy a traditional tea ceremony experience.
  * **Evening:** Multi-course Kaiseki dinner highlighting seasonal winter ingredients.
  * **Daily Tip:** Book cultural experiences and tea ceremonies in advance.
* **Day 2: Sacred Sites and Culinary Delights**
  * **Morning:** Visit Fushimi Inari Taisha (Torii gates). Head to Arashiyama for a bamboo grove walk.
  * **Afternoon:** Hozu River boat ride, explore Tenryu-ji Temple, lunch at soba noodle restaurant.
  * **Evening:** Interactive dinner at a high-end izakaya.
  * **Daily Tip:** Wear comfortable slip-on walking shoes.
* **Day 3: Historical Kyoto**
  * **Morning:** Visit historic Gion district; explore Yasaka Shrine.
  * **Afternoon:** Kyoto Imperial Palace and gardens; traditional lunch at a ryotei.
  * **Evening:** Attend a Geisha performance at Gion Corner.
  * **Daily Tip:** Reserve Gion Corner tickets early.
* **Day 4: Nature and Luxury**
  * **Morning:** Visit Amanoiwato Shrine and surrounding gardens.
  * **Afternoon:** Visit Kyoto National Museum; luxury bento lunch.
  * **Evening:** Michelin-starred fine dining experience.
  * **Daily Tip:** Book dining reservations well in advance.
* **Day 5: Departure and Last-Minute Exploration**
  * **Morning:** Visit Tofuku-ji Temple; shop for souvenirs at Nishiki Market.
  * **Afternoon:** Walk Philosopher's Path; indulge in a matcha tea tasting.
  * **Evening:** Farewell sushi dinner savoring fresh seafood.
  * **Daily Tip:** Check out early to maximize your final day.

#### 💡 Travel Tips
* **Transport:** IC Card (Suica/Pasmo/ICOCA) + Kyoto City Bus One-Day Pass.
* **Season & Weather:** February temperatures between 3°C to 10°C; bring waterproof shoes for possible snow.
* **Etiquette:** Bow when greeting, remove shoes before entering traditional rooms, no tipping.
* **Connectivity:** Japan Rail Pass for intercity travel + local eSIM.

#### 🍱 Must-Try Food Recommendations
1. **Kaiseki:** Multi-course seasonal culinary art (Gion Ryotei).
2. **Yudofu:** Silken tofu simmered in kombu broth (Specialty shops in Arashiyama / City Center).
3. **Matcha Desserts:** High-grade matcha parfaits, mochi, and ice cream (Arashiyama cafes).

#### 💰 Budget Breakdown ($3,000 Total)
| Category | Percentage | Amount (USD) | Description |
|---|---|---|---|
| **Accommodation** | 35% | $1,050.00 | Family-style luxury Ryokan / Hotel |
| **Food & Dining** | 30% | $900.00 | Kaiseki, high-end dining, and snacks |
| **Activities & Attractions** | 20% | $600.00 | Gion Corner, temple tickets, tea ceremonies |
| **Local Transportation** | 10% | $300.00 | Bus passes, metro, and private transfers |
| **Buffer & Miscellaneous** | 5% | $150.00 | Souvenirs, crafts, and emergency fund |

<details>
<summary>🔍 Click to view Raw Output JSON</summary>

```json
{
  "id": 16,
  "country": "Japan",
  "budget": 3000,
  "category": "Standard",
  "travel_style": "Family",
  "travel_month": "February",
  "created_at": "2026-09-02T14:01:12.475923",
  "days": 5,
  "users_id": 1,
  "destination": "Kyoto",
  "currency": "USD",
  "daily_budget": 600,
  "trip_theme": "Luxury & Sightseeing",
  "ai_recommendation": {
    "trip_overview": "Discover the timeless charm of Kyoto, Japan, where February's crisp air and potential snowfall create a magical winter wonderland. This luxury family sightseeing itinerary immerses you in the rich cultural heritage, scenic beauty, and exquisite culinary delights of Kyoto.",
    "daily_itinerary": [
      {
        "day": 1,
        "title": "Arrival and Traditional Kyoto",
        "morning": "Arrive at Kyoto Station. Check-in at a luxury ryokan for a traditional Japanese experience. Visit Kinkaku-ji (Golden Pavilion) to admire its stunning golden facade.",
        "afternoon": "Explore Nijo Castle, a UNESCO World Heritage site, and stroll through its beautiful gardens. Enjoy a traditional tea ceremony experience at a local tea house.",
        "evening": "Dine at a kaiseki restaurant for an authentic multi-course meal showcasing seasonal ingredients.",
        "daily_tip": "Book cultural experiences in advance, as they can be popular."
      },
      {
        "day": 2,
        "title": "Sacred Sites and Culinary Delights",
        "morning": "Visit Fushimi Inari Taisha with its iconic torii gates. Head to Arashiyama for a serene bamboo grove walk.",
        "afternoon": "Take a boat ride on the Hozu River, then explore Tenryu-ji Temple. Enjoy lunch at a local soba noodle restaurant.",
        "evening": "Dine at a high-end izakaya for an interactive cooking class and dinner.",
        "daily_tip": "Wear comfortable shoes for walking long distances."
      },
      {
        "day": 3,
        "title": "Historical Kyoto",
        "morning": "Visit the historic Gion district and look for geishas. Explore Yasaka Shrine, a significant Shinto shrine.",
        "afternoon": "Head to the Kyoto Imperial Palace and its beautiful gardens. Enjoy a traditional Kyoto lunch at a ryotei restaurant.",
        "evening": "Attend a Geisha performance at Gion Corner for an immersive cultural experience.",
        "daily_tip": "Reserve Gion Corner tickets in advance."
      },
      {
        "day": 4,
        "title": "Nature and Luxury",
        "morning": "Drive to the outskirts to visit the stunning Amanoiwato Shrine. Enjoy a leisurely walk in the Himeji Castle gardens.",
        "afternoon": "Return to Kyoto and visit the Kyoto National Museum. Enjoy a relaxing lunch at a luxury bento shop.",
        "evening": "Dine at a Michelin-starred restaurant for an unforgettable fine dining experience.",
        "daily_tip": "Book dining reservations for popular restaurants well in advance."
      },
      {
        "day": 5,
        "title": "Departure and Last-Minute Exploration",
        "morning": "Visit the picturesque Tofuku-ji Temple. Shop for souvenirs at Nishiki Market.",
        "afternoon": "Explore the picturesque Philosopher's Path and enjoy a matcha tea experience.",
        "evening": "Farewell dinner at a top-tier sushi restaurant, savoring Kyoto's freshest seafood.",
        "daily_tip": "Check out early to make the most of your last day."
      }
    ],
    "travel_tips": [
      {
        "title": "Local Transport & Navigation",
        "tip": "Use the IC card (Suica or Pasmo) for convenient travel on trains and buses. Consider a Kyoto City Bus One-Day Pass for unlimited rides."
      },
      {
        "title": "Season & Weather in February",
        "tip": "Expect temperatures between 3°C to 10°C. Pack warm clothing, including hats, gloves, and layers. February can be snowy, so bring waterproof shoes."
      },
      {
        "title": "Culture & Etiquette",
        "tip": "Bow when greeting, remove shoes when entering homes and some traditional accommodations, and avoid tipping as it is considered rude."
      },
      {
        "title": "Money & Connectivity",
        "tip": "Use a combination of cash and credit cards. Purchase a Japan Rail Pass for convenient travel between cities. Consider a local SIM card or eSIM for connectivity."
      }
    ],
    "food_recommendations": [
      {
        "dish": "Kaiseki",
        "description": "A traditional multi-course meal that showcases seasonal ingredients and meticulous presentation, reflecting Japan's culinary artistry.",
        "recommended_spot": "High-end ryotei restaurants in Gion"
      },
      {
        "dish": "Yudofu",
        "description": "A simple yet elegant dish of tofu simmered in kombu broth, often served with seasonal vegetables and dipping sauces.",
        "recommended_spot": "Specialty yudofu restaurants in the city center"
      },
      {
        "dish": "Matcha Desserts",
        "description": "Indulge in sweet treats made with high-quality matcha, such as ice cream, cakes, and mochi.",
        "recommended_spot": "Matcha-themed cafes in Arashiyama"
      }
    ],
    "budget_breakdown": [
      {
        "category": "Accommodation",
        "percentage": 35,
        "estimated_amount": 1050.0,
        "description": "Recommended stays matching Family style in USD"
      },
      {
        "category": "Food & Dining",
        "percentage": 30,
        "estimated_amount": 900.0,
        "description": "Daily meals, street snacks, and beverages"
      },
      {
        "category": "Activities & Attractions",
        "percentage": 20,
        "estimated_amount": 600.0,
        "description": "Entry fees, guided tours, and museum passes"
      },
      {
        "category": "Local Transportation",
        "percentage": 10,
        "estimated_amount": 300.0,
        "description": "Metro, trains, public transit, and rideshares"
      },
      {
        "category": "Buffer & Miscellaneous",
        "percentage": 5,
        "estimated_amount": 150.0,
        "description": "Souvenirs, shopping, and emergency reserve"
      }
    ]
  }
}
```
</details>

---

## 🧪 Test Case 3: Halal Dining, Japan (Couple Cultural & Culinary)

### 📥 Request Input
```json
{
  "destination": "Halal Dining",
  "country": "Japan",
  "days": 5,
  "budget": 3000,
  "currency": "USD",
  "travel_style": "Couple",
  "trip_theme": "Cultural & Culinary",
  "travel_month": "March"
}
```

### 📤 Generated Response Summary
* **Trip ID:** `18` | **Category:** `Standard` | **Daily Budget:** `$600/day`
* **Created At:** `2026-09-02T14:02:20.889980`

#### 🌟 Trip Overview
> Embark on a 5-day culinary and cultural adventure in Japan, focusing on Halal dining experiences. March offers a delightful season with cherry blossoms in full bloom, creating a picturesque backdrop for your couple's journey.

#### 📅 Daily Itinerary
* **Day 1: Arrival in Tokyo**
  * **Morning:** Arrive in Tokyo (NRT/HND); check in to Shinjuku hotel. Explore halal eateries around Omoide Yokocho.
  * **Afternoon:** Visit Meiji Shrine and Yoyogi Park; enjoy a tea ceremony at a halal café.
  * **Evening:** Halal-certified sushi dinner in Tsukiji Outer Market.
* **Day 2: Kyoto Exploration**
  * **Morning:** Shinkansen to Kyoto; check in; visit Fushimi Inari Shrine.
  * **Afternoon:** Explore Gion district and enjoy a halal kaiseki meal.
  * **Evening:** Stroll Arashiyama Bamboo Grove; dine at a halal-friendly izakaya.
* **Day 3: Nara Day Trip**
  * **Morning:** Day trip to Nara; visit Todai-ji Temple and Nara Deer Park.
  * **Afternoon:** Halal bento lunch; explore Kasuga Taisha Shrine.
  * **Evening:** Halal-certified dinner in Pontocho Alley, Kyoto.
* **Day 4: Osaka Culinary Adventure**
  * **Morning:** Travel to Osaka; visit Dotonbori for street food.
  * **Afternoon:** Visit Umeda Sky Building; halal okonomiyaki lunch.
  * **Evening:** Halal-certified takoyaki dinner and Shinsekai nightlife.
* **Day 5: Departure**
  * **Morning:** Visit Osaka Castle; halal breakfast at a local café.
  * **Afternoon:** Return to Tokyo; last-minute shopping at Harajuku.
  * **Evening:** Board departure flight at Haneda / Narita.

#### 💡 Travel Tips
* **Transport:** JR Pass for Tokyo-Kyoto-Osaka Shinkansen routes.
* **Weather:** March spring weather (10°C to 15°C); pack layers and an umbrella.
* **Etiquette:** No tipping; remove shoes when entering tatami areas.

#### 🍱 Must-Try Food Recommendations
1. **Halal Sushi:** Fresh seafood nigiri without mirin in sushi rice (Tsukiji, Tokyo).
2. **Halal Okonomiyaki:** Certified pork-free, alcohol-free savory pancake (Dotonbori, Osaka).
3. **Halal Takoyaki:** Fresh octopus balls cooked on dedicated grills (Shinsekai, Osaka).

#### 💰 Budget Breakdown ($3,000 Total)
| Category | Percentage | Amount (USD) | Description |
|---|---|---|---|
| **Accommodation** | 35% | $1,050.00 | Couple-friendly hotel stays |
| **Food & Dining** | 30% | $900.00 | Halal-certified meals and street dining |
| **Activities & Attractions** | 20% | $600.00 | Shrine entries, cultural tea ceremonies |
| **Local Transportation** | 10% | $300.00 | JR Shinkansen, metro, and local buses |
| **Buffer & Miscellaneous** | 5% | $150.00 | Souvenirs and emergency reserve |

<details>
<summary>🔍 Click to view Raw Output JSON</summary>

```json
{
  "id": 18,
  "country": "Japan",
  "budget": 3000,
  "category": "Standard",
  "travel_style": "Couple",
  "travel_month": "March",
  "created_at": "2026-09-02T14:02:20.889980",
  "days": 5,
  "users_id": 1,
  "destination": "Halal Dining",
  "currency": "USD",
  "daily_budget": 600,
  "trip_theme": "Cultural & Culinary",
  "ai_recommendation": {
    "trip_overview": "Embark on a 5-day culinary and cultural adventure in Japan, focusing on Halal dining experiences. March offers a delightful season with cherry blossoms in full bloom, creating a picturesque backdrop for your couple's journey.",
    "daily_itinerary": [
      {
        "day": 1,
        "title": "Arrival in Tokyo",
        "morning": "Arrive at Narita or Haneda Airport. Check-in to your hotel in Shinjuku. Explore the local halal eateries in Omoide Yokocho.",
        "afternoon": "Visit Meiji Shrine and take a stroll in Yoyogi Park. Enjoy a traditional tea ceremony at a halal café.",
        "evening": "Dine at a halal-certified sushi restaurant in Tsukiji Outer Market.",
        "daily_tip": "Carry a pocket Wi-Fi for easy navigation and communication."
      },
      {
        "day": 2,
        "title": "Kyoto Exploration",
        "morning": "Travel to Kyoto via Shinkansen (bullet train). Check-in to your hotel. Visit the Fushimi Inari Shrine.",
        "afternoon": "Explore Gion district and enjoy a traditional kaiseki meal at a halal restaurant.",
        "evening": "Stroll through Arashiyama Bamboo Grove and dine at a halal-friendly izakaya.",
        "daily_tip": "Use the Kyoto City Bus One-Day Pass for easy travel around the city."
      },
      {
        "day": 3,
        "title": "Nara Day Trip",
        "morning": "Take a day trip to Nara. Visit Todai-ji Temple and feed the deer at Nara Park.",
        "afternoon": "Enjoy a halal bento lunch at a local market. Explore Kasuga Taisha Shrine.",
        "evening": "Return to Kyoto and enjoy a halal-certified dinner in Pontocho Alley.",
        "daily_tip": "Book your Nara trip in advance to save time and hassle."
      },
      {
        "day": 4,
        "title": "Osaka Culinary Adventure",
        "morning": "Travel to Osaka. Check-in to your hotel. Visit Dotonbori for street food delights.",
        "afternoon": "Explore the Umeda Sky Building and enjoy a halal okonomiyaki lunch.",
        "evening": "Dine at a halal-certified takoyaki restaurant and explore the nightlife in Shinsekai.",
        "daily_tip": "Try local delicacies like kushikatsu and takoyaki for an authentic experience."
      },
      {
        "day": 5,
        "title": "Departure",
        "morning": "Visit Osaka Castle. Enjoy a final halal breakfast at a local café.",
        "afternoon": "Head back to Tokyo for your departure. Last-minute shopping at Harajuku.",
        "evening": "Board your flight at Haneda or Narita Airport.",
        "daily_tip": "Leave some time for unexpected culinary discoveries."
      }
    ],
    "travel_tips": [
      {
        "title": "Local Transport & Navigation",
        "tip": "Purchase a Japan Rail Pass for convenient travel between cities. Download the Hyperdia app for train schedules."
      },
      {
        "title": "Season & Weather in March",
        "tip": "Expect mild weather with temperatures ranging from 10°C to 15°C. Pack layers and an umbrella for rain."
      },
      {
        "title": "Culture & Etiquette",
        "tip": "Remove shoes when entering homes and some traditional restaurants. Avoid tipping as it is not customary in Japan."
      },
      {
        "title": "Money & Connectivity",
        "tip": "Carry cash for small purchases and use credit cards for larger transactions. Purchase a local SIM card or eSIM for connectivity."
      }
    ],
    "food_recommendations": [
      {
        "dish": "Sushi",
        "description": "Fresh, bite-sized rice topped with various seafood and vegetables, reflecting Japan's love for seafood.",
        "recommended_spot": "Tsukiji Outer Market in Tokyo"
      },
      {
        "dish": "Okonomiyaki",
        "description": "A savory pancake made with cabbage, meat, and seafood, grilled to perfection.",
        "recommended_spot": "Dotonbori in Osaka"
      },
      {
        "dish": "Takoyaki",
        "description": "Ball-shaped snacks made of wheat flour batter and filled with minced octopus, tempura pieces, pickled ginger, and green onion.",
        "recommended_spot": "Shinsekai in Osaka"
      }
    ],
    "budget_breakdown": [
      {
        "category": "Accommodation",
        "percentage": 35,
        "estimated_amount": 1050.0,
        "description": "Recommended stays matching Couple style in USD"
      },
      {
        "category": "Food & Dining",
        "percentage": 30,
        "estimated_amount": 900.0,
        "description": "Daily meals, street snacks, and beverages"
      },
      {
        "category": "Activities & Attractions",
        "percentage": 20,
        "estimated_amount": 600.0,
        "description": "Entry fees, guided tours, and museum passes"
      },
      {
        "category": "Local Transportation",
        "percentage": 10,
        "estimated_amount": 300.0,
        "description": "Metro, trains, public transit, and rideshares"
      },
      {
        "category": "Buffer & Miscellaneous",
        "percentage": 5,
        "estimated_amount": 150.0,
        "description": "Souvenirs, shopping, and emergency reserve"
      }
    ]
  }
}
```
</details>

---

## 🧪 Test Case 4: Kazakhstan (Solo Cultural & Culinary)

### 📥 Request Input
```json
{
  "destination": "Kazakhstan",
  "country": "Kazakhstan",
  "days": 5,
  "budget": 3000,
  "currency": "USD",
  "travel_style": "Solo",
  "trip_theme": "Cultural & Culinary",
  "travel_month": "April"
}
```

### 📤 Generated Response Summary
* **Trip ID:** `19` | **Category:** `Standard` | **Daily Budget:** `$600/day`
* **Created At:** `2026-09-02T14:02:58.314982`

#### 🌟 Trip Overview
> Embark on a captivating journey through Kazakhstan in April, a land of rich cultural heritage and culinary delights. Experience the charm of its cities, from the historic streets of Almaty to the majestic landscapes of Central Asia, perfect for a solo traveler eager to immerse in local traditions and flavors.

#### 📅 Daily Itinerary
* **Day 1: Arrival and Almaty Exploration**
  * **Morning:** Arrive at Almaty International Airport (ALA); check in. Visit Panfilov Park and Zenkov Cathedral.
  * **Afternoon:** Explore Almaty Central Bazaar; sample local snacks.
  * **Evening:** Traditional dinner: try *Beshbarmak* (boiled meat & noodles).
* **Day 2: Cultural Deep Dive in Almaty**
  * **Morning:** National Museum of Kazakhstan.
  * **Afternoon:** Guided tour of Green Bazaar for crafts and dried fruits.
  * **Evening:** Dinner tasting *Kuyrdak* (savory roasted meat & offal dish).
* **Day 3: Journey to Shymkent**
  * **Morning:** Early morning train to Shymkent; check in.
  * **Afternoon:** Shymkent Regional Museum and Lenin Square.
  * **Evening:** Local dinner with *Baursak* (puffy fried dough bread).
* **Day 4: Exploring Shymkent and Nur-Sultan**
  * **Morning:** Monument of the Founders and Shymkent Central Mosque.
  * **Afternoon:** Train transfer to Nur-Sultan (Astana); hotel check-in.
  * **Evening:** Bayterek Tower panoramic city views and dinner.
* **Day 5: Cultural Farewell in Nur-Sultan**
  * **Morning:** Palace of Peace and Reconciliation; National Museum.
  * **Afternoon:** Lunch enjoying *Samsa* (crispy tandoor meat pastry).
  * **Evening:** Fine dining farewell dinner.

#### 💡 Travel Tips
* **Transport:** Yandex.Go app for taxis and rideshares; domestic trains.
* **Weather:** Mild April weather; pack layers and a light jacket.
* **Culture:** Common greetings: *"Salem"* (Hello), *"Rakhmet"* (Thank you).
* **Currency:** Kazakhstani Tenge (KZT).

#### 🍱 Must-Try Food Recommendations
1. **Beshbarmak:** National dish of tender boiled horsemeat/beef over flat pasta sheets in rich broth.
2. **Samsa:** Crispy flaky pastry stuffed with seasoned lamb/beef and onions.
3. **Kuyrdak:** Sautéed liver, kidneys, and meat seasoned with garlic and onions.
4. **Baursak:** Golden fried dough puffs served with tea and honey.

#### 💰 Budget Breakdown ($3,000 Total)
| Category | Percentage | Amount (USD) | Description |
|---|---|---|---|
| **Accommodation** | 35% | $1,050.00 | Solo hotel stays across Almaty, Shymkent, Astana |
| **Food & Dining** | 30% | $900.00 | Traditional meals and tea houses |
| **Activities & Attractions** | 20% | $600.00 | Museum entries, local guides, tower tickets |
| **Local Transportation** | 10% | $300.00 | Yandex rides, domestic trains |
| **Buffer & Miscellaneous** | 5% | $150.00 | Souvenirs, bazaar shopping, emergency fund |

<details>
<summary>🔍 Click to view Raw Output JSON</summary>

```json
{
  "id": 19,
  "country": "Kazakhstan",
  "budget": 3000,
  "category": "Standard",
  "travel_style": "Solo",
  "travel_month": "April",
  "created_at": "2026-09-02T14:02:58.314982",
  "days": 5,
  "users_id": 1,
  "destination": "Kazakhstan",
  "currency": "USD",
  "daily_budget": 600,
  "trip_theme": "Cultural & Culinary",
  "ai_recommendation": {
    "trip_overview": "Embark on a captivating journey through Kazakhstan in April, a land of rich cultural heritage and culinary delights. Experience the charm of its cities, from the historic streets of Almaty to the majestic landscapes of Central Asia, perfect for a solo traveler eager to immerse in local traditions and flavors.",
    "daily_itinerary": [
      {
        "day": 1,
        "title": "Arrival and Almaty Exploration",
        "morning": "Arrive at Almaty International Airport. Transfer to the hotel and check-in. Visit Panfilov Park and Zenkov Cathedral for a glimpse into the city's history and architecture.",
        "afternoon": "Explore the Almaty Central Bazaar for a cultural immersion. Sample local snacks and interact with vendors to learn about Kazakh life.",
        "evening": "Dine at a traditional Kazakh restaurant to try Beshbarmak, a national dish made of boiled meat and vegetables.",
        "daily_tip": "Download a local transit app for easier navigation around Almaty."
      },
      {
        "day": 2,
        "title": "Cultural Deep Dive in Almaty",
        "morning": "Visit the National Museum of Kazakhstan to understand the country's history and culture.",
        "afternoon": "Take a guided tour of the Green Bazaar, a hub for local crafts and souvenirs, perfect for a cultural experience.",
        "evening": "Enjoy a dinner at a local eatery to try Kuyrdak, a savory meat pie with a unique flavor.",
        "daily_tip": "Try to learn a few Kazakh phrases to enhance your cultural experience."
      },
      {
        "day": 3,
        "title": "Journey to Shymkent",
        "morning": "Take an early morning train to Shymkent. Check into your hotel upon arrival.",
        "afternoon": "Explore the Shymkent Regional Museum and the Lenin Square for a taste of local history and architecture.",
        "evening": "Dine at a local restaurant to taste Baursak, a traditional Kazakh fried dough dessert.",
        "daily_tip": "Carry cash for small purchases as not all places accept cards."
      },
      {
        "day": 4,
        "title": "Exploring Shymkent and Nur-Sultan",
        "morning": "Visit the Monument of the Founders of Shymkent and the Shymkent Central Mosque.",
        "afternoon": "Transfer to Nur-Sultan (Astana) by train. Check into your hotel and relax.",
        "evening": "Explore the Bayterek Tower for panoramic views of the city and dine at a local restaurant.",
        "daily_tip": "Use public transport or rideshares to save on transportation costs."
      },
      {
        "day": 5,
        "title": "Cultural Farewell in Nur-Sultan",
        "morning": "Visit the Palace of Peace and Reconciliation and the National Museum of Kazakhstan.",
        "afternoon": "Enjoy a leisurely lunch at a local café, trying Samsa, a meat-filled pastry.",
        "evening": "Conclude your trip with a farewell dinner at a fine dining restaurant, savoring the local cuisine one last time.",
        "daily_tip": "Pack light and use a daypack for your daily excursions to stay mobile."
      }
    ],
    "travel_tips": [
      {
        "title": "Local Transport & Navigation",
        "tip": "Use the 'Yandex.Go' app for rideshares and public transport. Metro and buses are efficient and affordable."
      },
      {
        "title": "Season & Weather in April",
        "tip": "April in Kazakhstan sees mild temperatures, so pack layers. Rainfall is minimal, but a light jacket is advisable."
      },
      {
        "title": "Culture & Etiquette",
        "tip": "Greetings are important. Use 'Salem' for hello and 'Sagattas' for goodbye. Tipping is appreciated but not obligatory."
      },
      {
        "title": "Money & Connectivity",
        "tip": "Carry cash for smaller establishments. Use a local SIM card or eSIM for connectivity. ATMs are widely available."
      }
    ],
    "food_recommendations": [
      {
        "dish": "Beshbarmak",
        "description": "A traditional dish made of boiled meat, vegetables, and dough, reflecting the nomadic heritage of Kazakhstan.",
        "recommended_spot": "Local restaurants in Almaty and Shymkent."
      },
      {
        "dish": "Samsa",
        "description": "A savory pastry filled with meat, often served as a snack or part of a meal, showcasing the simplicity of Kazakh cuisine.",
        "recommended_spot": "Street vendors and local markets."
      },
      {
        "dish": "Kuyrdak",
        "description": "A meat pie with a unique flavor, made from lamb or beef, reflecting the diverse culinary traditions of Kazakhstan.",
        "recommended_spot": "Traditional restaurants in Almaty."
      },
      {
        "dish": "Baursak",
        "description": "A fried dough dessert, sweet or savory, enjoyed throughout Kazakhstan as a snack or dessert.",
        "recommended_spot": "Local bakeries and markets."
      }
    ],
    "budget_breakdown": [
      {
        "category": "Accommodation",
        "percentage": 35,
        "estimated_amount": 1050.0,
        "description": "Recommended stays matching Solo style in USD."
      },
      {
        "category": "Food & Dining",
        "percentage": 30,
        "estimated_amount": 900.0,
        "description": "Daily meals, street snacks, and beverages."
      },
      {
        "category": "Activities & Attractions",
        "percentage": 20,
        "estimated_amount": 600.0,
        "description": "Entry fees, guided tours, and museum passes."
      },
      {
        "category": "Local Transportation",
        "percentage": 10,
        "estimated_amount": 300.0,
        "description": "Metro, trains, public transit, and rideshares."
      },
      {
        "category": "Buffer & Miscellaneous",
        "percentage": 5,
        "estimated_amount": 150.0,
        "description": "Souvenirs, shopping, and emergency reserve."
      }
    ]
  }
}
```
</details>

---

## 🧪 Test Case 5: Astana, Kazakhstan (Family Luxury & Sightseeing)

### 📥 Request Input
```json
{
  "destination": "Astana",
  "country": "Kazakhstan",
  "days": 5,
  "budget": 3000,
  "currency": "USD",
  "travel_style": "Family",
  "trip_theme": "Luxury & Sightseeing",
  "travel_month": "May"
}
```

### 📤 Generated Response Summary
* **Trip ID:** `19` | **Category:** `Standard` | **Daily Budget:** `$600/day`
* **Created At:** `2026-09-02T14:02:58.314982`

> **Note:** The Base Model endpoint in this test instance returned a generalized multi-city Kazakhstan itinerary (Almaty, Shymkent, Astana) identical to Test Case 4 rather than generating an Astana-exclusive 5-day deep dive.

<details>
<summary>🔍 Click to view Raw Output JSON</summary>

```json
{
  "id": 19,
  "country": "Kazakhstan",
  "budget": 3000,
  "category": "Standard",
  "travel_style": "Solo",
  "travel_month": "April",
  "created_at": "2026-09-02T14:02:58.314982",
  "days": 5,
  "users_id": 1,
  "destination": "Kazakhstan",
  "currency": "USD",
  "daily_budget": 600,
  "trip_theme": "Cultural & Culinary",
  "ai_recommendation": {
    "trip_overview": "Embark on a captivating journey through Kazakhstan in April, a land of rich cultural heritage and culinary delights. Experience the charm of its cities, from the historic streets of Almaty to the majestic landscapes of Central Asia, perfect for a solo traveler eager to immerse in local traditions and flavors."
  }
}
```
</details>
