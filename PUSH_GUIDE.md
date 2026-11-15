# 推送与变更说明 · ARTNH 个人博客主网

> 本次为**跨六轮迭代的大版本重构**：从 2026-06-11 的「极简导航页 + 深空 404 门扉」，
> 重构为「个人博客主网 · 亮色手绘撞色」。本文是完整变更档案、推送 / 覆盖说明与运维手册。
> 设计叙事与逐轮细节另见 [`Markdown_Notes/[重构亮色手绘撞色个人博客主网_20261116_012702.md]`](Markdown_Notes/%5B重构亮色手绘撞色个人博客主网_20261116_012702.md)。

---

## 目录

一、版本总览 · 二、变更清单（沿用历史记录格式） · 三、逐文件变更明细 · 四、六轮迭代详述 ·
五、架构与技术决策 · 六、视觉与动效清单 · 七、验收数据 · 八、推送与覆盖 · 九、回滚 ·
十、部署、命名规则与日常更新 · 十一、常见坑速查 · 十二、安全检查清单 · 附录：命令速查

---

## 一、版本总览

| 维度 | 覆盖前（`99d8dfe`，2026-06-11） | 覆盖后（`436dcff`，2026-11-16） |
|---|---|---|
| 站点形态 | 极简导航页：1 个标题 + 1 段简介 + 3 条外链 | 个人博客主网：首页 / 档案 / 阅读层 / 关于 |
| 首屏 | **强制**全屏 404 门扉，需点「返回地球」才进站 | 亮色 Hero，门扉降级为 Wander 彩蛋与 `#404` 死链 |
| 视觉 | 暗冷深空 `#0c0d0f` + 沙金，玻璃拟态 | 奶油纸 `#FFF8EC` + 电光蓝 / 亮黄 / 珊瑚粉撞色，手绘图形 |
| 文章 | 无 | 10 篇 / 6 栏目 / 首页 4 篇精选，可展开全部 |
| `index.html` | 49 KB / 1445 行 | 105 KB / 约 2200 行 |
| 样式 | 单文件内联 | 新增 `theme.css` 后置覆盖，暗色底稿保留可回退 |
| 文件数 | 9 | 14（补档后 15；社区规范补齐后 18） |
| 仓库首页 | 无 README、无 description | README + 描述 + 本说明 |
| 构建 | 零构建 | 零构建（保持） |
| 部署 | — | Vercel 已基于 `436dcff` 部署到 Production |

---

## 二、变更清单（沿用历史记录格式）

> 格式沿用 `Markdown_Notes/walkthrough.md` 的
> `* **[YYYY-MM-DD HH:MM:SS]** 【改动文件】描述`。

* **[2026-11-15 22:17:00]** 【.vscode/launch.json, Markdown_Notes/implementation_plan.md, Markdown_Notes/walkthrough.md, Markdown_Notes/[修复MCP_Fetch服务报错_20260611_130420.md]】旧机器路径迁移映射，改用 `${workspaceFolder}`，归档文档加迁移注记
* **[2026-11-15 22:21:00]** 【index.html, posts.js】重构为个人博客主网；新增文章数据层、三态 hash 路由、阅读层；门扉降级为彩蛋
* **[2026-11-15 23:09:00]** 【theme.css, index.html, posts.js】案例研究后改为亮色动漫撞色 Comic Pop 方向；首屏只露 4 篇精选
* **[2026-11-15 23:45:00]** 【index.html, theme.css】动效可见化、门扉亮色换皮与性能根治、四个涂鸦独立轨迹、回到顶部修复、全局点击迸发
* **[2026-11-16 00:14:00]** 【index.html, theme.css】手绘涂鸦版：流动手绘虚线、满幅动态波纹、10 张独立手绘封面、点击贝塞尔样条线
* **[2026-11-16 00:31:00]** 【theme.css, index.html】撤回文字手写字体，恢复全部文字为 Baloo 2 / Nunito
* **[2026-11-16 00:38:00]** 【favicon.svg, index.html】更换亮黄手绘贴纸标，根元素明确 64×64，引用 bump `?v=2`
* **[2026-11-16 00:53:00]** 【README.md, PUSH_GUIDE.md, .gitignore, .gitattributes】项目介绍、推送说明、忽略规则与换行规则
* **[2026-11-16 01:05:52]** 【本地仓库】`3cf7e17` 首次提交：14 文件 / 4114 行
* **[2026-11-16 01:16:22]** 【远程仓库】`436dcff` 经 Git Data API 完整覆盖 `main`
* **[2026-11-16 01:27:02]** 【PUSH_GUIDE.md, Markdown_Notes/】补充大版本详细变更档案与按以往规则命名的归档手记

---

## 三、逐文件变更明细

| 文件 | 覆盖前 | 覆盖后 | 说明 |
|---|---|---|---|
| `index.html` | 49 KB / 1445 行 | 105 KB / 约 2200 行 | 完全重写页面结构；保留原门扉与 Canvas 代码，追加博客 DOM、BLOG ENGINE、三态路由、视差与点击迸发 |
| `theme.css` | 不存在 | 🆕 约 42 KB | 亮色手绘主题，后置于内联 `<style>` 覆盖同名规则；含手绘体系、动效、波纹、封面、点击样条线 |
| `posts.js` | 不存在 | 🆕 约 20 KB | `BLOG_META`（栏目 / 撞色板 / 精选 / 外链）与 `BLOG_POSTS`（10 篇正文 HTML） |
| `README.md` | 不存在 | 🆕 | 仓库首页介绍：定位、特性、技术栈、文件结构、快速开始、写文章、路由、设计来源 |
| `PUSH_GUIDE.md` | 不存在 | 🆕 | 本文件（本文为详细扩充版） |
| `.gitignore` | 不存在 | 🆕 | 排除 `.workbuddy/`、`.vscode/` 与系统临时文件 |
| `.gitattributes` | 不存在 | 🆕 | `* text=auto eol=lf`，二进制资源不转换 |
| `favicon.svg` | 深空蓝渐变 A / 1.3 KB | 亮黄手绘贴纸 / 1.9 KB | 亮黄不规则底 + 粗黑描边 + 硬阴影 + 电光蓝 A + 粉星 + 薄荷点 |
| `404.html` | 15 行 | 不变 | 仍重定向到 `index.html#404` |
| `1000104636.jpg` | 357 KB | 不变 | 门扉彩蛋「带张星空走」原图 |
| `Markdown_Notes/*.md` | 4 份 | 4 份 + 1 份新归档 | 旧文档保留并做路径迁移映射；新增 `[重构亮色手绘撞色个人博客主网_20261116_012702.md]` |
| `.vscode/launch.json` | 已跟踪 | ⛔ 移除 | 本机专属配置，改由 `.gitignore` 排除 |
| `.workbuddy/` | 不在远程 | ⛔ 永不推送 | 本地工作记忆，含个人环境信息 |

---

## 四、六轮迭代详述

### 第 1 轮 · 路径迁移（22:17）
旧环境 `d:\ZZZ` + `C:/Users/AAA` 迁到新工作区。`.vscode/launch.json` 改用 `${workspaceFolder}/index.html`；
`implementation_plan.md` 死链改 `../404.html`；历史归档加迁移注记；`walkthrough.md` 的 4 份实测素材
未随项目迁移，链接改到 `Markdown_Notes/assets/`（按同名放图即可恢复）。

### 第 2 轮 · 博客主网（22:21）
方向确认：门扉降级为彩蛋 / 零构建静态 / 风格化。新增 `posts.js`，`index.html` 扩为
Header / Hero / 筛选搜索 / 卡片网格 / 关于 / 阅读层，并实现
`#home` / `#category/<id>` / `#post/<slug>` / `#404` 路由。数据层用 `.js` 而非 `.json`，
规避 `file://` 下 `fetch` 的 CORS 限制。

### 第 3 轮 · 亮色动漫撞色（23:09）
用户指出旧版「暗调、直角矩形、把所有东西全拿出来缺少创意」。先检索 8 组真实案例
（Jack McDade / Karl Gonsalves / StealThis.dev / Antoniouve / Jonas Mosesson / Hedof / Varona /
Muffin Group / Oono Taro），提炼 60-30-10、硬阴影、贴纸卡、留白与静态色带平衡 motion 等原则，
再新增 `theme.css` 换皮。首屏改为只露 4 篇精选，展开后才给工具与全部文章。

### 第 4 轮 · 动效与彩蛋换皮（23:45）
CDP 诊断确认动画全在 `running`，真因是周期太长（公转 15s、呼吸 5.5s 只挪 7px）；
缩短周期并放大振幅。门扉从暗色宇宙改为亮色漫画风，停用 Canvas 星尘循环与全屏
`backdrop-filter: blur(25px)` 根治卡顿。四个涂鸦改四条独立轨迹；修「回到顶部」；
新增点击星点 + 圆环。

### 第 5 轮 · 手绘涂鸦版（00:14）
加入不规则圆角、双笔触描边、SVG 笔触抖动、流动手绘虚线、满幅动态波纹、
6 套基础图案 × slug 派生变体的独立封面、点击贝塞尔样条线。
随后按用户纠正撤回全部文字手写字体。

### 第 6 轮 · 图标与远程仓库（00:38 ~ 01:27）
`favicon.svg` 换亮黄手绘贴纸标；补齐 README / 推送说明 / 忽略规则；
初始化 git、备份远程旧版 9 文件、完成覆盖推送、设置仓库描述；
最后按以往命名规则补充本详细档案与归档手记。

---

## 五、架构与技术决策

| 决策 | 原因 | 代价 / 回退 |
|---|---|---|
| `posts.js` 挂全局变量，不用 `posts.json` | `file://` 下 `fetch` 本地 JSON 被 CORS 拦 | 部署到 HTTP 后可改回 JSON |
| `theme.css` 后置覆盖内联样式 | 保留暗色底稿，主题可一键切换 | 删除 `<link rel="stylesheet" href="theme.css?v=1">` |
| 三态 hash 路由 | 零构建下不生成多份 HTML | — |
| 亮色主题停用 Canvas `animate()` | 180 粒子 + 每帧径向渐变是卡顿主因，视觉仅 9% 透明度 | 移除 theme.css 的 `<link>` 自动恢复 |
| SVG 抖动滤镜只给静态图形 | 动画元素加 `feTurbulence` 会每帧重算导致卡顿 | — |
| 卡片入场用 `backwards` 且不带 `opacity:0` | 避免动画未推进时整卡隐身；结束后 transform 交还 CSS，hover 不被锁 | — |
| 首页精选 4 篇 + 展开 | 「不要把东西全摊出来」，建立阅读节奏 | `BLOG_META.picked` 可调整 |
| 覆盖推送用 lease 校验 | 避免抹掉他人期间的新提交 | 备份目录 + 旧 SHA |

---

## 六、视觉与动效清单

| 元素 | 手法 | 动效 / 参数 |
|---|---|---|
| Hero 星球 | 内联 SVG 分组 + 粗黑描边平涂 | 轨道 3.4s 摆动、星球 2.6s 呼吸、卫星 6.5s 公转、星芒 1.5s 闪烁 |
| 手绘涂鸦线 | `stroke-dasharray` 贝塞尔 | `scribbleFlow` 1.1s dash 流动 + 2.8s 上下起伏 |
| 满幅波纹 | 100vw SVG，4 层（紫底 / 蓝填充 / 黑描边 / 粉黄虚线） | `waveBob` 2.7~4.2s 不同相位 + `waveDash` 1s 流动 |
| 文章卡片 | 不规则圆角 + 3px 描边 + `7px 8px 0` 硬阴影 + 倾斜 | hover 回正上浮、点击果冻、滚动 stagger 入场 |
| 独立封面 | 6 套手绘 SVG × slug 派生镜像 / 旋转 / 点缀 | 静态 + SVG 笔触抖动滤镜 |
| 四个涂鸦 | 笑脸黄圆 / 粉星黄心 / 蓝色虚线环 / 薄荷菱形 | `doodleA~D` 四条不同轨迹 + 整层鼠标视差 |
| 点击 | 6 星点 + 扩散圆环 + 3 条贝塞尔样条线 | `pathLength=100` + dashoffset 绘制，0.9s 移除 |
| 门扉彩蛋 | 亮色纸底 + 黄/薄荷 blob + 白卡黑描边 | 纯 Y 轴 180° 翻牌 + 固定 -2deg 贴纸倾斜 |

---

## 七、验收数据

| 项目 | 结果 | 手段 |
|---|---|---|
| 真实 390px 视口 | `inner=390 / scrollW=390 / OVERFLOW=[]` | CDP `setDeviceMetricsOverride` |
| 桌面 1440 / 1000 | `scrollW === innerWidth`，波浪宽度 = 视口宽 | CDP |
| 动效 | 10 组 animation `running`，`orbDur=2.6s / trackDur=3.4s` | `getAnimations({subtree:true})` |
| 封面唯一性 | `covers=10 / uniqueCovers=10` | DOM innerHTML 去重 |
| 点击 | `sparks=6 / rings=1 / scribbles=1 / paths=3` | CDP 派发 pointerdown |
| 回到顶部 | `scrollY 700 → 0`，hash 不变 | CDP |
| 门扉性能 | `lightThemeOn=true / overlayBlur=none` | computed style |
| 文字字体 | 8 个文字元素首位均 `Baloo 2` | computed fontFamily |
| `file://` 双击 | 4 张精选卡 + 点击层 + 回到顶部全就位 | `--dump-dom` |
| favicon | 16 / 32 / 64 / 160px 浅底深底正常 | data-URI 多尺寸预览 |
| 远程一致性 | 14 文件逐字节一致，tree SHA 同为 `f124945…` | blob SHA 逐文件比对 |
| 安全 | `.workbuddy/` 未推送，远程 `.vscode/` 已移除 | 远程 tree 检查 |

---

## 八、推送与覆盖

### 8.1 完整命令序列（可复现）

```bash
cd <项目目录>
git init -b main
git config user.name  "Lovien"
git config user.email "<GitHub 邮箱或 noreply 邮箱>"
git remote add origin https://github.com/ArtNh/artnh.cn.git
git fetch origin main
git add -A
git commit -m "[feat(site): 重构为亮色手绘撞色个人博客主网 (2026-11-16 01:05:52)]"
git push --force-with-lease origin main:main
git ls-remote --heads origin
```

若 `git fetch` 因网络不通拿不到 ref，用**显式 lease**：
```bash
git push --force-with-lease=main:99d8dfecd6ae0cd4b56c45f76bf13952d986382f origin main:main
```

### 8.2 为什么不用 `--force`
`--force-with-lease` 会先比对远程 `main` 是否仍等于 fetch 到的 SHA；若期间有人推过新提交，
推送会被拒绝而不是悄悄抹掉。`--force` 无条件覆盖，风险高得多。
本次 API 通道同样先校验旧 SHA，且新 commit 以旧 HEAD 为 parent，属于 fast-forward。

### 8.3 通道对比与实际结果

| 通道 | 结果 |
|---|---|
| `git push` over `github.com:443` | ❌ GET（ls-remote / fetch）通，大 POST 被代理掐断：`OpenSSL SSL_read unexpected eof` / `CONNECT 502` |
| `api.github.com` Git Data API | ✅ 分包上传 14 个 blob → tree → commit → `PATCH /git/refs/heads/main` |

网络要点：切 `git -c http.version=HTTP/1.1 -c http.sslBackend=openssl` 可让 GET 恢复；
直连超时，多个常见本地代理端口均不可用。

| 实际结果 | 值 |
|---|---|
| 覆盖前 HEAD | `99d8dfecd6ae0cd4b56c45f76bf13952d986382f` |
| 覆盖后 HEAD | `436dcffb453a213b5c1c15d63e8f92376e5301ae` |
| tree | `f1249453545abefdd262fea1da5e11033b8aece1` |
| 推送时间 | 2026-11-15 17:16 UTC |
| 仓库描述 | 「ARTNH 的个人博客主网 · 零构建纯静态站点 · 亮色手绘撞色 / Blender NPR 与三渲二笔记」 |

---

## 九、回滚

1. **备份目录（确定性回滚）**
   项目外 `WorkBuddySpace/artnh.cn-remote-backup-20260611-99d8dfe/` 含覆盖前 9 个文件与
   `_BACKUP_INFO.json`。复制回项目 → `git add -A && git commit && git push`。

2. **旧 commit 建分支（保留新历史）**
   ```bash
   git fetch origin 99d8dfecd6ae0cd4b56c45f76bf13952d986382f
   git branch legacy-20260611 99d8dfecd6ae0cd4b56c45f76bf13952d986382f
   git push origin legacy-20260611
   ```
   > force / API 覆盖后旧 commit 可能成为悬空对象，备份目录才是确定性依据。

3. **GitHub 网页端**：Commits 找到旧 SHA → 新建分支或 Revert。

4. **Vercel Instant Rollback**：仓库已连接 Vercel 自动部署，可在 Deployments 面板
   一键回退到上一个 Production 部署，比回滚 git 更快恢复线上。

---

## 十、部署、命名规则与日常更新

### 10.1 命名规则（沿用以往）

**提交信息** —— 方括号 + `type(scope)` + 中文描述 + 末尾时间戳：
```
[type(scope): 中文描述 (YYYY-MM-DD HH:MM:SS)]
```
历史实例：
```
[docs(mcp): 追加工作区路径授权故障排查手记 (2026-06-11 13:09:50)]
[docs(mcp): 修复 fetch mcp 并归档手记 (2026-06-11 13:04:45)]
feat(links): 重排导航链接并设置新窗口打开且更新walkthrough时间戳 (2026-06-07 21:11:00)
```
本次应写作：`[feat(site): 重构为亮色手绘撞色个人博客主网 (2026-11-16 01:05:52)]`。

**归档文档** —— 放在 `Markdown_Notes/`，方括号 + 中文描述 + 紧凑时间戳：
```
[重构亮色手绘撞色个人博客主网_20261116_012702.md]
[修复MCP_Fetch服务报错_20260611_130420.md]
```

**文档内变更条目**：
```
* **[YYYY-MM-DD HH:MM:SS]** 【改动文件】描述
- **[x]** 校验结果
```

### 10.2 日常更新

```bash
# 写新文章：只改 posts.js；改样式只改 theme.css；改结构改 index.html
git add -A
git commit -m "[posts(site): 新增〈文章标题〉 (2026-11-16 10:30:00)]"
git push origin main          # 之后普通推送，不要再 force
```

- 每次提交只做一类改动，便于回滚。
- `posts.js` 的 `slug` 必须唯一，`category` 必须是 `BLOG_META.categories` 已有 id。
- 改 `favicon.svg` 后同步把 `index.html` 里 `favicon.svg?v=N` 版本号 +1。
- 本地 ref 若因网络落后于远程，先 `git fetch origin main && git reset --soft origin/main` 对齐。
- Vercel 会对每个 `main` 新提交自动部署，文档改动也会触发一次构建。

---

## 十一、常见坑速查

| 现象 | 原因 / 处理 |
|---|---|
| 双击 `index.html` 文章不显示 | `posts.js` 用 `<script>` 是对的；改 `fetch + .json` 会被 `file://` CORS 拦 |
| 本地服务下 SVG 图标破图 | `python -m http.server`（Py 3.13）对 `.svg` 返回 `image/svg`；启动前 `mimetypes.add_type('image/svg+xml','.svg')` |
| 动效「看着没动」 | 先用 CDP `getAnimations({subtree:true})` 确认 running，再缩短周期 / 放大振幅，别当 bug 修 |
| 无动效环境 blob 变直角矩形 | 有机形状必须有**静态 `border-radius` 兜底** |
| 卡片整张隐身 | 入场动画别用 `from{opacity:0}` + `backwards` |
| 改了样式没生效 | 主题层后置覆盖，检查 `theme.css` 的 `<link>`；强刷缓存 |
| favicon 还是旧的 | bump `?v=` 版本号 |
| git push 大 POST 被掐断 | 代理限制；切 HTTP/1.1，或改走 Git Data API 分包 |
| 推送被拒 non-fast-forward | 先 `git fetch` 再 `--force-with-lease` |
| CRLF / LF 全文件变更 | 已加 `.gitattributes`：`* text=auto eol=lf` |
| 想回到暗色主题 | 删掉 `index.html` 里 `<link rel="stylesheet" href="theme.css?v=1" />` 一行 |

---

## 十二、安全检查清单

- [x] `.workbuddy/`（本地工作记忆）已排除
- [x] `.vscode/`（本机路径配置）已排除
- [x] 覆盖前远程内容已完整备份
- [x] 回滚锚点 SHA 已记录
- [x] 仓库文案不含 token、密码、本机用户目录绝对路径
- [x] 推送用 PAT 只在命令进程环境变量中使用，未写入仓库 / `.git/config` / 日志
- [x] 推送完成后建议立即撤销该 PAT

---

## 附录：命令速查

```bash
# 本地预览（注意 SVG MIME）
python -c "import http.server,mimetypes,functools; mimetypes.add_type('image/svg+xml','.svg'); http.server.ThreadingHTTPServer(('127.0.0.1',8000), functools.partial(http.server.SimpleHTTPRequestHandler, directory='.')).serve_forever()"

# 代理受限时的 git 只读通道
git -c http.version=HTTP/1.1 -c http.sslBackend=openssl ls-remote --heads origin

# 显式 lease 覆盖
git push --force-with-lease=main:<旧SHA> origin main:main

# 本地与远程对齐
git fetch origin main && git reset --soft origin/main
```
