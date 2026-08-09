# Sevgi Gücü Sınağı — Love Calculator (Yenidən Qurulmuş Versiya)

Bu, orijinal `love-calculator-main` layihəsinin tam yenidən qurulmuş, professional versiyasıdır.
Konsepsiya: köhnə karnaval meydançalarındakı **"Test Your Strength" (Güc Sınağı)** maşınından
ilhamlanan, "high-striker" üslublu bir sevgi ölçən — çəkic düşür, işıqlar sıra ilə yanır, güc
kifayət qədər yüksəkdirsə zəng çalınır və konfeti yağır.

---

## 1. Orijinal koddan nə dəyişdi və niyə

| Mövzu | Əvvəl | İndi |
|---|---|---|
| Fayl strukturu | Tək genişlənməsiz fayl (`love calculator code`), HTML/CSS/JS qarışıq | `index.html` / `style.css` / `script.js` — ayrı, təmiz, saxlanılası struktur |
| README | Layihəni "Python-da yazılıb" adlandırırdı, amma kod əslində HTML/JS idi | Doğru, dəqiq təsvir (siz bunu tapıb düzəltmişdiniz — bu versiya da faktlara sadiqdir) |
| Alqoritm | `Math.random() * 100` — hər klikdə fərqli, mənasız nəticə | Adların hərflərini müqayisə edən **deterministik** klassik "sevgi kalkulyatoru" alqoritmi (aşağıda izah olunur) — eyni iki ad həmişə eyni nəticəni verir |
| Doğrulama | Yalnız boş sahə yoxlanılırdı | Boş sahə, yalnız hərfsiz giriş (məs. `123`) və fokus idarəetməsi |
| Dizayn | Generic ağ kart, çəhrayı gradient, düz email-form görünüşü | Fərqləndirici karnaval "high-striker" temalı, marquee işıqları, bilet-üslubunda nəticə talonu |
| Responsivlik | Sadə media query | Tam mobil-ilk struktur, tower mobil ekranda formanın üstünə keçir |
| Əlçatanlıq | Yox | `aria-live`, klaviatura fokus halqaları, `prefers-reduced-motion` dəstəyi |
| Paylaşım | Yox | Nəticəni bir kliklə clipboard-a kopyalama |

## 2. Alqoritm necə işləyir (tədqiqat əsaslı)

Araşdırma göstərdi ki, əsl "love calculator" saytlarının əksəriyyəti eyni ailəyə aid, hərf-əsaslı
**azaltma (cancellation) alqoritmi** işlədir (bəziləri buna "LOVES" və ya "FLAMES" metodu deyir):

1. Hər iki ad kiçik hərfə çevrilir, hərf olmayan simvollar (boşluq, rəqəm və s.) silinir.
2. Bir addakı hər hərf, digər addakı eyni hərflə "ləğv edilir" (hər ikisindən bir dəfə silinir).
3. Ləğv olunmadan qalan hərflərin sayı hər iki ad üçün ayrıca sayılır (məs. `3` və `4`).
4. Bu iki rəqəm yan-yana yazılır (`"34"`), və nəticə iki rəqəmə düşənə qədər **qonşu rəqəmlər
   cütlərini toplayıb, 10-a görə qalığı götürməklə** azaldılır.
5. Qalan iki rəqəm faiz kimi göstərilir. Bütün hərflər tam ləğv olunarsa (adlar eyni hərflərdən
   ibarətdirsə), nəticə `100%`-dir.

Bu üsul **deterministikdir**: "Nurlan" və "Aygün" həmişə eyni faizi verəcək, adların sırası
dəyişsə belə (`calculateLovePercent("A","B")` === `calculateLovePercent("B","A")`), çünki hərf
ləğvi simmetrikdir. Bu, orijinal koddakı təsadüfi `Math.random()`-dan fərqli olaraq, istifadəçiyə
"nəticə mənalıdır" hissi verir — baxmayaraq ki, aydın şəkildə əyləncə məqsədlidir (bunu həm UI-da,
həm footer-də açıq yazmışıq).

Kod Azərbaycan hərflərini (ə, ö, ü, ğ, ı, ç, ş) də düzgün tanıyır (`\p{L}` Unicode hərf sinfi ilə).

## 3. Fayl strukturu

```
love-calculator/
├── index.html      → Səhifənin strukturu (form, tower, nəticə talonu)
├── style.css        → Bütün dizayn: rənglər, tipoqrafiya, animasiyalar, responsivlik
├── script.js         → Alqoritm, tower animasiyası, konfeti, form idarəetməsi
└── README.md          → Bu fayl
```

Heç bir kənar framework və ya build addımı yoxdur — təmiz HTML/CSS/JS. Yalnız Google Fonts
üzərindən 3 şrift yüklənir (internet lazımdır; yoxdursa, brauzer sistem şriftinə keçir və hər şey
yenə işləyir, sadəcə fərqli şriftlə).

## 4. Necə run etmək (yoxlamaq) olar

**Ən sadə yol:** `index.html` faylının üzərinə iki dəfə klikləyin — birbaşa brauzerdə açılacaq.
Heç bir server, npm install və ya build lazım deyil.

**Tövsiyə olunan yol (local server ilə, kliklə tam eyni davranış üçün):**

```bash
cd love-calculator
python3 -m http.server 8080
# sonra brauzerdə açın: http://localhost:8080
```

və ya VS Code-da **Live Server** əlavəsi ilə `index.html`-i açmaq.

### Test ssenariləri
1. Hər iki sahəni boş burax, "ÇƏKİCİ ENDİR"ə bas → qırmızı xəbərdarlıq mətni görünməlidir.
2. "Leyla" və "Leyla" yaz → 100%, bütün işıqlar yanmalı, zəng çalınmalı, konfeti düşməlidir.
3. İstənilən iki fərqli ad yaz → tower mərhələ-mərhələ yanmalı, bilet aşağıda faizlə görünməlidir.
4. "NƏTİCƏNİ KOPYALA" düyməsinə bas → mətn clipboard-a kopyalanmalı, düymə "KOPYALANDI ✓" olmalı.
5. "YENİDƏN SINA" düyməsinə bas → forma və tower sıfırlanmalıdır.
6. Pəncərəni mobil ölçüyə (məs. 390px) kiçilt → tower formanın üstünə keçməli, hər şey oxunaqlı
   qalmalıdır.
7. Tab düyməsi ilə naviqasiya et → fokus halqaları görünməlidir (klaviatura ilə tam istifadə
   mümkündür).

Bu versiya real brauzerdə (Chromium, Playwright ilə) həm desktop, həm mobil ölçülərdə vizual
olaraq test edilib.

## 5. Nə vaxt istəsəniz genişləndirmək üçün ideyalar (növbəti faza)

- Nəticəni Instagram Story formatında (1080×1920) şəkil olaraq yükləmək düyməsi.
- Adları saxlayıb "son 5 nəticə" tarixçəsi göstərmək (localStorage ilə — ancaq real saytda,
  Claude artifact daxilində yox).
- Süni intellektlə fərdiləşdirilmiş, hər nəticəyə uyğun qısa "sevgi məsləhəti" mətni əlavə etmək.
- Səs effekti (zəng səsi) əlavə etmək — hazırda yalnız vizual zəng animasiyası var.

---

*Bu alət yalnız əyləncə məqsədi daşıyır və elmi əsası yoxdur.*
