# Windows'ta Terminal Nasıl Açılır ve Git Komutları

## 🖥️ Terminal Açma Seçenekleri

### Seçenek 1: PowerShell (ÖNERİLEN)

1. **Windows tuşuna basın** (klavyede Windows logosu)
2. **"PowerShell" yazın**
3. **Windows PowerShell'e tıklayın**

VEYA

1. **Proje klasörünü açın:** `C:\Users\Şevket\Desktop\Telegram\Bildirim`
2. **Klasör içinde boş bir yere Shift + Sağ Tık yapın**
3. **"PowerShell penceresini burada aç" seçin**

### Seçenek 2: Command Prompt (CMD)

1. **Windows tuşuna basın**
2. **"cmd" yazın**
3. **Command Prompt'a tıklayın**

### Seçenek 3: VS Code Terminal (Eğer VS Code kullanıyorsanız)

1. **VS Code'u açın**
2. **Ctrl + `** (backtick) tuşlarına basın
3. Terminal otomatik açılır

---

## 📝 Git Komutlarını Çalıştırma

### Adım 1: Git Yüklü mü Kontrol Edin

Terminal'de şunu yazın:
```powershell
git --version
```

**Eğer "git is not recognized" hatası alırsanız:**
1. [Git'i indirin](https://git-scm.com/download/win)
2. İndirilen dosyayı çalıştırın
3. Kurulum sırasında tüm varsayılan ayarları kabul edin
4. Kurulum bitince terminal'i kapatıp yeniden açın

---

### Adım 2: Proje Klasörüne Gidin

Terminal'de şu komutu yazın:
```powershell
cd C:\Users\Şevket\Desktop\Telegram\Bildirim
```

**Kontrol:** Şu komutu yazın:
```powershell
dir
```

Şu dosyaları görmelisiniz:
- `package.json`
- `vercel.json`
- `api` klasörü
- `lib` klasörü

---

### Adım 3: Git Komutlarını Sırayla Çalıştırın

Her komutu yazıp **Enter** tuşuna basın:

#### 1. Git başlat
```powershell
git init
```

**Beklenen çıktı:** `Initialized empty Git repository...`

#### 2. Dosyaları ekle
```powershell
git add .
```

**Not:** Hiçbir çıktı vermeyebilir, bu normaldir.

#### 3. Commit yap
```powershell
git commit -m "Initial commit - Vercel Telegram Bot"
```

**Beklenen çıktı:** `X files changed, Y insertions(+)`

#### 4. GitHub repository'yi ekle

**ÖNEMLİ:** Önce GitHub'da repository oluşturun!

1. [GitHub'da yeni repository oluşturun](https://github.com/new)
2. Repository adı: `telegram-bot-vercel`
3. **"Create repository"** tıklayın
4. Repository URL'ini kopyalayın (örn: `https://github.com/USERNAME/telegram-bot-vercel.git`)

Sonra terminal'de:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/telegram-bot-vercel.git
```

**YOUR_USERNAME yerine kendi GitHub kullanıcı adınızı yazın!**

#### 5. Branch adını main yap
```powershell
git branch -M main
```

#### 6. GitHub'a push et
```powershell
git push -u origin main
```

**İlk kez push ediyorsanız GitHub kullanıcı adı ve şifre/token isteyebilir.**

---

## 🔐 GitHub Authentication

Eğer kullanıcı adı/şifre isterse:

### Seçenek 1: Personal Access Token (Önerilen)

1. [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. **"Generate new token (classic)"** tıklayın
3. Note: "Vercel Bot"
4. Expiration: "No expiration"
5. Scopes: **"repo"** seçin
6. **"Generate token"** tıklayın
7. Token'ı kopyalayın (bir daha göremezsiniz!)

Terminal'de:
- **Username:** GitHub kullanıcı adınız
- **Password:** Kopyaladığınız token (şifre değil!)

### Seçenek 2: GitHub Desktop (Daha Kolay)

Eğer terminal'de sorun yaşarsanız:

1. [GitHub Desktop'ı indirin](https://desktop.github.com/)
2. Kurun ve GitHub hesabınızla giriş yapın
3. **File → Add Local Repository**
4. `C:\Users\Şevket\Desktop\Telegram\Bildirim` klasörünü seçin
5. **Publish repository** butonuna tıklayın

---

## ✅ Başarı Kontrolü

GitHub'da repository'nizi açın:
```
https://github.com/YOUR_USERNAME/telegram-bot-vercel
```

Şu dosyaları görmelisiniz:
- ✅ `package.json`
- ✅ `vercel.json`
- ✅ `api/webhook.js`
- ✅ `lib/telegram.js`
- ✅ `lib/sheets.js`
- ✅ `lib/commands.js`

---

## 🐛 Sorun Giderme

### "git is not recognized" hatası

**Çözüm:** Git'i yükleyin:
1. [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. İndirin ve kurun
3. Terminal'i kapatıp yeniden açın

### "Permission denied" hatası

**Çözüm:** GitHub authentication yapın (yukarıdaki Personal Access Token bölümüne bakın)

### "fatal: not a git repository"

**Çözüm:** Doğru klasörde olduğunuzdan emin olun:
```powershell
cd C:\Users\Şevket\Desktop\Telegram\Bildirim
```

### Dosyalar GitHub'a yüklenmedi

**Kontrol:**
```powershell
git status
```

Eğer "nothing to commit" diyorsa:
```powershell
git add .
git commit -m "Add files"
git push
```

---

## 📞 Hızlı Özet

```powershell
# 1. Klasöre git
cd C:\Users\Şevket\Desktop\Telegram\Bildirim

# 2. Git başlat
git init

# 3. Dosyaları ekle
git add .

# 4. Commit yap
git commit -m "Initial commit"

# 5. GitHub repository ekle (YOUR_USERNAME değiştirin!)
git remote add origin https://github.com/YOUR_USERNAME/telegram-bot-vercel.git

# 6. Branch ayarla
git branch -M main

# 7. Push et
git push -u origin main
```

---

## 🎯 Sonraki Adım

GitHub'a başarıyla push ettikten sonra:
1. Vercel'e geçin
2. GitHub repository'nizi Vercel'e bağlayın
3. Deploy edin

Takıldığınız yeri bana söyleyin, yardımcı olayım! 🚀
