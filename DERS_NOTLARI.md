# Mini CRM Paneli Egitim Dokumani

Bu dokuman, `Mini CRM Paneli` projesinin nasil gelistirildigini adim adim anlatir. Proje HTML, CSS ve Vanilla JavaScript ile yazilmis statik bir CRM uygulamasidir.

Canli demo:

```text
https://ibrahimguney.github.io/mini-crm-paneli/
```

## 1. Proje Hedefi

Bu projenin hedefi, musteri takip surecini basit ama profesyonel bir panel uzerinden gostermektir.

Uygulama su ihtiyaclara cevap verir:

- Musteri kaydi olusturma
- Takip gorevi yazma
- Oncelik belirleme
- Takip tarihi verme
- Kayitlari filtreleme
- Kayitlari tamamlama veya silme
- Demo moduyla hesapsiz inceleme

## 2. Dosya Yapisi

```text
index.html
styles.css
app.js
README.md
.github/workflows/pages.yml
```

Dosyalarin gorevleri:

- `index.html`: Sayfa iskeleti, formlar ve dashboard alanlari
- `styles.css`: Gorsel tasarim, grid layout ve responsive yapi
- `app.js`: Login, demo modu, kayit ekleme, filtreleme ve render mantigi
- `README.md`: Projeyi GitHub uzerinde tanitan dosya
- `pages.yml`: GitHub Pages deploy workflow'u

## 3. HTML Yapisi

Uygulama uc ana bolumden olusur:

1. Sidebar
2. Giris/demo ekrani
3. CRM dashboard

Sidebar:

```html
<aside class="sidebar">
  ...
</aside>
```

Giris ekrani:

```html
<section class="auth-view" id="authView">
  ...
</section>
```

Dashboard:

```html
<section class="dashboard-view hidden" id="dashboardView">
  ...
</section>
```

`hidden` class'i hangi ekranin gorunecegini kontrol etmek icin kullanilir.

## 4. CSS Tasarimi

Tasarimda CSS degiskenleri kullanilir:

```css
:root {
  --bg: #f5f7fb;
  --surface: #ffffff;
  --brand: #0d6b8f;
}
```

Bu yapi renkleri tek merkezden yonetmeyi saglar.

Ana layout:

```css
.app-shell {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
}
```

Bu kod sayfayi iki bolume ayirir:

- Sol filtre/sidebar alani
- Sag ana calisma alani

Mobilde tek kolona dusmek icin media query kullanilir:

```css
@media (max-width: 980px) {
  .app-shell {
    grid-template-columns: 1fr;
  }
}
```

## 5. JavaScript Veri Modeli

Uygulamada veriler `data` nesnesinde tutulur:

```js
const defaultData = {
  users: [],
  activeUser: null,
  demoMode: false,
  records: [],
};
```

Bu modelde:

- `users`: Lokal kullanicilar
- `activeUser`: Aktif kullanici
- `demoMode`: Demo modunun acik olup olmadigi
- `records`: CRM kayitlari

Veriler tarayicida saklanir:

```js
localStorage.setItem(storageKey, JSON.stringify(data));
```

## 6. Giris ve Kayit Mantigi

Form submit oldugunda `handleAuth` calisir:

```js
authForm.addEventListener("submit", handleAuth);
```

Login ve register modlari vardir:

```js
let authMode = "login";
```

Kullanici kaydi:

```js
data.users.push({ username, password });
data.activeUser = username;
```

Bu proje egitim amacli oldugu icin sifreler localStorage icinde tutulur. Gercek projelerde bu yontem kullanilmamalidir.

## 7. Demo Modu

Demo modu portfoy ziyaretcileri icin eklenmistir.

```js
function startDemo() {
  data.activeUser = demoOwner;
  data.demoMode = true;
  data.records = demoRecords.map(...);
  render();
}
```

Demo modunda kullanici hesap acmadan dashboard'u gorebilir.

Demo kayitlari:

```js
const demoRecords = [
  {
    customer: "Acme Ltd.",
    task: "Yeni teklif sunumu hazirlanacak",
    priority: "Yuksek",
    status: "open",
  },
];
```

## 8. CRM Kaydi Ekleme

Yeni kayit formu submit oldugunda `addRecord` calisir:

```js
taskForm.addEventListener("submit", addRecord);
```

Kayit nesnesi:

```js
{
  id: crypto.randomUUID(),
  owner: data.activeUser,
  customer,
  task,
  email,
  phone,
  priority,
  status: "open",
  dueDate,
  createdAt,
}
```

Her kayit aktif kullaniciya baglanir. Bu sayede farkli kullanicilar kendi kayitlarini gorur.

## 9. Filtreleme, Arama ve Siralama

Gorunen kayitlar `getVisibleRecords` fonksiyonuyla hesaplanir.

```js
function getVisibleRecords(records) {
  return records
    .filter(...)
    .filter(...)
    .sort(sortRecords);
}
```

Filtreler:

- Tum kayitlar
- Bekleyenler
- Tamamlananlar
- Yuksek oncelik

Siralama:

- En yeni
- Oncelik
- Musteri adi
- Takip tarihi

## 10. Render Mantigi

Ekrani guncelleyen ana fonksiyon:

```js
function render() {
  const loggedIn = Boolean(data.activeUser);
  authView.classList.toggle("hidden", loggedIn);
  dashboardView.classList.toggle("hidden", !loggedIn);
  if (loggedIn) renderDashboard();
}
```

Dashboard icindeki metrikleri ve listeyi `renderDashboard` gunceller.

## 11. GitHub Pages Deploy

Workflow dosyasi:

```text
.github/workflows/pages.yml
```

Bu workflow `main` branch'e push yapildiginda statik siteyi GitHub Pages'e yayinlar.

Canli adres:

```text
https://ibrahimguney.github.io/mini-crm-paneli/
```

## 12. Kontrol Sorulari

1. `localStorage` bu projede ne icin kullaniliyor?
2. Demo modu neden ayri bir mod olarak tasarlandi?
3. `render()` ve `renderDashboard()` arasindaki fark nedir?
4. Kayitlar kullaniciya nasil baglaniyor?
5. Bu projeyi gercek urune cevirmek icin hangi backend ozellikleri gerekir?

## 13. Uygulamali Odevler

### Odev 1: Kayit Duzenleme

Her kayit kartina `Duzenle` butonu ekle. Butona basildiginda kayit formu mevcut bilgilerle dolsun.

### Odev 2: CSV Disa Aktarma

Kullanici kayitlarini CSV olarak indiren bir buton ekle.

### Odev 3: Segment Alani

Musteri kaydina `Segment` alani ekle:

- Potansiyel
- Aktif
- Kaybedildi

Sonra segmente gore filtreleme ekle.

### Odev 4: Guvenlik Arastirmasi

LocalStorage icinde sifre saklamanin neden guvenli olmadigini arastir ve README'ye kisa bir not ekle.

## 14. Degerlendirme Rubrigi

| Kriter | Baslangic | Orta | Iyi |
| --- | --- | --- | --- |
| HTML | Form ve dashboard alanlarini taniyor | Yeni alan ekleyebiliyor | Semantik yapiyi iyilestirebiliyor |
| CSS | Class'lari buluyor | Layout'u degistirebiliyor | Responsive tasarimi koruyarak yeni panel ekleyebiliyor |
| JavaScript | Fonksiyonlari okuyabiliyor | Yeni filtre veya siralama ekleyebiliyor | Kayit duzenleme gibi yeni akisi kurabiliyor |
| Veri | LocalStorage mantigini anliyor | Veri modelini genisletebiliyor | Backend'e tasima planini aciklayabiliyor |
| Deploy | GitHub Pages'i acabiliyor | Workflow'u okuyabiliyor | Deploy hatasini debug edebiliyor |

## 15. Sonuc

Mini CRM Paneli, küçük ama gercek uygulama mantigina sahip bir projedir. Form yonetimi, state, localStorage, filtreleme, siralama, demo modu ve deploy adimlarini bir arada gosterir.

Bu proje tamamlandiginda ogrenci yalnizca HTML/CSS yazmis olmaz; ayni zamanda kullanici akisi, veri modeli ve canli yayin surecini de ogrenmis olur.
