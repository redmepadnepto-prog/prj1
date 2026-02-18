# Архитектура Системы Защиты Android Приложений

## Образовательный Анализ на Примере ReaperX/CheatBox

---

## 📚 Введение

Этот документ представляет собой **образовательный анализ** архитектуры систем защиты Android-приложений на реальном примере. Цель — изучить техники защиты программного обеспечения для:

- 🔬 **Исследователей безопасности** — понимание механизмов защиты
- 🛡️ **Разработчиков** — защита собственных приложений
- 📚 **Студентов** — изучение Android security

> ⚠️ **Важно:** Этот документ предназначен исключительно для образовательных целей.

---

## 🏗️ Компоненты Системы Защиты

### 1. Многоуровневая Архитектура

Современные Android-приложения используют многоуровневую систему защиты:

```
┌─────────────────────────────────────────┐
│         Java/Kotlin Layer              │
│    (classes.dex - Business Logic)       │
└──────────────────┬──────────────────────┘
                   │ JNI
┌──────────────────▼──────────────────────┐
│         Native Layer (C/C++)           │
│    (lib*.so - Core Functions)           │
└──────────────────┬──────────────────────┘
                   │ System Calls
┌──────────────────▼──────────────────────┐
│           Kernel Layer                 │
│     (Linux Syscalls - kill, exit)       │
└─────────────────────────────────────────┘
```

### 2. Защита Уровня Ядра (Kernel-Level)

#### Системный Вызов `kill()`

```c
// Пример использования системного вызова kill
#include <signal.h>
#include <unistd.h>

void terminate_process() {
    // SIGKILL = 9 - безусловное завершение
    kill(getpid(), SIGKILL);
}
```

**Почему это эффективно:**
- Вызов происходит на уровне ядра Linux
- Не перехватывается Java/DEX кодом
- Невозможно заблокировать из приложения
- Процесс завершается мгновенно

#### Системный Вызов `exit()`

```c
#include <stdlib.h>

void terminate_with_status(int status) {
    exit(status);  // Немедленный выход
}
```

### 3. Проверка Подписи APK

```java
// Пример реализации проверки подписи
public boolean verifySignature(Context context) {
    try {
        PackageInfo pkgInfo = context.getPackageManager()
            .getPackageInfo(context.getPackageName(), 
                PackageManager.GET_SIGNATURES);
        
        Signature[] signatures = pkgInfo.signatures;
        
        for (Signature signature : signatures) {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(signature.toByteArray());
            
            // Сравнение с ожидаемым хэшем
            if (!Arrays.equals(digest, EXPECTED_SIGNATURE_HASH)) {
                return false;
            }
        }
        return true;
    } catch (Exception e) {
        return false;
    }
}
```

### 4. Защитная Библиотека (Anti-Tamper)

```cpp
// Псевдокод защитной библиотеки
class ProtectionModule {
private:
    bool tamper_detected = false;
    std::atomic<bool> schedule_crash{false};
    
public:
    void check_integrity() {
        // Проверка контрольных сумм
        if (!verify_checksums()) {
            schedule_crash.store(true);
            // Задержка для затруднения отладки
            std::this_thread::sleep_for(
                std::chrono::seconds(rand() % 25 + 5)
            );
        }
    }
    
    void perform_crash() {
        if (schedule_crash.load()) {
            kill(getpid(), SIGKILL);
        }
    }
};
```

### 5. Фоновый Сервис (Daemon)

```java
public class DaemonService extends Service {
    private Handler handler = new Handler();
    private Runnable checkTask = new Runnable() {
        @Override
        public void run() {
            // Периодическая проверка
            performSecurityCheck();
            
            // Повтор через 5 секунд
            handler.postDelayed(this, 5000);
        }
    };
    
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        handler.post(checkTask);
        return START_STICKY;  // Перезапуск после kill
    }
}
```

### 6. Crash Handler

```java
public class GlobalExceptionHandler implements Thread.UncaughtExceptionHandler {
    private Thread.UncaughtExceptionHandler defaultHandler;
    
    public GlobalExceptionHandler() {
        defaultHandler = Thread.getDefaultUncaughtExceptionHandler();
    }
    
    @Override
    public void uncaughtException(Thread thread, Throwable ex) {
        // Логирование исключения
        logException(ex);
        
        // Превращаем любое исключение в фатальное
        // Вместо восстановления - завершаем приложение
        android.os.Process.killProcess(
            android.os.Process.myPid()
        );
        System.exit(1);
    }
}
```

---

## 🔐 Система Лицензирования

### 1. Структура Лицензии

```json
{
  "user": "username",
  "expiration": 1739836800,
  "hwid": "device_fingerprint",
  "features": ["feature1", "feature2"],
  "reseller": "reseller_id",
  "signature": "RSA_signature"
}
```

### 2. Процесс Валидации

```
┌─────────────────┐
│ Проверка файла  │
│   (access())     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Расшифровка    │
│    (AES-256)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Проверка подпи- │
│   си (RSA)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Проверка срока │
│    действия     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Проверка HWID  │
│   (устройство)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   SHA-256       │
│   checksum      │
└─────────────────┘
```

### 3. Безопасное Хранение Ключей

```cpp
// Пример встраивания ключей в нативную библиотеку
const unsigned char AES_KEY[32] = {
    0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
    0x88, 0x99, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF,
    0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
    0x88, 0x99, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF
};

// RSA Public Key (PEM format embedded)
const char RSA_PUBLIC_KEY[] = 
    "-----BEGIN PUBLIC KEY-----\n"
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...\n"
    "-----END PUBLIC KEY-----\n";
```

---

## 🛡️ Рекомендации по Защите

### Для Разработчиков

#### 1. Используйте Несколько Уровней Защиты

```java
public class LicenseChecker {
    private NativeLib nativeLib;
    private SignatureVerifier signatureVerifier;
    private BackgroundValidator backgroundValidator;
    
    public boolean validate() {
        // Все проверки должны пройти
        return nativeLib.checkLicense() &&
               signatureVerifier.verify() &&
               backgroundValidator.isValid();
    }
}
```

#### 2. Интегрируйтесь с Android Lifecycle

```java
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Ранняя проверка
        if (!LicenseManager.getInstance().isValid()) {
            finish();
            System.exit(0);
        }
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        
        // Проверка при каждом возврате к приложению
        LicenseManager.getInstance().verify();
    }
}
```

#### 3. Обфусцируйте Защитный Код

```groovy
// proguard-rules.pro
-keep class com.protection.** { *; }
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

// Переименование классов
-rename obfuscation.mapping.txt
```

#### 4. Используйте Root Detection

```java
public class RootDetector {
    public static boolean isDeviceRooted() {
        String[] paths = {
            "/system/app/Superuser.apk",
            "/sbin/su",
            "/system/bin/su",
            "/system/xbin/su",
            "/data/local/xbin/su",
            "/data/local/bin/su",
            "/system/sd/xbin/su",
            "/system/bin/failsafe/su",
            "/data/local/su",
            "/su/bin/su"
        };
        
        for (String path : paths) {
            if (new File(path).exists()) {
                return true;
            }
        }
        
        // Проверка через Permissions
        Process process;
        try {
            process = Runtime.getRuntime().exec("su -c id");
            BufferedReader in = new BufferedReader(
                new InputStreamReader(process.getInputStream())
            );
            String output = in.readLine();
            return output != null && output.contains("uid=0");
        } catch (Exception e) {
            return false;
        }
    }
}
```

#### 5. Детекция Отладки

```java
public class DebugDetector {
    public static boolean isDebuggable(Context context) {
        return (context.getApplicationInfo().flags & 
                ApplicationInfo.FLAG_DEBUGGABLE) != 0;
    }
    
    public static boolean isTracerPidPresent() {
        String tracePid = readFile("/proc/self/status", "TracerPid");
        return tracePid != null && !tracePid.trim().equals("0");
    }
    
    private static String readFile(String file, String key) {
        try {
            BufferedReader br = new BufferedReader(
                new FileReader(file)
            );
            String line;
            while ((line = br.readLine()) != null) {
                if (line.startsWith(key)) {
                    return line.split("\\s+")[1];
                }
            }
        } catch (Exception e) {
            // Ignore
        }
        return null;
    }
}
```

---

## 🔍 Методы Анализа Защиты

### Инструменты для Исследователей

#### 1. Статический Анализ

```bash
# Распаковка APK
unzip -q app.apk -d app_analysis/

# Просмотр структуры
tree app_analysis/

# Поиск строк в нативных библиотеках
strings lib/arm64-v8a/lib*.so | grep -E "(Key|license|check)"

# Анализ символов
nm -D lib/arm64-v8a/lib*.so

# Дизассемблирование
objdump -d lib/arm64-v8a/lib*.so > disasm.txt
```

#### 2. Динамический Анализ

```bash
# Запуск с отладкой
adb shell am start -D -n com.app/.MainActivity

# Перехват системных вызовов
strace -p <pid> -o strace.log

# Трассировка JNI
frida -U -f com.app -l jni_trace.js

# Мониторинг файлов
adb shell "inotifywait -m /data/data/com.app/"
```

#### 3. Декомпиляция

```bash
# DEX в JAR
d2j-dex2jar.sh classes.dex -o classes.jar

# Декомпиляция Java
jadx -d output app.apk

# Просмотр DEX
dexdump -d classes.dex
```

---

## 📊 Оценка Сложности Обхода

| Техника Защиты | Сложность | Инструменты |
|----------------|-----------|------------|
| Java проверки | ⭐⭐☆☆☆ | JADX, Jadx-GUI |
| Нативные проверки | ⭐⭐⭐⭐☆ | Ghidra, IDA Pro |
| Kernel-level kill | ⭐⭐⭐⭐⭐ | ARM64 assembly knowledge |
| Обфусцированные библиотеки | ⭐⭐⭐⭐⭐ | Static analysis |
| Криптографическая защита | ⭐⭐⭐⭐⭐ | Crypto analysis |

---

## ⚖️ Правовые Аспекты

> **Важно:** Изучение систем защиты должно использоваться ответственно.

### Легально ✅
- Защита собственных приложений
- Академические исследования
- Тестирование безопасности с разрешением
- Образовательные цели

### Нелегально ❌
- Обход защиты чужих приложений
- Создание крэков и генераторов ключей
- Пиратство программного обеспечения
- Нарушение авторских прав

---

## 📝 Выводы

Изучение систем защиты Android-приложений включает:

1. **Многоуровневая архитектура** — эффективная защита требует несколько уровней
2. **Kernel-level механизмы** — системные вызовы наиболее надёжны
3. **Обфусцирование** — затрудняет reverse engineering
4. **Интеграция с Android** — проверки в жизненном цикле приложения
5. **Криптография** — защита лицензий с помощью современных алгоритмов

---

## 🔗 Полезные Ресурсы

- [Android Security Documentation](https://source.android.com/security)
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [Ghidra Software Reverse Engineering](https://ghidra-sre.org/)
- [Android Developer Guide - Security](https://developer.android.com/guide/topics/security)

---

**Дата создания:** Февраль 2026  
**Версия:** 1.0  
**Тип:** Образовательный документ

