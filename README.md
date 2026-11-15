<div align="center">

# ARTNH · 个人博客主网

### 把空间，渲成风格。

一个**零构建**的纯静态个人博客 · 亮色手绘撞色 · 会呼吸的界面

记录 Blender 风格化 NPR / 三渲二、Auto-Rig Pro 绑骨实验、材质笔记与每日审美采集。

</div>

---

## ✦ 这是什么

`artnh.cn` 的个人主站。它不是模板，也不是框架生成物 —— 整站只有**一个 HTML、一份主题 CSS、一份文章数据**，双击 `index.html` 就能跑，不需要 Node、不需要打包、不需要联网（字体除外）。

视觉上走「漫画跨页」路线：奶油纸底、电光蓝 × 亮黄 × 珊瑚粉撞色、粗黑描边与硬偏移阴影、手绘不规则图形、大量留白。**手绘只作用于图形与插画，所有文字保持清晰的无衬线字体。**

## 🎨 特性一览

| 板块 | 做了什么 |
|---|---|
| 手绘视觉 | 四角各异的不规则圆角、双笔触描边、SVG 笔触抖动、贴纸式倾斜卡片、手绘波浪分隔线 |
| 动态表现 | 星球轨道 / 呼吸 / 公转、流动手绘虚线、满幅动态波纹、涂鸦独立轨迹、滚动入场、鼠标视差 |
| 文章系统 | 首页只露 4 篇精选，展开后给全部；分类筛选、全文搜索、时间排序；hash 路由阅读层 |
| 独立封面 | 6 套手绘 SVG 图案 × 按 slug 派生的镜像 / 旋转 / 点缀，每篇封面都不重样 |
| 交互彩蛋 | 点击迸发彩色星点 + 手绘贝塞尔样条线；`#404` 或右上角 Wander 唤起亮色翻牌彩蛋 |
| 主题可退 | 移除 `theme.css` 的 `<link>` 一行，即回到上一版深空暗色主题 |
| 响应式 | 桌面 / 平板 / 390px 移动端实测零横向溢出，`prefers-reduced-motion` 自动降级 |

## 🧱 技术栈

| 项 | 选择 |
|---|---|
| 结构 / 样式 / 逻辑 | 原生 HTML + CSS + JavaScript，无框架、无构建、无依赖 |
| 文章数据 | `posts.js` 挂全局变量，`<script>` 直接加载 |
| 字体 | Google Fonts：Baloo 2 / Nunito / Inter / Syncopate |
| 图形 | 内联 SVG + CSS 形状，零图片依赖（除一张可选星空图） |
| 部署 | 任意静态托管 / GitHub Pages / 直接双击本地文件 |

> **为什么文章数据用 `.js` 而不是 `.json`**：`file://` 协议下 `fetch()` 读本地 JSON 会被 CORS 拦截，而 `<script>` 标签不受限制 —— 这样双击打开也完整可用。

## 📁 文件结构

| 文件 | 作用 |
|---|---|
| `index.html` | 页面结构、内联暗色底稿样式、Canvas 星尘、博客渲染引擎、路由与交互 |
| `theme.css` | **现行亮色手绘主题**（后置于内联样式，同名规则覆盖） |
| `posts.js` | `BLOG_META`（栏目 / 色板 / 精选 / 外链）与 `BLOG_POSTS`（全部文章） |
| `favicon.svg` | 亮黄手绘贴纸标：亮黄底 + 电光蓝 A + 粉星 + 薄荷点 |
| `404.html` | 服务器死链重定向到 `index.html#404` |
| `1000104636.jpg` | 门扉彩蛋「带张星空走」的原图 |
| `Markdown_Notes/` | 历次设计与排查归档 |
| `README.md` | 本文件 · 项目介绍 |
| `PUSH_GUIDE.md` | 完整推送 / 覆盖 / 回滚说明与变更台账 |
| `CODE_OF_CONDUCT.md` | 社区行为准则 |
| `CONTRIBUTING.md` | 贡献指南（项目约定 / 加文章 / 命名规则 / PR 流程） |
| `LICENSE` | MIT 代码许可（内容版权说明见文末） |

## 🚀 快速开始

**方式一：直接双击** `index.html`。

**方式二：本地静态服务**（推荐，可完整验证路由与下载）：

```bash
python -m http.server 8000
# 打开 http://127.0.0.1:8000
```

## ✍️ 写新文章

编辑 `posts.js`，复制 `window.BLOG_POSTS` 里任意一个对象，改以下字段即可，页面会自动出现在网格 / 筛选 / 搜索里：

| 字段 | 说明 |
|---|---|
| `slug` | 唯一英文标识，用于 `#post/<slug>` 路由 |
| `title` / `subtitle` | 标题 / 副标题 |
| `date` | `YYYY-MM-DD`，决定排序 |
| `category` | 只能是 `BLOG_META.categories` 里的 id：`works` / `notes` / `tutorials` / `inspiration` / `lab` |
| `tags` / `excerpt` / `readTime` | 标签数组 / 摘要 / 阅读时长 |
| `content` | 正文 HTML，支持 `h2 / p / ul / blockquote / code / pre` |

`BLOG_META.picked` 决定首页默认露出的 4 篇，建议四个不同分类各选一篇，撞色才明显。

## 🧭 路由与彩蛋

| Hash | 页面 |
|---|---|
| 空 / `#home` | 首页（精选 4 篇） |
| `#category/<id>` | 自动展开该分类全部文章 |
| `#post/<slug>` | 文章阅读层 |
| `#about` | 关于区块 |
| `#404` / `#wander` | 亮色翻牌彩蛋 |

## 🎨 设计来源

视觉方向来自对真实个人站点的拆解：Jack McDade（三色系统与波浪分隔）、Karl Gonsalves（平涂撞色与 no UI density）、StealThis.dev 插画式 Portfolio（硬阴影与贴纸卡配方）、Antoniouve（巨标题与弹性动效）、Jonas Mosesson（每项一色）、Hedof / Rafael Varona（克制容器装吵内容），以及 60-30-10 配色与留白原则。

## 📄 社区规范与许可

| 文件 | 用途 |
|---|---|
| `README.md` | 项目介绍（本文件） |
| [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) | 行为准则 · 让讨论保持友好 |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | 贡献指南 · 项目约定、加文章、命名规则、PR 流程 |
| [`LICENSE`](LICENSE) | 代码按 MIT 授权 |

**代码开源，内容保留版权**：`index.html` / `theme.css` / `posts.js` 等代码按 MIT 授权；站内的**文章文字、手绘插画、封面图案与图片素材**不在 MIT 范围内，版权归作者所有，未经许可请勿转载或商用。`1000104636.jpg` 为 NASA 生日星空图，用于门扉彩蛋「带张星空走」。

动手改站点前请先读一遍 `CONTRIBUTING.md` 的「项目约定」—— 尤其是「手绘只作用于图形与插画、不改文字字体」和「不引入框架与构建工具」。

## 🔗 链接

- 仓库：https://github.com/ArtNh/artnh.cn
- 作品集：https://www.artnh.cn
- 作品档案馆：https://art.artnh.cn/
- GitHub：https://github.com/ArtNh

---

© 2026 ARTNH · CUI JIN-LIN · 代码 MIT / 内容版权保留
