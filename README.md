# NexusCRM — System Zarządzania Relacjami z Klientami (React + TypeScript + Tailwind CSS)

Nowoczesny, rozbudowany system **CRM (Customer Relationship Management)** klasy Enterprise, stworzony w oparciu o **React 18**, **TypeScript**, **Tailwind CSS**, **Lucide Icons** oraz bibliotekę wykresów **Recharts**.

---

## 🚀 Jak uruchomić projekt

W katalogu projektu wykonaj:

```bash
# Uruchomienie serwera deweloperskiego (Vite)
npm run dev
```

Aplikacja otworzy się pod adresem: `http://localhost:3000`

---

## 🌟 Kluczowe Funkcjonalności

### 1. 🔐 Logowanie i Zarządzanie Użytkownikami
- Nowoczesny ekran logowania w układzie split-screen z metrykami SaaS.
- **Szybkie logowanie 1-kliknięciem** dla 3 ról demonstracyjnych:
  - **Aleksandra Wiśniewska** — Dyrektor Handlowy & Administrator
  - **Michał Kowalczyk** — Senior Account Executive (Sprzedawca B2B)
  - **Karolina Nowak** — Customer Success Manager
- Przełączanie użytkowników w locie z poziomu menu bocznego (Sidebar).

### 2. 📊 Pulpit Główny (Dashboard KPI & Analityka)
- **Karty metryk finansowych (KPI)**: Zrealizowany przychód, wartość otwartego lejka, wskaźnik wygranych (Win Rate %), aktywni kontrahenci.
- **Interaktywny wykres przychodów (Recharts)** z możliwością przełączania między wykresem obszarowym (Area) a słupkowym (Bar).
- **Podgląd etapów lejka** z dynamicznymi paskami postępu.
- **Widget ostatnich interakcji** z bezpośrednim linkiem do profilu firmy.
- **Lista pilnych zadań z natychmiastowym odznaczaniem wykonania**.

### 3. 🏢 Baza i Zarządzanie Klientami (360° Client Profile)
- Widok tabeli (Table) oraz widok kafelkowy (Grid/Cards).
- Wyszukiwanie pełnotekstowe po nazwie, NIP, mieście, adresie e-mail.
- Zaawansowane filtry po statusie (VIP, Aktywny, Negocjacje, W kontakcie, Nowy Lead, Nieaktywny) oraz branży.
- Sortowanie po nazwie, przychodzie rocznym i dacie ostatniego kontaktu.
- **Widok 360° kontrahenta (ClientDetailModal)**:
  - Historia kontaktów i notatek powiązanych wyłącznie z tym klientem.
  - Szybki formularz dopisywania rozmów/spotkań do osi czasu.
  - Lista bezpośrednich osób kontaktowych w firmie.
  - Aktywne szanse sprzedaży w toku.
  - Dane rejestrowe, NIP, KRS, etykiety (Tagi).

### 4. 👥 Książka Kontaktów (Contacts Directory)
- Katalog osób decyzyjnych i operacyjnych z awatarami.
- Oznaczenie gwiazdką głównych decydentów (*Primary decision maker*).
- Bezpośrednie przyciski szybkiej komunikacji: **Zadzwoń (`tel:`)** oraz **Napisz e-mail (`mailto:`)**.
- Powiązanie z profilami przedsiębiorstw.

### 5. 🎯 Lejek Sprzedaży (Kanban Board)
- Wizualna tablica Kanban z 6 etapami:
  1. **Nowy Lead**
  2. **Kwalifikacja**
  3. **Oferta**
  4. **Negocjacje**
  5. **Wygrana (Won)**
  6. **Przegrana (Lost)**
- Wartość sumaryczna i licznik szans na każdym etapie.
- Płynne przesuwanie szans między etapami (Dalej / Cofnij).
- Wskaźnik prawdopodobieństwa sukcesu (%) oraz **wartość ważona prognozy sprzedaży (Forecast)**.

### 6. 📞 Rejestr Historii Kontaktów i Notatek (Activity Log)
- Rejestrowanie:
  - Rozmów telefonicznych
  - Spotkań handlowych
  - Korespondencji e-mail
  - Notatek wewnętrznych
  - Ofert handlowych
- Ewidencja wyników rozmowy i planowanych kolejnych kroków (*Follow-up*).
- Filtrowanie po typie zdarzenia i kliencie.

### 7. ✅ Zadania i Przypomnienia (Tasks)
- Terminy wykonania (*Due Date*) z automatycznym oznaczaniem zaległości (*Zaległe*).
- Priorytetyzacja: Wysoki, Średni, Niski.
- Błyskawiczne oznaczanie zadań jako ukończone bezpośrednio z listy.

### 8. 📈 Raporty i Eksport Danych
- Zestawienie potencjału rynku wg branż.
- Analiza przejść w lejku konwersji.
- **Ranking skuteczności handlowców (Leaderboard)** z metrykami zrealizowanego obrotu i Win Rate.
- **Eksport danych**:
  - Eksport bazy klientów do pliku CSV
  - Eksport szans sprzedaży do pliku CSV
  - Pełna kopia zapasowa całego systemu w formacie JSON
  - Drukuj / Zapisz do PDF

### 9. 🎨 Interfejs Użytkownika (UI & UX)
- Elegancki motyw z akcentami Indigo/Slate oraz pełną obsługą **Dark Mode (Tryb Ciemny)**.
- Zwijany pasek boczny (Sidebar).
- Globalna wyszukiwarka w nagłówku z natychmiastowym podglądem wyników.
- Menu szybkiego dodawania `+ Dodaj` w nagłówku.
- System dynamicznych powiadomień **Toast**.
- Przechowywanie danych w `localStorage` z przyciskiem resetu do danych demonstracyjnych.

---

## 🛠️ Stack Technologiczny

- **Framework**: React 18 (TypeScript)
- **Narzędzie budujące**: Vite 5
- **Styling**: Tailwind CSS 3
- **Wykresy**: Recharts
- **Ikony**: Lucide React
