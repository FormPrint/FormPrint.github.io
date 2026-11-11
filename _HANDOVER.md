# 交接文件（兩台電腦輪流使用）

> 檔名以 `_` 開頭，GitHub Pages（Jekyll）不會發佈到網站上。但 repo 本身是公開的，**不要在這裡寫密碼、金鑰或個人資料**。

## ⚠ 待辦：另一台電腦（公司）第一次 pull 後要做

做完後把下面的勾勾打上，再 commit 並 push。

- [ ] **1. 檢查 `~/.ssh/config` 開頭有沒有 BOM**
  ```bash
  head -c 3 ~/.ssh/config | od -c
  ```
  如果輸出是 `357 273 277`，表示有 BOM，請改用 VS Code 打開，存成 `UTF-8`（不是 `UTF-8 with BOM`）。
- [ ] **2. 確認 config 裡有 `Host github-account2`**，內容請照下面的「SSH 設定」一節。
- [ ] **3. 確認金鑰檔案存在：** `~/.ssh/id_rsa_account2`
- [ ] **4. 測試連線：** `ssh -T git@github-account2`，看到 `Hi FormPrint!` 就代表正常。
- [ ] **5. 檢查儲存庫：** `git fsck --no-dangling`，沒有輸出就代表正常。有錯誤請照「儲存庫損壞時的修復方法」一節處理。

## 每次換電腦的固定流程

開始工作前：

```bash
git pull
```

結束工作時：

```bash
git add -A
git commit -m "說明"
git push
```

一定要先 `pull` 再動手，否則兩台電腦的提交會分岔。

## 遠端設定

| 遠端名稱 | 網址 | 用途 |
|---|---|---|
| `origin` | `git@github-account2:FormPrint/FormPrint.github.io.git` | 平常 push/pull 用這個 |
| `FormPrint` | `git@github.com:FormPrint/FormPrint.github.io.git` | 備用，使用預設金鑰 |

`github-account2` 不是真正的主機名稱，而是在 `~/.ssh/config` 裡定義的別名。**兩台電腦都必須有這個設定**，否則會出現：

```
ssh: Could not resolve hostname github-account2: Name or service not known
```

## SSH 設定（每台電腦各自設定一次）

`~/.ssh/config`（Windows 路徑：`C:\Users\<使用者>\.ssh\config`）：

```
# GitHub account 1
Host github-account1
   HostName github.com
   User git
   IdentityFile ~/.ssh/id_rsa_account1

# GitHub account 2
Host github-account2
   HostName github.com
   User git
   IdentityFile ~/.ssh/id_rsa_account2
```

需要的金鑰檔案：`~/.ssh/id_rsa_account2` 和 `id_rsa_account2.pub`。這組金鑰對應 GitHub 帳號 FormPrint。

測試連線：

```bash
ssh -T git@github-account2
# 成功會顯示：Hi FormPrint! You've successfully authenticated...
```

### 注意事項

- **不要用記事本編輯 `config`。** 記事本可能存成「UTF-8 with BOM」，ssh 會報錯：
  ```
  /c/Users/admin/.ssh/config: line 1: Bad configuration option: \357\273\277#
  ```
  請改用 VS Code，並確認右下角的編碼是 `UTF-8`（不是 `UTF-8 with BOM`）。
- `IdentityFile` 路徑請用 `/`，不要用 `\`。
- 註解建議用英文，中文容易因為編碼問題變成亂碼。

## 儲存庫損壞時的修復方法

如果 commit 或 push 時出現：

```
error: corrupt loose object '<hash>'
fatal: loose object <hash> ... is corrupt
```

表示本機的 `.git` 有檔案損壞，通常是磁碟或同步造成的。只要 GitHub 上的資料還是好的，就可以照下面的步驟修復：

```bash
# 1. 找出所有損壞的物件
git fsck --no-dangling

# 2. 將損壞的檔案移走（每個 hash 都做一次；前 2 碼是資料夾名稱）
mkdir -p /tmp/bad && mv .git/objects/97/883289e7... /tmp/bad/

# 3. 從 GitHub 下載一份乾淨的複本（放在 repo 外面）
git clone --bare git@github-account2:FormPrint/FormPrint.github.io.git /tmp/fresh.git

# 4. 從乾淨的複本把物件寫回來（每個 hash 都做一次）
git --git-dir=/tmp/fresh.git cat-file blob <hash> | git hash-object -w --stdin

# 5. 再檢查一次，沒有輸出就代表正常
git fsck --no-dangling

# 6. 刪除暫存檔
rm -rf /tmp/fresh.git /tmp/bad
```

建議偶爾執行一次 `git fsck --no-dangling`，及早發現問題。

## 事件紀錄

### 2026-11-12（家裡的電腦）

- **現象：** `git push` 失敗，`git commit` 時出現 corrupt loose object 錯誤。
- **原因一：** `~/.ssh/config` 開頭有 BOM，ssh 無法讀取。
- **處理：** 重寫成不含 BOM 的 UTF-8，路徑改成 `/`。
- **原因二：** `.git` 裡有 7 個舊的 blob 損壞，不影響目前的檔案。
- **處理：** 用上面的流程從 GitHub 還原，`git fsck` 已經正常。
- **結果：** 提交 `000f74f` 已經 push 成功。
- **待辦：** 另一台電腦的 `~/.ssh/config` 也要確認沒有 BOM，並且有 `github-account2` 這個別名。
