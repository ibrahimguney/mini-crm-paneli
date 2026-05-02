# Mini CRM Paneli

LocalStorage tabanli, demo modu olan profesyonel mini CRM paneli.

**Canli demo:** https://ibrahimguney.github.io/mini-crm-paneli/

## Proje Amaci

Mini CRM Paneli, kucuk ekiplerin veya bireysel kullanicilarin musteri takip surecini tek ekrandan yonetebilmesi icin hazirlanan statik bir web uygulamasidir. Proje portfoy ve egitim amaclidir; backend kurmadan CRM mantigini gostermek icin veriler tarayicida saklanir.

## One Cikanlar

- Hesap acmadan incelenebilen demo calisma alani
- Kullanici adi ve sifre ile lokal kayit/giris akisi
- Musteri kaydi ekleme, silme ve tamamlama
- E-posta, telefon, oncelik ve takip tarihi alanlari
- Toplam, bekleyen, tamamlanan ve yuksek oncelikli kayit metrikleri
- Duruma ve yuksek oncelige gore filtreleme
- Arama ve siralama
- LocalStorage ile tarayicida veri saklama
- GitHub Pages ile canli yayin

## Teknolojiler

- HTML
- CSS
- Vanilla JavaScript
- LocalStorage
- GitHub Pages Actions

## Ekran Akisi

1. Ziyaretci giris ekranina gelir.
2. `Demo olarak incele` ile hesapsiz dashboard'u gorebilir.
3. Kendi kullanicisini olusturmak isterse lokal kayit akisini kullanabilir.
4. Dashboard'da musteri kaydi ekler.
5. Kayitlari filtreler, arar, siralar veya tamamlandi olarak isaretler.

## Yerelde Calistirma

Bu proje tamamen statiktir. `index.html` dosyasini tarayicida acman yeterlidir.

Alternatif olarak herhangi bir statik sunucu ile repo kok dizinini yayinlayabilirsin.

## GitHub Pages

Bu repo GitHub Pages icin workflow icerir:

```text
.github/workflows/pages.yml
```

Repository ayari:

```text
Settings > Pages > Source > GitHub Actions
```

Beklenen canli adres:

```text
https://ibrahimguney.github.io/mini-crm-paneli/
```

## Guvenlik Notu

Bu proje portfoy ve egitim amaclidir. Kullanici adi ve sifreler demo amacli olarak `localStorage` icinde tutulur. Gercek urun ortaminda su ozellikler gerekir:

- Backend API
- Sifre hashleme
- Guvenli oturum yonetimi
- Yetkilendirme
- Veritabani ve yedekleme

## Gelistirme Fikirleri

- Kayit duzenleme ozelligi
- Not gecmisi ve aktivite zaman cizelgesi
- CSV disa aktarma
- Musteri segmentleri
- Gercek backend entegrasyonu
- Supabase veya Firebase ile kalici veri saklama

## Proje Durumu

Mini CRM Paneli canli yayinda, demo modu aktif ve portfoy ana sayfasina eklenmis durumdadir.
