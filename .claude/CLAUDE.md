# 專案說明（給 Claude）

使用者會在兩台電腦（家裡、公司）之間輪流使用這個 repo，而且通常只會說「繼續」。

## 使用者說「繼續」或開始新工作時，依序做這些事

1. 執行 `git pull`。
   - 如果失敗訊息和 SSH 有關（例如 `Could not resolve hostname github-account2`，或 `Bad configuration option: \357\273\277`），請照 `_HANDOVER.md` 的「SSH 設定」一節修好再 pull。修改 `~/.ssh/config` 前要先備份。
2. 讀 `_HANDOVER.md`。
3. 如果最上方「⚠ 待辦」還有沒打勾的 `- [ ]` 項目，就逐項執行。
   - 每完成一項，就改成 `- [x]`，並在後面註明日期和是哪台電腦。
   - 如果是這台電腦不需要做的項目，也要註明原因。
4. 在 `_HANDOVER.md` 的「事件紀錄」補上這次做了什麼，然後 commit 並 push。
5. 用中文向使用者簡短報告結果。

## 注意事項

- 這個 repo 是公開的 GitHub Pages 網站（有自訂網域），不要 commit 密碼、金鑰或個人資料。
- 不要在 repo 根目錄新增一般的 `.md` 檔，否則會被發佈到網站上。要放就用 `_` 或 `.` 開頭的檔名。
- `.git` 約 2.5GB，commit 後 git 可能會在背景自動整理很久，這是正常的。
- 遠端名稱用 `origin`，透過 `git@github-account2:` 連線。
