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
    /* 首页只露这几篇（做减法）；展开「全部档案」后才显示 10 篇 */
    picked: ['hollow-knight-rig', 'npr-outline', 'stylized-space-study-01', 'env-design-to-game-art'],
    links: [
        { label: 'Portfolio',   hint: 'www.artnh.cn · 作品集',     url: 'https://www.artnh.cn' },
        { label: 'Art Gallery', hint: 'art.artnh.cn · 作品档案馆', url: 'https://art.artnh.cn/' },
        { label: 'GitHub',      hint: 'github.com/ArtNh',          url: 'https://github.com/ArtNh' }
    ]
};

window.BLOG_POSTS = [

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
