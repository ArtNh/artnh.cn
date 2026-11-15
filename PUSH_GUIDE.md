# 推送说明 · ARTNH 个人博客主网

> 记录 2026-11-16 用本地亮色手绘版覆盖 `ArtNh/artnh.cn` 的完整流程、覆盖策略、备份与回滚方式，
> 以及之后的日常更新规范。本文与 `README.md` 一起随仓库发布。

---

## 一、本次覆盖概览

| 项 | 内容 |
|---|---|
| 目标仓库 | https://github.com/ArtNh/artnh.cn |
| 默认分支 | `main` |
| 覆盖前远程 HEAD | `99d8dfecd6ae0cd4b56c45f76bf13952d986382f` |
| 覆盖前最后一次推送 | 2026-06-11 05:09 UTC |
| 覆盖前远程文件 | 9 个（旧版导航页、favicon、404、星空图、4 份归档、`.vscode` 配置） |
| 覆盖策略 | 建立新的本地历史 → `--force-with-lease` 覆盖远程 `main`，**不做合并** |
| 远程快照备份 | 项目外 `WorkBuddySpace/artnh.cn-remote-backup-20260611-99d8dfe/`（含 `_BACKUP_INFO.json`） |

### 覆盖前后文件对照

| 文件 | 变化 |
|---|---|
| `index.html` | 重写：极简导航页 → 个人博客主网（含渲染引擎、路由、彩蛋） |
| `theme.css` | 🆕 亮色手绘撞色主题（后置覆盖内联暗色底稿） |
| `posts.js` | 🆕 文章数据层，10 篇 / 6 栏目 |
| `favicon.svg` | 换成亮黄手绘贴纸标 |
| `README.md` / `PUSH_GUIDE.md` / `.gitignore` / `.gitattributes` | 🆕 项目介绍 / 本说明 / 忽略与换行规则 |
| `404.html` / `1000104636.jpg` | 保持不变 |
| `Markdown_Notes/` | 保留，旧机器路径已做迁移映射 |
| `.vscode/launch.json` | ⛔ 不再纳入版本控制（本机专属配置） |
| `.workbuddy/` | ⛔ 永不推送（本地工作记忆，含个人环境信息） |

---

## 二、前置条件

| 条件 | 检查命令 | 本次环境 |
|---|---|---|
| Git | `git --version` | ✅ 2.55.0 |
| 提交身份 | `git config user.name` | 用仓库级配置即可，不必改全局 |
| GitHub 认证 | `gh auth status` / 凭据管理器 / PAT | ⚠️ 见第六节 |
| 网络 | `git ls-remote origin` | ⚠️ 见第六节 |
| 远程备份 | 已完成 | ✅ 9 个文件 |

---

## 三、完整推送命令序列（可复现）

```bash
# 0) 进入项目目录
cd <项目目录>

# 1) 初始化（原本只是解压目录，不是仓库）
git init -b main

# 2) 仓库级身份（不影响全局配置）
git config user.name  "ArtNh"
git config user.email "<GitHub 账号邮箱或 noreply 邮箱>"

# 3) 绑定远程并取回 ref（供 force-with-lease 校验）
git remote add origin https://github.com/ArtNh/artnh.cn.git
git fetch origin main

# 4) 提交本地全部内容（.gitignore 会排除 .workbuddy/ 与 .vscode/）
git add -A
git status
git commit -m "feat: 重构为亮色手绘撞色个人博客主网"

# 5) 安全覆盖（不是 --force）
git push --force-with-lease origin main:main

# 6) 验证
git ls-remote --heads origin
```

> **为什么是 `--force-with-lease` 而不是 `--force`**
> 它会先比对远程 `main` 是否仍等于第 3 步 `fetch` 到的 SHA。若期间有别人推过新提交，
> 推送会被拒绝，而不是悄悄抹掉对方的工作；`--force` 则是无条件覆盖。
>
> 若 `git fetch` 因网络不通拿不到 ref，可改用**显式 lease**（SHA 见第一节）：
> ```bash
> git push --force-with-lease=main:99d8dfecd6ae0cd4b56c45f76bf13952d986382f origin main:main
> ```

---

## 四、回滚到覆盖前

按推荐顺序：

1. **用备份目录**（最直观）
   把 `artnh.cn-remote-backup-20260611-99d8dfe/` 里的 9 个文件复制回项目 → `git add -A && git commit && git push`。

2. **用旧 commit 新建分支**（保留新历史）
   ```bash
   git fetch origin 99d8dfecd6ae0cd4b56c45f76bf13952d986382f
   git branch legacy-20260611 99d8dfecd6ae0cd4b56c45f76bf13952d986382f
   git push origin legacy-20260611
   ```
   > force push 后旧 commit 会成为悬空对象，GitHub 通常仍保留一段时间；
   > **备份目录才是确定性回滚依据**。

3. **GitHub 网页端**：仓库 → Commits，找到旧 SHA 后新建分支或 Revert。

---

## 五、日常更新流程

```bash
# 写新文章：只改 posts.js
# 改样式：只改 theme.css
# 改结构 / 交互：改 index.html

git add -A
git commit -m "posts: 新增〈文章标题〉"
git push origin main          # 之后都是普通推送，不要再 force
```

**规范**

- 每次提交只做一类改动，便于回滚。
- `posts.js` 里 `slug` 必须唯一；`category` 必须是 `BLOG_META.categories` 里已有的 id。
- 改 `favicon.svg` 后，同步把 `index.html` 里 `favicon.svg?v=N` 的版本号 +1，否则浏览器用缓存。
- 不要把 token、密码、本机用户目录的绝对路径写进仓库文件。

---

## 六、本次环境的两个限制

### 1. 认证未配置

本机没有 GitHub CLI、没有 SSH key、没有凭据管理器条目、也没有 `GITHUB_TOKEN`。
**推送必须由仓库所有者完成一次认证**，二选一：

- **A. 标准 git 通道**：在能联网的终端执行第三节命令，Git Credential Manager 会弹出浏览器登录；
  或使用 Personal Access Token 作为密码（token 需 `repo` 权限）。
- **B. API 通道**：若 `github.com:443` 仍不通但 `api.github.com` 可用，可用
  GitHub Git Data API 建 blob → tree → commit → `PATCH /git/refs/heads/main` 完成等价覆盖。

### 2. 网络：github.com 主站不通

本机代理对 `github.com:443` 的 CONNECT 返回 `502` / Schannel 中断，但 `api.github.com` 正常
（本次远程信息读取与旧版备份都走 API 完成）。直连超时，常见本地代理端口均不可用。
换网络环境或在代理里放行 `github.com` 后，`git push` 即可恢复。

---

## 七、常见坑速查

| 现象 | 原因 / 处理 |
|---|---|
| 双击 `index.html` 文章不显示 | `posts.js` 用 `<script>` 加载是对的；改成 `fetch + .json` 会被 `file://` 的 CORS 拦 |
| 本地服务下 SVG 图标破图 | `python -m http.server`（Py 3.13）对 `.svg` 返回 `image/svg`；启动前 `mimetypes.add_type('image/svg+xml','.svg')` 或换服务器 |
| 改了样式没生效 | 主题层后置覆盖，检查 `theme.css` 的 `<link>` 是否还在；强刷缓存 |
| favicon 还是旧的 | bump `?v=` 版本号 |
| 推送被拒 non-fast-forward | 先 `git fetch` 再 `--force-with-lease`；确认没有协作者的新提交 |
| CRLF / LF 全文件变更 | 已加 `.gitattributes`：`* text=auto eol=lf` |
| 想回到暗色主题 | 删掉 `index.html` 里 `<link rel="stylesheet" href="theme.css?v=1" />` 一行 |

---

## 八、安全检查清单

- [x] `.workbuddy/`（本地工作记忆）已排除
- [x] `.vscode/`（本机路径配置）已排除
- [x] 覆盖前远程内容已完整备份
- [x] 回滚锚点 SHA 已记录
- [x] 仓库文案不含 token、密码、本机用户目录绝对路径
