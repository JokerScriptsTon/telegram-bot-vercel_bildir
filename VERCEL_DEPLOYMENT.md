# Vercel Deployment - Adım Adım Talimatlar

## 📋 Gereksinimler

- ✅ Node.js yüklü (v18 veya üzeri)
- ✅ Git yüklü
- ✅ GitHub hesabı
- ✅ Google hesabı (Sheets için)

## 🚀 Deployment Adımları

### Adım 1: Google Service Account Oluşturma

Bu adım Google Sheets'e erişim için gerekli.

1. **Google Cloud Console'u açın:**
   - [https://console.cloud.google.com](https://console.cloud.google.com)
   - Google hesabınızla giriş yapın

2. **Yeni proje oluşturun:**
   - Sol üstteki proje seçiciye tıklayın
   - "New Project" tıklayın
   - Proje adı: "Telegram Bot"
   - "Create" tıklayın

3. **Google Sheets API'yi aktif edin:**
   - Sol menüden "APIs & Services" → "Library"
   - "Google Sheets API" arayın
   - "Enable" tıklayın

4. **Service Account oluşturun:**
   - "APIs & Services" → "Credentials"
   - "Create Credentials" → "Service Account"
   - Service account adı: "telegram-bot"
   - "Create and Continue" tıklayın
   - Role: "Editor" seçin
   - "Done" tıklayın

5. **JSON Key indirin:**
   - Oluşturduğunuz service account'a tıklayın
   - "Keys" sekmesine gidin
   - "Add Key" → "Create new key"
   - "JSON" seçin
   - "Create" tıklayın
   - JSON dosyası indirilecek

6. **JSON dosyasından bilgileri alın:**
   - İndirilen JSON dosyasını açın
   - `client_email` değerini kopyalayın (örn: telegram-bot@project.iam.gserviceaccount.com)
   - `private_key` değerini kopyalayın (-----BEGIN PRIVATE KEY----- ile başlar)

7. **Google Sheets'i paylaşın:**
   - [Sheets dosyanızı](https://docs.google.com/spreadsheets/d/1b-hawax_suBj3PX_hICT41tO8--6SuW6tLULgnFOfd0/edit) açın
   - Sağ üstteki "Share" butonuna tıklayın
   - `client_email` adresini ekleyin
   - "Editor" yetkisi verin
   - "Send" tıklayın

---

### Adım 2: Paketleri Yükleyin

1. **Terminal/Command Prompt açın**

2. **Proje klasörüne gidin:**
```powershell
cd C:\Users\Şevket\Desktop\Telegram\Bildirim
```

3. **Node.js paketlerini yükleyin:**
```powershell
npm install
```

Bu komut `axios` ve `google-spreadsheet` paketlerini yükleyecek.

---

### Adım 3: Environment Variables Ayarlayın

1. **`.env.local` dosyasını açın**

2. **Google Service Account bilgilerini ekleyin:**
```
BOT_TOKEN=8229026294:AAH3rBnLSA6gsfTQKIhfnT76Sy6yX9edyws
SHEET_ID=1b-hawax_suBj3PX_hICT41tO8--6SuW6tLULgnFOfd0
GOOGLE_SERVICE_ACCOUNT_EMAIL=telegram-bot@YOUR_PROJECT.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
```

**Önemli:** `GOOGLE_PRIVATE_KEY` değerini tırnak içinde yazın ve `\n` karakterlerini koruyun!

3. **Dosyayı kaydedin**

---

### Adım 4: GitHub Repository Oluşturun

1. **GitHub'da yeni repository oluşturun:**
   - [https://github.com/new](https://github.com/new)
   - Repository adı: `telegram-bot-vercel`
   - Public veya Private seçin
   - "Create repository" tıklayın

2. **Terminal'de Git komutlarını çalıştırın:**
```powershell
# Git başlat
git init

# Dosyaları ekle
git add .

# Commit yap
git commit -m "Initial commit - Vercel Telegram Bot"

# GitHub repository'yi ekle (YOUR_USERNAME yerine kendi kullanıcı adınızı yazın)
git remote add origin https://github.com/YOUR_USERNAME/telegram-bot-vercel.git

# Push et
git branch -M main
git push -u origin main
```

---

### Adım 5: Vercel'e Deploy Edin

1. **Vercel hesabı oluşturun:**
   - [https://vercel.com/signup](https://vercel.com/signup)
   - "Continue with GitHub" seçin
   - GitHub ile giriş yapın

2. **Yeni proje oluşturun:**
   - Dashboard'da "Add New" → "Project" tıklayın
   - GitHub repository'nizi seçin: `telegram-bot-vercel`
   - "Import" tıklayın

3. **Environment Variables ekleyin:**
   - "Environment Variables" bölümüne gidin
   - Şu değişkenleri ekleyin:

   | Name | Value |
   |------|-------|
   | `BOT_TOKEN` | `8229026294:AAH3rBnLSA6gsfTQKIhfnT76Sy6yX9edyws` |
   | `SHEET_ID` | `1b-hawax_suBj3PX_hICT41tO8--6SuW6tLULgnFOfd0` |
   | `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `telegram-bot@YOUR_PROJECT.iam.gserviceaccount.com` |
   | `GOOGLE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----` |

   **Önemli:** `GOOGLE_PRIVATE_KEY` değerini tam olarak kopyalayın, `\n` karakterleri dahil!

4. **Deploy edin:**
   - "Deploy" butonuna tıklayın
   - Deployment tamamlanmasını bekleyin (1-2 dakika)

5. **Deployment URL'ini kopyalayın:**
   - Deployment tamamlandığında URL gösterilecek
   - Örnek: `https://telegram-bot-vercel.vercel.app`
   - Bu URL'i kopyalayın

---

### Adım 6: Webhook'u Kurun

1. **Tarayıcınızda şu URL'i açın:**

```
https://api.telegram.org/bot8229026294:AAH3rBnLSA6gsfTQKIhfnT76Sy6yX9edyws/setWebhook?url=https://VERCEL_URL/api/webhook&drop_pending_updates=true
```

**`VERCEL_URL` yerine kendi Vercel URL'inizi yazın!**

Örnek:
```
https://api.telegram.org/bot8229026294:AAH3rBnLSA6gsfTQKIhfnT76Sy6yX9edyws/setWebhook?url=https://telegram-bot-vercel.vercel.app/api/webhook&drop_pending_updates=true
```

2. **Sonucu kontrol edin:**

Şöyle bir yanıt görmelisiniz:
```json
{
  "ok": true,
  "result": true,
  "description": "Webhook was set"
}
```

---

### Adım 7: Bot'u Test Edin! 🎉

1. **Telegram'ı açın**
2. **Bot'unuzu bulun**
3. **`/start` gönderin**

**Beklenen sonuç:**
- ✅ Bot **sadece 1 kere** cevap verir
- ✅ "🤖 Uygulama başlatıldı!" mesajını görürsünüz
- ✅ Google Sheets'te kullanıcınız kaydedilir
- ✅ Loglar sheet'inde komutunuz görünür

4. **Diğer komutları test edin:**
```
/star  → ⭐ Özel mesaj!
Merhaba → 💬 Mesajınız alındı!
```

---

## ✅ Başarı Kontrol Listesi

- [ ] Google Service Account oluşturuldu
- [ ] JSON key indirildi
- [ ] Sheets paylaşıldı
- [ ] `npm install` çalıştırıldı
- [ ] `.env.local` düzenlendi
- [ ] GitHub repository oluşturuldu
- [ ] Kod GitHub'a push edildi
- [ ] Vercel hesabı oluşturuldu
- [ ] Vercel'e deploy edildi
- [ ] Environment variables eklendi
- [ ] Webhook kuruldu
- [ ] Bot test edildi
- [ ] Sadece 1 kere cevap alındı ✅
- [ ] Sheets'te veri kaydedildi ✅

---

## 🔍 Webhook Durumunu Kontrol Etme

Webhook'un doğru kurulduğunu kontrol etmek için:

```
https://api.telegram.org/bot8229026294:AAH3rBnLSA6gsfTQKIhfnT76Sy6yX9edyws/getWebhookInfo
```

**Beklenen çıktı:**
```json
{
  "ok": true,
  "result": {
    "url": "https://telegram-bot-vercel.vercel.app/api/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0,
    "max_connections": 40
  }
}
```

**Önemli:**
- ✅ `url`: Vercel URL'iniz olmalı
- ✅ `pending_update_count`: 0 olmalı
- ✅ `last_error_message`: olmamalı

---

## 🐛 Sorun Giderme

### Bot cevap vermiyor

1. **Vercel logs'u kontrol edin:**
   - Vercel dashboard → Project → Deployments
   - Son deployment'a tıklayın
   - "Functions" sekmesine gidin
   - `/api/webhook` fonksiyonunu seçin
   - Logları inceleyin

2. **Webhook durumunu kontrol edin:**
   - `getWebhookInfo` URL'ini açın
   - `last_error_message` var mı kontrol edin

3. **Environment variables kontrol edin:**
   - Vercel dashboard → Settings → Environment Variables
   - Tüm değişkenler doğru mu?

### Google Sheets'e veri yazılmıyor

1. **Service account email'i kontrol edin:**
   - Sheets'i bu email ile paylaştınız mı?
   - Editor yetkisi var mı?

2. **Private key kontrol edin:**
   - `\n` karakterleri korunmuş mu?
   - Tırnak içinde mi?

### 302 hatası alıyorum

Vercel'de 302 hatası olmaz! Eğer hala alıyorsanız:
- Webhook URL'i doğru mu kontrol edin
- Vercel deployment başarılı mı kontrol edin

---

## 🎯 Sonraki Adımlar

Bot çalıştıktan sonra:
- ✅ Yeni komutlar ekleyebilirsiniz
- ✅ Inline keyboard'lar ekleyebilirsiniz
- ✅ Daha fazla özellik geliştirebilirsiniz

---

## 📞 Yardım

Herhangi bir adımda sorun yaşarsanız:
1. Vercel logs'u kontrol edin
2. Webhook durumunu kontrol edin
3. Bana hata mesajlarını gönderin

**Başarılar! 🚀**
