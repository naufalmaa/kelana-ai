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

