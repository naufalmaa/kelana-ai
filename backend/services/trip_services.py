def calculate_daily_budget(budget, days):
    daily_budget = budget/days
    return daily_budget

def get_trip_category(budget):
    if budget < 1000:
        return "Backpacker"
    elif budget <= 3000:
        return "Standard"
    else:
        return "Luxury"

def get_transport_recommendation(trip_category):
    if trip_category == "Backpacker":
        return "Bus"
    elif trip_category == "Standard":
        return "Train"
    elif trip_category == "Luxury":
        return "Flight"

def get_recommended_places(destination):
    recommendations = {
        "Japan" : ["Tokyo Tower", "Shibuya", "Mount Fuji"],
        "Bali" : ["Ubud", "Kuta Beach", "Tanah Lot"],
        "Singapore" : ["Marine Bay Sands", "Gardens by the Bay", "Sentosa"]
    }

    return recommendations.get(destination, ["City Center", "Local Market", "Popular Landmark"])

def get_travel_season(month):
    if month == "december":
        return "Peak Season"
    elif month == "june":
        return "Holiday Season"
    else:
        return "Regular Season"