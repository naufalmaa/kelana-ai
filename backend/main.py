"""
KelanaAI - Trip Summary Generator
Sesi 1: Aplikasi Konsol Berbasis Python
"""

def print_trip_summary(
    destination: str,
    country: str,
    days: int,
    budget: float,
    currency: str,
    travel_month: str
) -> None:
    """
    Fungsi untuk membungkus logika pencetakan ringkasan rencana perjalanan.
    Menggunakan f-strings agar tampilan output rapi, terstruktur, dan mudah dibaca.
    """
    # Format budget agar rapi (menampilkan angka bulat jika tidak ada nilai desimal)
    formatted_budget = f"{int(budget) if budget.is_integer() else budget} {currency}"

    print("\n========================")
    print("KelanaAI")
    print("========================")
    print(f"Destination  : {destination}")
    print(f"Country      : {country}")
    print(f"Days         : {days}")
    print(f"Budget       : {formatted_budget}")
    print(f"Currency     : {currency}")
    print(f"Travel Month : {travel_month}")
    print("========================\n")


def get_user_inputs():
    """
    Meminta input interaktif dari pengguna dengan penanganan konversi tipe data.
    """
    print("========================================")
    print("   Selamat Datang di KelanaAI Generator  ")
    print("========================================\n")

    destination = input("Masukkan Destinasi   : ").strip()
    country = input("Masukkan Negara      : ").strip()

    # Input & konversi tipe data int()
    while True:
        try:
            days = int(input("Masukkan Jumlah Hari : "))
            if days <= 0:
                print("⚠️  Jumlah hari harus berupa angka positif (> 0). Silakan coba lagi.")
                continue
            break
        except ValueError:
            print("⚠️  Input tidak valid! Harap masukkan angka bulat (integer).")

    # Input & konversi tipe data float()
    while True:
        try:
            budget = float(input("Masukkan Budget      : "))
            if budget < 0:
                print("⚠️  Budget tidak boleh negatif. Silakan coba lagi.")
                continue
            break
        except ValueError:
            print("⚠️  Input tidak valid! Harap masukkan angka desimal/bulat (float).")

    currency = input("Masukkan Mata Uang   : ").strip().upper()
    travel_month = input("Masukkan Bulan Travel: ").strip()

    return destination, country, days, budget, currency, travel_month


def main():
    """
    Fungsi utama untuk menjalankan program KelanaAI.
    """
    destination, country, days, budget, currency, travel_month = get_user_inputs()
    print_trip_summary(
        destination=destination,
        country=country,
        days=days,
        budget=budget,
        currency=currency,
        travel_month=travel_month
    )


if __name__ == "__main__":
    main()
