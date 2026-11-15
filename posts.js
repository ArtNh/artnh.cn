/* ============================================================
 *  ARTNH · 博客文章数据层（零构建 / 零依赖）
 * ------------------------------------------------------------
 *  为什么是 .js 而不是 .json：
 *    双击 index.html 走的是 file:// 协议，fetch() 读本地 JSON 会被
 *    CORS 拦下；用 <script> 直接挂全局变量则完全不受限制。
 *
 *  加一篇新文章：复制下面任意一个对象，改 slug / date / category /
 *  tags / excerpt / content 即可，页面会自动出现在网格与筛选里。
 *  category 可选：works 作品 / notes 笔记 / tutorials 教程 /
 *                inspiration 素材 / lab 实验室
 *  featured: true 会让文章占两列大卡（建议同时最多 2 篇）。
 * ============================================================ */

window.BLOG_META = {
    brand: 'ARTNH',
    owner: '崔金林',
    ownerEn: 'CUI JIN-LIN',
    tagline: '空间设计师 · Blender NPR / 三渲二',
    /* 亮色撞色色板：与 theme.css 的 --blue/--pink/--violet/--mint/--orange 对应 */
    categories: [
        { id: 'all',         label: '全部',   en: 'ALL',         color: '#1B1830' },
        { id: 'works',       label: '作品',   en: 'WORKS',       color: '#FF5D8F' },
        { id: 'notes',       label: '笔记',   en: 'NOTES',       color: '#3B4EFF' },
        { id: 'tutorials',   label: '教程',   en: 'TUTORIALS',   color: '#8B5CF6' },
        { id: 'inspiration', label: '素材',   en: 'INSPIRATION', color: '#2FD6A6' },
        { id: 'lab',         label: '实验室', en: 'LAB',         color: '#FF9F1C' }
    ],
    /* 首页只露这几篇（做减法）；展开「全部档案」后才显示全部 */
    /* 站点搭建案例置入精选首位，与旧 works 精选同为粉色，故替换一篇保持四色撞开 */
    picked: ['site-build-case-study', 'hollow-knight-rig', 'npr-outline', 'env-design-to-game-art'],
    links: [
        { label: 'Portfolio',   hint: 'www.artnh.cn · 作品集',     url: 'https://www.artnh.cn' },
        { label: 'Art Gallery', hint: 'art.artnh.cn · 作品档案馆', url: 'https://art.artnh.cn/' },
        { label: 'GitHub',      hint: 'github.com/ArtNh',          url: 'https://github.com/ArtNh' }
    ]
};

window.BLOG_POSTS = [

    {
        slug: 'site-build-case-study',
        title: 'ARTNH.CN 搭建全案：从 404 门扉到手绘主网',
        subtitle: '一次完整的个人站点重构 · 案例研究 / 六轮迭代 / 技术决策 / 排坑 / 交付',
        date: '2026-11-16',
        category: 'works',
        tags: ['站点搭建', '设计复盘', '零构建'],
        readTime: 18,
        featured: true,
        excerpt: '从一个只有三行外链、首屏强制 404 的门扉页，到零构建的亮色手绘撞色博客主网。把案例研究、六轮迭代、技术决策、15 个坑的根因和全部验收数据摊开写清楚。',
        content: `
<p>这个站点最初不是博客。它是一块单文件雕出来的琥珀：1445 行里塞着内联 CSS、HTML 和 JS，打开首页先撞上一张全屏的 404 翻转卡片，翻过去才看得见三行外链。这篇把「怎么把它重铸成现在这样」完整摊开 —— 包括走错的方向、被否掉的字体，和 15 个坑的真正根因。</p>

<h2>01 · 起点与约束</h2>
<p>改造前没有构建工具、没有框架、没有依赖、没有测试。主站本体只有标题、一段简介和三条外链；真正的主角是盖在最上层的「宇宙门扉」：3D 翻转卡片、NASA 全屏探索、180 粒子 Canvas 星尘、沙金流星与鼠标引力偏折。</p>
<table>
<thead><tr><th>文件</th><th>体量</th><th>角色</th></tr></thead>
<tbody>
<tr><td>index.html</td><td>1445 行 / 49 KB</td><td>内联 CSS + HTML + JS 全在这里</td></tr>
<tr><td>404.html</td><td>15 行</td><td>死链重定向到 index.html#404</td></tr>
<tr><td>1000104636.jpg</td><td>357 KB</td><td>NASA 生日星空图</td></tr>
<tr><td>favicon.svg</td><td>21 行</td><td>第一版深空蓝渐变 A</td></tr>
</tbody>
</table>
<p>动手前先把旧机器的失效路径全部修对（工作区变量、文档相对路径、缺失素材改成项目内可恢复路径）。然后立住三条约束：</p>
<ul>
<li><strong>双击即开</strong>：文章数据用 <code>posts.js</code> 挂全局变量，不用 <code>fetch</code> 读 JSON —— <code>file://</code> 下会被 CORS 拦下。</li>
<li><strong>零构建</strong>：不引框架、不装 npm，页面渲染、筛选、路由全部手写。</li>
<li><strong>留退路</strong>：新主题后置覆盖、旧暗色样式一行不删，移除一行 link 就能回退。</li>
</ul>

<h2>02 · 先研究，再动刀</h2>
<p>第一版我做成暗调信息墙，被一句话否掉：「要亮色调……全是直角矩形缺少动画感……把所有东西全部拿出来缺少创意」。这次没直接换配色，先去拆解真实成功的个人站点。</p>
<table>
<thead><tr><th>案例</th><th>值得偷的东西</th><th>落点</th></tr></thead>
<tbody>
<tr><td>Jack McDade</td><td>三色系统、波浪取代直线、拒绝方框与对称</td><td>受限色板 + 满幅波纹</td></tr>
<tr><td>Karl Gonsalves</td><td>平涂撞色、no UI density，插画即界面</td><td>奶油纸底 + 首屏单一焦点</td></tr>
<tr><td>StealThis.dev</td><td>硬偏移阴影、贴纸倾斜、果冻点击配方</td><td>7px 8px 0 阴影 + 26px 圆角</td></tr>
<tr><td>Antoniouve</td><td>满底亮黄 + 巨标题 + 弹性 easing</td><td>响应式巨标题</td></tr>
<tr><td>Jonas Mosesson</td><td>每个项目一个撞色背景</td><td>6 栏目各一色</td></tr>
<tr><td>Oono Taro</td><td>静态色带平衡动画，motion 才突出</td><td>漂浮涂鸦只留 4 个</td></tr>
</tbody>
</table>
<blockquote>好的那些共同点：一个视觉概念 + 一套受限色板 + 大量留白 + 少量但用得狠的动效。上一版错在把「风格化」理解成「暗调 + 铺满 + 直角网格」。</blockquote>

<h2>03 · 六轮迭代</h2>
<table>
<thead><tr><th>轮</th><th>反馈</th><th>动作</th></tr></thead>
<tbody>
<tr><td>R1</td><td>改成博客主网</td><td>先定方向：门扉降级彩蛋 / 零构建 / 风格化；新增数据层与三态路由</td></tr>
<tr><td>R2</td><td>要亮色撞色、有留白</td><td>案例研究后写独立 theme.css；首屏砍到 4 篇精选</td></tr>
<tr><td>R3</td><td>插画该动、回到顶部无效、彩蛋卡顿</td><td>停 Canvas / blur / 3D 倾斜；门扉换亮色皮；点击迸发</td></tr>
<tr><td>R4</td><td>没动效、要手绘、封面各不同</td><td>动画周期从 15s 砍到 2.6s；满幅波纹、6 套封面、贝塞尔样条线</td></tr>
<tr><td>R5</td><td>手绘只作用于图形</td><td>撤回全部手写字体，图形层一处没动</td></tr>
<tr><td>R6</td><td>标签图标不搭</td><td>重画亮黄手绘贴纸标</td></tr>
</tbody>
</table>
<p>R5 最关键。我把「手绘」一起刷到了文字层，用户一句「no」把整轮方向拉回来；之后写进项目约定与贡献指南：<em>风格化只碰图形与容器，不改文字字体</em>。</p>

<h2>04 · 设计系统</h2>
<ul>
<li><strong>色板</strong>：奶油纸底 60% + 电光蓝 30% + 粉 / 黄 / 薄荷 10%；作品粉、笔记蓝、教程紫、素材薄荷、实验室橙。</li>
<li><strong>字体</strong>：全站 Baloo 2 + 系统中文字体，小字号手写体会糊，已全部撤回。</li>
<li><strong>形状</strong>：四角各异的不规则圆角、粗细不均的双笔触描边、7px 8px 0 硬阴影、按索引 ±1.6° 的贴纸倾斜。</li>
<li><strong>动效</strong>：星球六组动画、四涂鸦四条独立轨迹、满幅四层波纹、滚动入场、鼠标视差、点击星点与样条线。</li>
</ul>
<p>性能上有个克制：手绘抖动滤镜只给静态封面、小涂鸦和短命的点击线，不给动画元素 —— 否则每帧重算 feTurbulence，刚修好的卡顿会立刻回来。</p>

<h2>05 · 技术实现</h2>
<p><strong>零构建数据层</strong>：<code>posts.js</code> 暴露 BLOG_META 与 BLOG_POSTS，渲染引擎负责网格、筛选、全文搜索、排序、编号、阅读层与上下篇。加文章只需复制一个对象。</p>
<p><strong>三态路由</strong>：hash 托管首页 / 分类 / 文章详情 / 关于 / 404 彩蛋；Wander 唤起门扉不改 hash，从文章页点开彩蛋关掉后仍停在那篇文章。</p>
<p><strong>主题后置覆盖</strong>：<code>theme.css</code> 在 head 末尾引入覆盖内联暗色样式，旧暗色稿一行没删，成为可回退底稿。</p>
<p><strong>性能开关</strong>：亮色主题下不启动 180 粒子循环、不做全屏 blur(25px)、不做逐帧 3D 倾斜；移除 link 回退暗色时三者自动恢复。</p>
<p><strong>手绘封面</strong>：6 套基础 SVG 图案 × 按 slug 派生的镜像、旋转、星点位置 —— 展开后 11 张全唯一，新增文章不用单独画图。</p>

<h2>06 · 15 个坑（根因级）</h2>
<p>这部分最值钱，因为几乎每一条都不是「看上去那样」。</p>
<table>
<thead><tr><th>现象</th><th>根因</th><th>修法</th></tr></thead>
<tbody>
<tr><td>标题句点掉到下一行</td><td>span 的 display:block 连带作用</td><td>句点单独 inline</td></tr>
<tr><td>网格第一行右侧空洞</td><td>大卡跨列撞车</td><td>改 2 列并取消跨列</td></tr>
<tr><td>移动端像被裁切</td><td>无头浏览器把 390 拉成 504，是尺子不准</td><td>CDP 真实视口仿真</td></tr>
<tr><td>blob 退化成直角矩形</td><td>reduced-motion 下没给静态圆角</td><td>补基础圆角</td></tr>
<tr><td>第 4 张卡隐身</td><td>入场 opacity:0 没推进</td><td>基础态设 opacity:1</td></tr>
<tr><td>彩蛋糊成灰白</td><td>半透明底被亮色主站透穿</td><td>改 92% 实底</td></tr>
<tr><td>彩蛋卡顿</td><td>blur + 180 粒子 + mousemove 3D 空转</td><td>三处全停</td></tr>
<tr><td>回到顶部无效</td><td>a 标签只改 hash 还会收起文章</td><td>button + scrollTo</td></tr>
<tr><td>「插画没动效」</td><td>6 个动画全在跑，只是 15s 一圈</td><td>调节奏不是修 bug</td></tr>
<tr><td>文字发糊 / 被否</td><td>手绘误伤文字层</td><td>全量撤回字体</td></tr>
<tr><td>favicon 全破图</td><td>python 服务返回非标准 image/svg</td><td>注册正确 MIME</td></tr>
<tr><td>窄屏真溢出 55px</td><td>品牌副标题撑破 header</td><td>窄屏收掉副标题</td></tr>
<tr><td>git TLS 握手断</td><td>代理对 HTTP/2 CONNECT 返回 502</td><td>HTTP/1.1 + OpenSSL</td></tr>
<tr><td>push 大 POST 被掐</td><td>GET 能过、上传过不去</td><td>改走 Git Data API</td></tr>
<tr><td>本地远程分叉</td><td>API 通道是另一条提交链</td><td>fetch + reset --soft 对齐</td></tr>
</tbody>
</table>

<h2>07 · 工程化与交付</h2>
<p>远程覆盖前先用 API 把旧版 9 个文件完整备份到项目外并记下回滚锚点。推送脚本做三件安全约束：token 只走环境变量不落盘、推送前 lease 校验远程 HEAD 未变、新 commit 以旧 HEAD 为 parent 做 fast-forward。之后补齐 README、推送与回滚手册、详细变更档案、四个社区规范文件，并把仓库描述补上。</p>
<p>许可上有个取舍：LICENSE 保持纯 MIT 让 GitHub 正确识别；文章文字、手绘插画、封面与图片素材的版权例外声明放在 README 和贡献指南里，不写进 LICENSE 以免识别降级。</p>

<h2>08 · 验收数据</h2>
<pre>语法    posts.js / 内联 JS 零错误，CSS 花括号平衡
数据    11 篇 / 6 栏目 / 4 篇精选 / 无重复 slug
渲染    首页 / 详情 / #404 彩蛋 / 展开全部 四态通过
响应式  1440 与真实 390px：scrollW === inner，零溢出
封面    展开后 11 张全唯一
动效    10 组 animation running，周期 2.6s / 3.4s
波纹    waveW === innerWidth（1440 / 1000 / 390）
点击    scribbles=1 paths=3 sparks=6 rings=1
性能    Canvas 循环已停 / overlayBlur=none
双击    file:// 完整渲染
远程    逐字节一致，community profile 四件套就位</pre>
<p>验收方式本身也是经验：用 CDP 读 computed style、getAnimations、DOM 计数与 scrollWidth 做「行为级」验证，而不是只靠截图目测 —— 上面第 3、4、5、9 条都是这么抓到的。</p>

<h2>09 · 三条可复用经验</h2>
<ul>
<li><strong>先研究再动刀</strong>。说「风格不对」时最贵的动作是立刻换配色；先把成功案例拆成可执行规则，一轮就能命中。</li>
<li><strong>诊断要量，不要猜</strong>。「没动效」其实全在跑，「移动端裁切」其实是尺子不准，「卡顿」其实是暗色遗留空转。</li>
<li><strong>给改造留退路</strong>。后置覆盖不删旧码、彩蛋降级而非移除、性能开关可自动恢复、覆盖前备份 + lease —— 每一步能一键回退，才敢在老站上做大改。</li>
</ul>
<blockquote>协作上还有一条：风格化要划清作用层。用户一句「手绘只应用于图形」纠正了整轮方向，之后写进项目约定，避免下次再犯。</blockquote>
<p>完整归档（含文件级变更清单、推送链、命名规则与已知边界）在仓库 <code>Markdown_Notes/[个人站点搭建完整案例_20261116_020652.md]</code>。</p>`
    },

    {
        slug: 'hollow-knight-rig',
        title: '空洞骑士风格角色的骨骼定位实验',
        subtitle: '当 Auto-Rig Pro 的 AI 识别遇上非人形角色',
        date: '2026-11-12',
        category: 'lab',
        tags: ['Auto-Rig Pro', '绑骨', '风格化角色'],
        readTime: 9,
        featured: true,
        excerpt: '圆脑袋、无手指、披风盖住四肢——标准人形识别在这类角色上几乎全军覆没。记录我这轮把骨骼锚点从「猜」改成「算」的过程。',
        content: `
<p>风格化角色最麻烦的地方不是面数，是<strong>它根本不长成人形</strong>。空洞骑士那类剪影：一颗大圆头、细短四肢、披风把躯干整个吞掉。Auto-Rig Pro 的 AI 识别是按标准人体比例训练的，喂进去之后骨盆、肩线、腕踝几乎全部偏移，一键绑骨直接变成一键返工。</p>
<h2>问题出在「比例先验」</h2>
<p>识别逻辑本质上是在网格上找符合人体比例的特征点。头身比一旦偏离，锚点就会沿着错误的极值漂移：头太大 → 颈部下移；四肢太短 → 肘膝被压进躯干。这不是识别精度不够，是<em>参照系不对</em>。</p>
<blockquote>与其让 AI 猜「哪里像人」，不如先告诉它「这个角色哪里不像人」。</blockquote>
<h2>我这轮做的三件事</h2>
<ul>
<li><strong>预置比例档案</strong>：按头身比给常见风格化剪影分档，识别前先切换档案，而不是让模型用同一套先验硬套。</li>
<li><strong>锚点几何回退</strong>：AI 给的置信度低于阈值时，改用网格的曲率极值与对称轴推算关节，而不是直接接受漂移结果。</li>
<li><strong>披风/附属物排除</strong>：先用连通性与法线方向把大面积覆盖物从识别输入里摘掉，避免它把躯干轮廓整个带偏。</li>
</ul>
<h2>还没解决的部分</h2>
<p>披风本身的骨骼仍然是手工摆的。下一步想把它做成可复用的「附属物模板」，识别完主骨架后自动挂载。另外双版本（4.5.5 / 5.2.2）的 API 差异还在慢慢磨，这部分单独开一篇。</p>
<p>结论：非人形角色的自动化，难点从来不是「更聪明的模型」，而是<strong>先把输入整理成模型能理解的样子</strong>。</p>`
    },

    {
        slug: 'arp-aid-kit',
        title: 'arp_aid_kit：给 Auto-Rig Pro 做非破坏性修补',
        subtitle: '不改原插件一行代码，也能让它更懂我的模型',
        date: '2026-11-08',
        category: 'lab',
        tags: ['Blender 插件', 'arp_aid_kit', '运行时修补'],
        readTime: 8,
        featured: false,
        excerpt: '改造第三方插件最忌讳直接改源文件：一升级全没了，还不敢跟人共享。这个自建工具包走的是运行时打补丁的路子。',
        content: `
<p>我用的是郭吉军汉化重打包版 Auto-Rig Pro 3.78.46，同时装在 Blender 4.5.5 和 5.2.2 上。想改它的 AI 识别逻辑，最直觉的做法是直接动源文件——但这样有三个死穴：插件一更新就覆盖、双版本要维护两份、出问题时没法快速回滚。</p>
<h2>换成运行时修补</h2>
<p><code>arp_aid_kit</code> 的思路是：自己的插件独立安装，在注册完成后把目标函数包一层，只在特定条件下改变行为，其余全部原样透传。</p>
<pre>原调用链：  ARP.识别() → 结果
修补后：    ARP.识别() → 结果 → aid_kit.校正() → 结果'</pre>
<p>这样做的好处很直接：卸载 aid_kit，ARP 立刻恢复原状；升级 ARP 只要接口没变，补丁继续能用；两套 Blender 版本共用一份逻辑。</p>
<h2>目前挂了哪些能力</h2>
<ul>
<li>识别前的网格预处理（比例档案、覆盖物排除、对称轴估算）</li>
<li>识别后锚点校正与置信度标注</li>
<li>一键绑骨流程的收尾补齐：命名、层级、权重检查</li>
</ul>
<blockquote>一个边界要记牢：这套东西依赖汉化重打包版 ARP，属于自用范畴，不能拿去当商品卖。要商业化，得先剥掉这个依赖，做成通用绑骨工具。</blockquote>
<h2>为什么值得单独造轮子</h2>
<p>因为它把「改插件」变成了「写自己的插件」——前者是维护别人的代码，后者是积累自己的资产。哪怕 ARP 明天换掉，这套预处理与校正逻辑仍然能搬去别的地方用。</p>`
    },

    {
        slug: 'npr-outline',
        title: '三渲二的轮廓线：从 Freestyle 到 Grease Pencil',
        subtitle: '线条不是描边，是造型的一部分',
        date: '2026-11-03',
        category: 'tutorials',
        tags: ['NPR', '轮廓线', 'Grease Pencil'],
        readTime: 11,
        excerpt: '同一张图，轮廓线的粗细断续一变，气质就从「模型截图」变成「画」。这篇拆三种常用出线方式的适用边界。',
        content: `
<p>三渲二里最容易露馅的不是材质，是线。匀粗匀黑的实线一加上去，画面立刻变成「带黑边的 3D 模型」。真正的手绘感来自<strong>线的节奏</strong>：该断的地方断、该压重的地方压重、转折处略微外扩。</p>
<h2>三种出线方式</h2>
<ul>
<li><strong>Freestyle</strong>：基于几何边界，可控参数多，适合静帧。缺点是动画里线条会抖，且对复杂拓扑容易出碎线。</li>
<li><strong>反转法线外扩（Inverted Hull）</strong>：稳定、跟动画走，适合角色。但只能给均匀粗细，且对凹面容易穿帮。</li>
<li><strong>Grease Pencil</strong>：自由度最高，能画断续、飞白、压感，适合镜头级精修。代价是要手动介入，产量低。</li>
</ul>
<h2>我的组合拳</h2>
<p>角色主体用反转法线保底，保证每个角度都有线；关键镜头再叠一层 Grease Pencil 做局部加重与飞白；静帧出图时才开 Freestyle 补内部结构线。</p>
<blockquote>别指望一种方案通吃。线的本质是「替观众补充造型信息」，哪个视角缺信息，就在哪里补。</blockquote>
<h2>两个小坑</h2>
<p>反转法线的外扩量要跟着镜头距离走，远景不调会把线糊成一团；另外描边材质记得关阴影接收，否则线自己会投出一道脏影子。</p>`
    },

    {
        slug: 'hard-surface-stack',
        title: '硬表面插件栈：四件套各管什么',
        subtitle: 'BoxCutter / HardOps / MESHmachine / MACHIN3tools',
        date: '2026-10-28',
        category: 'notes',
        tags: ['硬表面', '插件栈', 'Blender'],
        readTime: 7,
        excerpt: '刚开始以为它们是四个互相竞争的建模插件，用下来才发现是流水线上的四道工序。记一份不绕弯的定位笔记。',
        content: `
<p>这四个名字总被绑在一起出现，导致我一开始以为要「选一个学」。实际它们解决的是不同阶段的问题，装齐了反而更清楚。</p>
<h2>一句话定位</h2>
<ul>
<li><strong>BoxCutter</strong> —— 开局切形。布尔切割、快速挖洞、搭大块体量，负责从零到「有个大概」。</li>
<li><strong>HardOps</strong> —— 倒角与收边。把切出来的硬棱做倒角、加权重法线、管理切面显示，从「有个大概」到「能看」。</li>
<li><strong>MESHmachine</strong> —— 收拾烂摊子。布尔之后一堆丑陋的拓扑，用它做面片重建、倒角修复、清理残留。</li>
<li><strong>MACHIN3tools</strong> —— 干活提速。散布在建模各处的快捷操作、对齐、镜像、清理与视图辅助，属于肌肉记忆层。</li>
</ul>
<blockquote>把它们想成「切 → 收 → 修 → 顺手」四道工序，就不会纠结该学哪个了。</blockquote>
<h2>和 NPR 的关系</h2>
<p>我做风格化场景时其实用不到特别精密的硬表面，但这套流程对<strong>体量控制</strong>帮助很大：先用布尔快速搭出块面关系，确认剪影好看，再决定哪些地方值得细化。环境设计出身的人大概会对这一步特别熟——本质上就是先推敲体块，再画细节。</p>`
    },

    {
        slug: 'env-design-to-game-art',
        title: '环境设计出身，怎么转的游戏美术',
        subtitle: '本科四年练的东西，哪些真的能带走',
        date: '2026-10-20',
        category: 'notes',
        tags: ['个人', '职业', '空间表现'],
        readTime: 6,
        excerpt: '不是所有课程都白上了。空间、尺度、光、动线这几件事，换到 Blender 里居然原封不动地能用。',
        content: `
<p>环境设计本科毕业，现在主要在做 Blender 风格化 NPR。听起来跨得很远，但真正每天在用的底层能力，几乎都是那四年练出来的。</p>
<h2>能直接带走的</h2>
<ul>
<li><strong>空间感与尺度</strong>：一张图里人多大、门多高、台阶多陡，不用查参考也知道哪里别扭。</li>
<li><strong>光的叙事</strong>：效果图训练的是「用光引导视线」，换成 NPR 只是把光换成了色阶，逻辑没变。</li>
<li><strong>动线意识</strong>：搭场景时下意识会想「观众从哪看进来、往哪走」，这比堆细节重要得多。</li>
<li><strong>出图表达</strong>：构图、留白、氛围版式，做作品展示时省了大量试错。</li>
</ul>
<h2>必须补的</h2>
<p>拓扑、UV、材质节点、骨骼权重——这些是纯技术活，没有捷径，只能靠一遍遍做。另外「风格化」这件事本身也不是把精度降低就行，它要求你更明确地知道<em>要舍弃什么</em>。</p>
<blockquote>环境设计给我的不是软件技能，是一套判断画面好坏的标准。工具可以换，标准不用换。</blockquote>
<h2>给同样在转的人</h2>
<p>别急着把过去清空。先找出你已有能力里「不依赖工具」的那部分，那才是转方向时真正能站住的地基。</p>`
    },

    {
        slug: 'npr-material-ramp',
        title: 'NPR 材质球笔记：色阶、边缘光与阴影硬化',
        subtitle: '把连续光照压成三到四档',
        date: '2026-10-14',
        category: 'tutorials',
        tags: ['NPR', '材质', '色阶'],
        readTime: 10,
        excerpt: '三渲二材质不是「简化版 PBR」，而是主动把光照离散化。记一套我现在稳定在用的球，以及每个节点的取舍。',
        content: `
<p>最开始我拿 PBR 材质往「卡通」调，怎么调都像塑料。后来才想明白：NPR 的核心动作是<strong>丢弃中间调</strong>，不是把粗糙度拉高。</p>
<h2>三层结构</h2>
<ul>
<li><strong>色阶（ColorRamp / Shader to RGB）</strong>：把光照强度压成 3–4 档硬边色块。档位之间不要渐变，交界越干净越像画。</li>
<li><strong>边缘光（Fresnel → 阈值）</strong>：给轮廓补一道冷色高光，模拟逆光下的反光。半径要克制，宽了就成发光塑料。</li>
<li><strong>阴影硬化</strong>：阴影侧不要跟着环境光变亮，单独给一个偏冷、偏紫的固定色，画面立刻有了「画册感」。</li>
</ul>
<blockquote>色阶决定像不像画，阴影色决定好不好看。多数人只调第一层就停了。</blockquote>
<h2>两个容易翻车的地方</h2>
<p><code>Shader to RGB</code> 只在 Eevee 下有效，Cycles 里要换实现；另外色阶档位一旦超过五档，观感会迅速退回写实，别舍不得删。</p>
<h2>和轮廓线的配合</h2>
<p>材质已经把明暗切成块面之后，轮廓线只需要守住外边界就够了，内部结构线可以大幅减少。这两层是互相减负的关系，不是各画各的。</p>`
    },

    {
        slug: 'daily-aesthetic-archive',
        title: '每日审美采集：我的风格化三渲二素材库',
        subtitle: '与其靠灵感，不如先建一个能翻的东西',
        date: '2026-10-09',
        category: 'inspiration',
        tags: ['素材库', '自动化', '审美'],
        readTime: 5,
        excerpt: '每天自动收一批风格化三渲二参考，按色阶 / 剪影 / 光型归类。用了一段时间后，找参考的时间从半小时压到两分钟。',
        content: `
<p>做风格化最耗时的往往不是建模，是<strong>「我到底想要什么感觉」</strong>说不清楚。以前每次开工都重新刷一遍图站，刷完一小时，手里还是没有能对齐的参照。</p>
<h2>改成自动沉淀</h2>
<p>现在每天定时收一批三渲二 / NPR 方向的图，落到本地固定目录，按三个维度粗分：</p>
<ul>
<li><strong>色阶</strong>：几档明暗、阴影偏冷还是偏暖</li>
<li><strong>剪影</strong>：角色/场景的外轮廓是否靠夸张比例撑起来</li>
<li><strong>光型</strong>：主光方向、边缘光强度、有没有刻意压平体积</li>
</ul>
<blockquote>素材库的价值不在「多」，在于你有固定的分类维度，翻的时候能直接命中当下卡住的那个问题。</blockquote>
<h2>一点克制</h2>
<p>收图很容易变成囤积。我给自己定了条线：只留能说清「好在哪」的，说不清的一律不留。数量下来了，命中率反而上去了。</p>`
    },

    {
        slug: 'blender-dual-version',
        title: 'Blender 4.5 / 5.2 双版本插件兼容踩坑',
        subtitle: '同一份补丁，凭什么在两个版本里都跑得动',
        date: '2026-10-02',
        category: 'lab',
        tags: ['Blender', '版本兼容', '插件开发'],
        readTime: 8,
        excerpt: '4.5.5 与 5.2.2 同时装着同一套绑骨插件，API 差异比想象中琐碎。记一份我实际撞到的清单和规避写法。',
        content: `
<p>为了验证补丁不是只在一个版本里碰巧能跑，我把 Blender 4.5.5 和 5.2.2 并排装了，同一份 <code>arp_aid_kit</code> 两边都加载。结果是：大部分逻辑没问题，倒霉的全是边角。</p>
<h2>实际撞到的差异</h2>
<ul>
<li>部分 <code>bpy.ops</code> 的上下文要求变严，后台调用必须显式塞 context override</li>
<li>属性名与枚举值有小幅改名，硬编码字符串会在新版静默失效</li>
<li>节点树接口读取方式调整，材质相关的辅助代码要分两条路径</li>
<li>注册/注销时机不同，卸载时偶发残留引用</li>
</ul>
<h2>我现在的写法</h2>
<p>不写 <code>if version == X</code>，改成<strong>能力探测</strong>：先问「这个属性/操作符在不在」，再决定走哪条路径。版本判断只用来记日志，不用来分支。</p>
<pre>能用 getattr / hasattr 探的，就别信版本号。</pre>
<blockquote>版本分支会越写越多，能力探测只会越写越稳。</blockquote>
<h2>顺带一提</h2>
<p>双版本对照还有个隐藏好处：某个行为如果只在其中一个版本出问题，基本能立刻判定是 API 差异而不是自己的逻辑错。排查时间省了一大半。</p>`
    },

    {
        slug: 'portfolio-render',
        title: '效果图 → 空间叙事：本科作品的再整理',
        subtitle: '把四年的图重新排一遍，才发现缺的是什么',
        date: '2026-09-24',
        category: 'works',
        tags: ['效果图', '作品集', '空间表现'],
        readTime: 6,
        excerpt: '翻出本科时期的 rendering 重新归档。技术早就过时了，但「一张图讲清楚一个空间」这件事，现在依然是我做场景的底层要求。',
        content: `
<p>硬盘里躺着几十张本科时的效果图，一直没整理。这轮重新排了一遍，本以为会是一场「当年真稚嫩」的处刑，结果反而捞回了不少东西。</p>
<h2>还站得住的</h2>
<ul>
<li>构图：视线落点、前景压角、留白节奏，这些判断现在看也没错</li>
<li>光：几张用单一主光撑起整间屋子的图，比后来堆了一堆补光的更耐看</li>
<li>叙事：好的那几张，图上总有个「人刚离开」的痕迹，而不只是摆满了家具</li>
</ul>
<h2>明显缺的</h2>
<p>材质精度、配景丰富度，还有当时完全没意识到的<strong>风格统一性</strong>——每张图都在换审美，单张看都还行，放一起像四个人做的。</p>
<blockquote>作品集不是把最好的图堆起来，是让人相信这些图出自同一个人。</blockquote>
<h2>带到现在的做法</h2>
<p>做风格化场景时，我会先定一条「这套图只允许出现哪几种形状、哪三档颜色」，再开始搭。约束先立住，后面才不会一路跑偏。</p>`
    },

    {
        slug: 'stylized-space-study-01',
        title: '风格化空间练习 · 01：低多边形街角',
        subtitle: '用最少的面，把「午后」做出来',
        date: '2026-09-16',
        category: 'works',
        tags: ['风格化场景', '练习', 'NPR'],
        readTime: 5,
        excerpt: '一个街角，三档色阶，没有贴图。练习目标是：不靠细节密度，只靠体块比例和光的切面，让人一眼读出时间与温度。',
        content: `
<p>给自己定的限制很死：一个街角、三档色阶、零贴图、面数控制在能一眼数清的程度。想验证的是「氛围到底有多大比例来自造型本身」。</p>
<h2>三个决定性动作</h2>
<ul>
<li><strong>把建筑体块略微 exaggerate</strong>：檐口加厚、窗洞收窄，剪影先立住</li>
<li><strong>只用一道主光</strong>：让明暗交界线自己把墙面切成两块，代替贴图画出来的体积</li>
<li><strong>地面留大块空</strong>：不撒碎石杂物，把「午后没人」的感觉交给留白</li>
</ul>
<blockquote>细节是用来佐证氛围的，不是用来制造氛围的。顺序反了就会越做越碎。</blockquote>
<h2>结果</h2>
<p>远看成立，近看仍然偏空。下一轮打算只补一处：在明暗交界附近加一道极窄的反弹光，看看能不能不动面数就把层次提起来。</p>`
    }

];
