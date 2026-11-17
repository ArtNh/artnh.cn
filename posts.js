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
    /* 首页只露这几篇（做减法）；数组顺序 = 首页网格的座次（策展排序），
       展开全部档案后才切回按 date 排。6 篇 = 2 列 × 3 行正好铺满 */
    picked: ['site-build-case-study', 'blender-movie-projector', 'npr-outline-methods', 'hollow-knight-rig',
             'env-design-to-game-art', 'blender-ai-agent-mcp'],
    links: [
        { label: 'Portfolio',   hint: 'www.artnh.cn · 作品集',     url: 'https://www.artnh.cn' },
        { label: 'Art Gallery', hint: 'art.artnh.cn · 作品档案馆', url: 'https://art.artnh.cn/' },
        { label: 'GitHub',      hint: 'github.com/ArtNh',          url: 'https://github.com/ArtNh' },
        { label: 'Email',       hint: 'ArtNh1@hotmail.com · 联系我', url: 'mailto:ArtNh1@hotmail.com' }
    ]
};

window.BLOG_POSTS = [

    {
        slug: 'blender-movie-projector',
        title: '在 Blender 里造一台电影投影仪',
        subtitle: '动态音视频同步投影完整教程 · 八步走通 · Cycles / 零节点基础可跟',
        date: '2026-11-17',
        category: 'tutorials',
        tags: ['Cycles', '灯光投影', '音画同步'],
        readTime: 15,
        excerpt: '灯的自发光被「劫持」成放映机镜头，一张图投满整面幕布。从鱼眼校正到体积光柱、正片叠底调色，再到 mp4 音画同步输出，八步 + 排查手册 + 参数速查卡，首次约 30 分钟能做完。',
        content: `
<p>这个效果拆开只有三个机制，理解了它们，你就是在<strong>造一台真实的投影仪</strong>，而不是在照抄节点——参数乱了大不了重新推。</p>
<p>适用 <strong>Blender 4.x 及以上（Cycles 渲染器）</strong>，难度入门级、零节点基础可跟，首次约 30 分钟，产出是黑暗房间里一台会放电影、带声音的「投影仪」。</p>

<h2>01 · 先看懂原理：投影仪的解剖学</h2>
<h3>机制一：灯的自发光被「劫持」</h3>
<p>Blender 里所有灯默认连一个<strong>自发光（Emission）</strong>节点——发白光。但这个自发光的颜色输入口是开放的：你可以把<strong>任何东西</strong>接进去，接什么，灯就发什么样的光。</p>
<p>把一张图片接进去会怎样？灯发出的每一缕光都带着这张图的颜色——打到墙上，墙上出现这张图。<strong>灯变成了放映机的镜头，墙变成了银幕。</strong>就这么简单。</p>

<h3>机制二：为什么用「环境纹理」，而且要除以 Z</h3>
<p>这里有个坎：灯采样方向是<strong>球形的</strong>（每缕光是一个空间方向），而普通图像纹理是<strong>平面的</strong>（UV 坐标），两者天然不匹配。Blender 给的现成答案是<strong>环境纹理</strong>——它本来是做全景 HDR 的，自带「把平面图按球面方向展开」的解释器，是灯光唯一顺手的图像入口。</p>
<p>代价是：球面展开是<strong>鱼眼</strong>的。直接投影，画面是圆形，越靠边越弯。要拉直它，得做一次<strong>透视校正</strong>——这正是「相除」节点干的事：</p>
<div style="background:#fff;border:2px solid var(--ink,#1B1830);border-radius:18px;padding:14px;margin:1.6rem 0;">
<svg viewBox="0 0 680 250" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">
  <defs>
    <marker id="pj-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="#1a1a18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <text x="340" y="28" font-size="12" fill="#8a877f" text-anchor="middle">把弯曲的球面「摊平」钉在墙上：每一行的高度除以它离灯轴的深度 Z，弯曲就消失了</text>
  <circle cx="90" cy="125" r="6" fill="#993c1d"/>
  <text x="90" y="155" font-size="12" fill="#55534e" text-anchor="middle">灯（原点）</text>
  <path d="M96 125 Q 210 30 330 60" fill="none" stroke="#2FD6A6" stroke-width="1" stroke-dasharray="4 3"/>
  <path d="M96 125 Q 210 220 330 190" fill="none" stroke="#2FD6A6" stroke-width="1" stroke-dasharray="4 3"/>
  <ellipse cx="330" cy="125" rx="34" ry="66" fill="#e8fbf4" stroke="#2FD6A6" stroke-width="1"/>
  <path d="M316 95 Q 330 88 344 95" fill="none" stroke="#2FD6A6" stroke-width="1"/>
  <path d="M314 125 Q 330 118 346 125" fill="none" stroke="#2FD6A6" stroke-width="1"/>
  <path d="M316 155 Q 330 162 344 155" fill="none" stroke="#2FD6A6" stroke-width="1"/>
  <text x="330" y="215" font-size="12" fill="#55534e" text-anchor="middle">球面坐标下的画面（鱼眼）</text>
  <path d="M370 125 L 425 125" fill="none" stroke="#1a1a18" stroke-width="1.5" marker-end="url(#pj-ar)"/>
  <rect x="432" y="95" width="105" height="60" rx="8" fill="#fff4d1" stroke="#1B1830" stroke-width="1"/>
  <text x="484" y="120" font-size="13" font-weight="600" fill="#412402" text-anchor="middle">X÷Z　Y÷Z</text>
  <text x="484" y="140" font-size="11" fill="#854f0b" text-anchor="middle">透视校正</text>
  <path d="M540 125 L 573 125" fill="none" stroke="#1a1a18" stroke-width="1.5" marker-end="url(#pj-ar)"/>
  <rect x="578" y="72" width="64" height="106" fill="#e8fbf4" stroke="#2FD6A6" stroke-width="1"/>
  <path d="M586 96 L 634 96" stroke="#2FD6A6" stroke-width="1"/>
  <path d="M586 125 L 634 125" stroke="#2FD6A6" stroke-width="1"/>
  <path d="M586 154 L 634 154" stroke="#2FD6A6" stroke-width="1"/>
  <text x="610" y="215" font-size="12" fill="#55534e" text-anchor="middle">平面坐标下的画面（矩形）</text>
</svg>
<p style="font-size:.72rem;color:var(--muted,#8a877f);text-align:center;margin:.4rem 0 0;"><em>相除节点的几何本质：X/Z、Y/Z 把「单位是角度」的球形坐标换算成「单位是长度」的平面坐标</em></p>
</div>
<p>你不需要真懂数学。记住结论就够：<strong>分离 XYZ → X÷Z、Y÷Z，是「鱼眼变矩形」的固定药方</strong>，所有灯光投影都用这一组。</p>

<h3>机制三：声音跟着时间轴走</h3>
<p>画面的播放进度由<strong>场景时间轴帧号</strong>驱动（时间轴第 N 帧 = 视频第 N 帧）；声音由 <strong>Speaker 扬声器</strong>物体驱动，同样跟着时间轴走。两边读的是<strong>同一个 mp4</strong>、起点都是第 1 帧——所以天然同步，一个关键帧都不用打。</p>
<blockquote><strong>一张图记住全部</strong><br>纹理坐标（生成）→ 分离 XYZ → 相除 X/Z·Y/Z → 映射（对齐幕布）→ 环境纹理（影片 mp4）→ 正片叠底 → 灯输出<br>挂在聚光灯上 · Cone + 体积做光柱 · Speaker 吃同一个 mp4 做声音</blockquote>

<h3>我的方法论：先静态，后动态</h3>
<p>别一上来就扔视频。整个流程我把顺序重排成了三段递进，每段都有明确的验收标准，出问题时能立刻知道错在哪一层：</p>
<ul>
<li><strong>静态图片调通</strong>——画面形状、位置、比例全部对齐幕布。形状问题在这一层解决，成本最低。</li>
<li><strong>光柱和调色</strong>——给静态画面加氛围，一样是静态的，随时可停可改。</li>
<li><strong>换视频 + 上声音</strong>——前面全对之后，这一步只是「换个文件」，几乎不会出新问题。</li>
</ul>

<h2>02 · 准备工作：场景尺寸与素材</h2>
<h3>素材要求</h3>
<table><thead><tr><th>素材</th><th>要求</th><th>说明</th></tr></thead><tbody>
<tr><td>一张测试图</td><td>JPG/PNG，横构图</td><td>先用静态图调形状。建议选<strong>有明确人脸/主体</strong>的图，变形一眼可见</td></tr>
<tr><td>一段视频</td><td>mp4（H.264），有声音更佳</td><td>记下两个数：<strong>总帧数</strong>和<strong>帧率</strong>。例：900 帧 @ 30fps = 30 秒</td></tr>
</tbody></table>

<h3>我用的场景尺寸（可直接照抄）</h3>
<table><thead><tr><th>项目</th><th>值</th></tr></thead><tbody>
<tr><td>幕布 Plane</td><td>4 m × 2.25 m（16:9）</td></tr>
<tr><td>幕布位置</td><td>X=0, Y=5m, Z=1.6m</td></tr>
<tr><td>聚光灯位置</td><td>(0, 0, 1.6) 水平照射</td></tr>
<tr><td>灯到幕布距离</td><td>5 m</td></tr>
<tr><td>地面</td><td>大 Plane，深灰漫反射</td></tr>
<tr><td>世界环境</td><td>纯黑（strength 0）</td></tr>
</tbody></table>
<blockquote><strong>为什么给你固定尺寸</strong>：映射参数（我实测：位置 0.5/0.5/0、缩放 2.350）只对我自己的场景有效。<strong>参数跟着灯距和幕布尺寸走</strong>——换自己的场景，就按第三步的调参顺序重新推，两分钟的事。</blockquote>

<h3>界面准备</h3>
<ul>
<li>渲染引擎切 <code>Cycles</code>，设备选 <code>GPU 计算</code>（体积光对 CPU 不友好）。</li>
<li>视口着色切 <code>渲染预览</code>（视口右上角第二个球）——全程盯着最终效果调。</li>
<li>下方分一个 <code>着色器编辑器</code> 窗口，一个 <code>时间轴</code> 窗口。</li>
</ul>

<h2>03 · 第一步：搭房间和幕布</h2>
<ul>
<li><code>Shift+A → 网格 → 平面</code>，<code>S · X · 4 · 回车</code>，<code>S · Y · 2.25 · 回车</code>，<code>R · X · 90</code> 立起来，移到 <code>(0, 5, 1.6)</code>。这就是<strong>幕布</strong>。</li>
<li>再来一个大平面铺地上（比如 <code>S · 30</code>），材质给<strong>原理化 BSDF，基础色深灰、粗糙度 0.8</strong>。</li>
<li><code>Shift+A → 灯光 → 聚光灯</code>，放在原点，<code>R · X · 90</code> 让它水平指向幕布。</li>
<li>选中灯，材质面板中<strong>自发光强度为 25</strong>，右侧属性面板设：<strong>功率 50W</strong>，光束形状：<strong>光锥尺寸 40°、混合 1.0</strong>，阴影：<strong>分辨率 1024</strong>。</li>
<li>世界环境改纯黑：<code>属性 → 世界 → 颜色纯黑，强度 0</code>。黑暗房间是效果的底色。</li>
</ul>
<blockquote><strong>✓ 验收</strong>：渲染预览里应该看到黑暗中一块灰色光斑打在幕布位置，地面有微弱反弹光。<strong>此时它还是一盏普通灯</strong>，这帧截图留好，等下对比用。</blockquote>
<img src="assets/projector/01.webp" alt="灯的初始状态：自发光 25、光锥 40°" loading="lazy" />
<p><em>灯的初始状态：自发光 25、光锥 40°。注意下方节点栏已经展开——接下来就在这里动刀。</em></p>

<h2>04 · 第二步：把灯变成投影仪（核心节点链）</h2>
<p>选中灯，在着色器编辑器里你会看到默认的 <code>自发光 → 灯输出</code>。<strong>不动它们</strong>，在左边空地搭下面这条链。</p>

<h3>4.1 最小可用版（先见到画面）</h3>
<ul>
<li><code>Shift+A → 纹理 → 环境纹理</code>，打开你的<strong>测试图</strong>。</li>
<li><code>Shift+A → 矢量 → 纹理坐标</code>、<code>Shift+A → 矢量 → 映射</code>。</li>
<li>连线：<code>纹理坐标.生成 → 映射.矢量</code>，<code>映射.矢量 → 环境纹理.矢量</code>，<code>环境纹理.颜色 → 自发光.颜色</code>。</li>
</ul>
<blockquote><strong>✓ 验收</strong>：幕布上出现画面了——但是<strong>圆形的、弯的</strong>。没错，这正是预期中的鱼眼，说明灯已经「吃」进了图片。<strong>看到鱼眼 = 劫持成功</strong>，别慌，下一步拉直它。</blockquote>
<img src="assets/projector/02.webp" alt="最小可用版：画面出现在幕布上但呈圆形鱼眼" loading="lazy" />
<p><em>最小可用版：三节点直连，画面出现在幕布上但呈圆形鱼眼——这就是「劫持成功」的样子。（画面不正就调整旋转的 Z 轴）</em></p>

<h3>4.2 鱼眼校正版（正式节点链）</h3>
<ul>
<li><code>Shift+A → 转换器 → 分离 XYZ</code>；<code>Shift+A → 转换器 → 数学</code>（运算改成「相除」）× 2；再来一个 <code>合并 XYZ</code>。</li>
<li>连线：<code>纹理坐标.生成 → 分离XYZ.矢量</code>；<code>分离XYZ.X → 相除1.A</code>、<code>分离XYZ.Z → 相除1.B</code>；<code>分离XYZ.Y → 相除2.A</code>、<code>分离XYZ.Z → 相除2.B</code>。</li>
<li>把两个相除结果用 <code>合并XYZ</code> 组回矢量，接进 <code>映射.矢量</code>（替换原来的直连线）。</li>
</ul>
<blockquote><strong>✓ 验收</strong>：画面从圆形变成<strong>矩形</strong>。可能位置不对、大小不对——没关系，那是第三步映射的事。<strong>这一步只验收「形状是直的」</strong>。</blockquote>
<img src="assets/projector/03.webp" alt="校正链接入后的节点全景" loading="lazy" />
<p><em>校正链接入后的节点全景：纹理坐标 → 分离XYZ → 相除×2 → 合并XYZ → 映射 → 环境纹理。注意两个相除节点的 B 输入吃的都是 Z。</em></p>
<img src="assets/projector/04.webp" alt="画面被拉直成矩形，缩放 2.350、旋转 180°" loading="lazy" />
<p><em>接入校正链的瞬间：画面被「拉直」成矩形，此时缩放 2.350、旋转 180°（画面是倒的）。</em></p>
<img src="assets/projector/05.webp" alt="环境纹理扩展模式选裁剪" loading="lazy" />
<p><em>环境纹理的<strong>扩展模式选「裁剪」</strong>——这一项决定了画面边缘是平齐裁掉还是无限重复。</em></p>
<blockquote><strong>偷懒通道</strong>：分离XYZ + 两个相除 + 合并XYZ 这四件套，在 4.x 里可以选中节点后用<strong>节点 wrangler 插件</strong>（偏好设置里自带）加速连线。但没有插件也完全能做，总共四条线。</blockquote>

<h2>05 · 第三步：对齐幕布——映射调参的固定顺序</h2>
<p>现在画面是矩形了，但它的<strong>位置、大小、比例</strong>都还没对准幕布。别乱试，按这个顺序调，每一步只动一个参数组。口诀：<strong>先缩放铺满 → 再位置居中 → 后微调比例</strong>。</p>
<ul>
<li><strong>缩放 X / Y</strong>：两个数一起从 1.0 开始调，画面大小立刻变化（<strong>我实测是往上调到 2.350</strong>——倍率方向跟节点链有关，试一下便知）。调到画面<strong>略微超出幕布左右边缘</strong>为止。</li>
<li><strong>位置 X / Y</strong>：移动画面中心对准幕布。我的实测 <code>0.5 / 0.5</code>（m），以幕布实际居中为准。</li>
<li><strong>缩放单独微调</strong>：如果画面比例和幕布不符（出现黑边或裁切），单独微调 X 或 Y。我的最终值：缩放 <code>2.350 / 2.350 / 2.350</code>；画面颠倒/偏转就调<strong>旋转 Z</strong>（我实测 180° → 15°）。</li>
</ul>
<blockquote><strong>✓ 验收</strong>：画面端正铺满幕布，四边干净，没有黑边、没有溢出、没有梯形。此时<strong>静态投影已完成 80%</strong>。</blockquote>
<img src="assets/projector/06.webp" alt="缩放调参实测：2.350 三轴、位置 0.5/0.5/0、旋转 Z 15°" loading="lazy" />
<p><em>缩放调参实测：缩放 2.350 三轴、位置 0.5/0.5/0、旋转 Z 15°——画面正立铺满幕布即达标。</em></p>
<blockquote><strong>这一步的心法</strong>：映射参数不是玄学——<strong>缩放 = 投影画面的放大倍率</strong>（倍率方向跟链路有关，我实测落在 2.350），<strong>位置 = 镜头对准哪里</strong>。灯挪远、幕布加大，画面会变小，把缩放反向调一点就回来。理解了方向，任何场景都能两分钟对齐。</blockquote>

<h2>06 · 第四步：让光锥显形——体积光柱</h2>
<p>光柱的本质：<strong>让光穿过一块「雾」</strong>。这块雾是一个锥形网格，我们只给它体积属性、不给表面。</p>
<ul>
<li><code>Shift+A → 网格 → 锥体（Cone）</code>。把<strong>顶点端</strong>对到灯的位置，底面罩住幕布（半径略大于画面）。<code>S · Z</code> 拉伸锥体长度去匹配距离。</li>
<li>锥体材质：<strong>删掉原理化 BSDF</strong>，加 <code>原理化体积（Principled Volume）</code>，直接连到<strong>材质输出的「体积」口</strong>（不是表面口！）。</li>
<li>密度 Density 从默认 1.0 <strong>一路往下调</strong>：<code>0.05 → 0.01 → 0.032</code>。我最终落在 <strong>0.032</strong>——光柱清晰可见但不罩画面。你的场景自己试，落在 0.005~0.05 区间都正常。</li>
<li>回到灯，<strong>光锥尺寸保持 40°</strong>（这个角度就是投矩形画面的角度），<strong>混合 1.0</strong>。做光柱时我把第二盏灯的锥角放到 <strong>78.5°</strong> 来罩体积锥——两盏灯分工：一盏投画面、一盏照光柱。</li>
</ul>
<blockquote><strong>✓ 验收</strong>：黑暗中一根<strong>半透明的锥形光柱</strong>从灯延伸到幕布，边缘柔和，幕布画面依然清晰可读。光柱不能喧宾夺主——如果画面被雾罩得发灰，密度继续降。</blockquote>
<img src="assets/projector/07.webp" alt="锥体的顶点端对准灯，底面罩住幕布" loading="lazy" />
<p><em>锥体的顶点端对准灯，底面罩住幕布——它就是「雾的形状」。</em></p>
<img src="assets/projector/08.webp" alt="密度实测 0.032：光柱清晰可见又不罩幕布画面" loading="lazy" />
<p><em>密度是唯一的灵魂参数：我实测 0.032——光柱清晰可见、又不罩住幕布画面。</em></p>
<h3>密度方向指南</h3>
<table><thead><tr><th>现象</th><th>药方</th></tr></thead><tbody>
<tr><td>光柱是实心白筒，什么都看不清</td><td>密度太高，除以 10 再看（1.0 → 0.1 → 0.01）</td></tr>
<tr><td>光柱若有若无，想要更明显</td><td>密度 ×2~3，或把灯功率加大</td></tr>
<tr><td>画面发灰、像隔了层纱</td><td>密度再降一点（我落在 0.032）；或把锥体<strong>底面改小</strong>，让雾不挡在观众和幕布之间</td></tr>
<tr><td>渲染暴慢</td><td>体积贵。采样别超 64，或只在近景镜头启用</td></tr>
</tbody></table>

<h2>07 · 第五步：给画面调色——正片叠底</h2>
<p>直出的投影画面往往偏亮偏「飘」。在 <code>环境纹理.颜色</code> 和 <code>自发光.颜色</code> 之间插一个混合节点。</p>
<ul>
<li><code>Shift+A → 颜色 → 混合颜色</code>，混合模式选 <strong>正片叠底（Multiply）</strong>，勾选<strong>钳制系数</strong>。</li>
<li>A 接 <code>环境纹理.颜色</code>，B 设一个<strong>颜色</strong>（我配的是深蓝调，像影院冷光）。</li>
<li><strong>系数（Fac）</strong>就是叠色强度：<code>0.5</code> 轻微、<code>0.7</code> 明显、<code>1.0</code> 完全替换成 B 色调。我最终落在 <code>0.696</code>（≈0.7）。</li>
</ul>
<blockquote><strong>✓ 验收</strong>：画面整体压暗、染上统一色调，暗部更沉、更像「放映」而不是「贴图」。纯技术指标：画面亮度峰值不超过 1.0（不过曝）。</blockquote>
<img src="assets/projector/09.webp" alt="正片叠底插在环境纹理和自发光之间，系数 0.696" loading="lazy" />
<p><em>正片叠底插在环境纹理和自发光之间——本质上就是给投影仪加了一片「色温滤镜」。系数 0.696 + 深蓝色 B：冷调氛围出来了，画面像被放映机的光「浸」过。</em></p>

<h2>08 · 第六步：静态图换成电影</h2>
<p>前面全部调通后，换动态素材只是「换个文件」：</p>
<ul>
<li>环境纹理点「打开图像」，选你的 <code>mp4</code>。</li>
<li>纹理下方的<strong>源</strong>从「单张图像」切换成<strong>影片</strong>——会多出四个参数。</li>
<li>填参数：<strong>帧数 = 视频总帧数</strong>（如 900），<strong>起始帧 = 1</strong>，<strong>偏移 = 0</strong>，<strong>勾选自动刷新</strong>。</li>
<li>时间轴<strong>结束帧改成 900</strong>（覆盖视频长度），拖时间轴——幕布上的电影开始播放。</li>
</ul>
<table><thead><tr><th>参数</th><th>值</th></tr></thead><tbody>
<tr><td>源</td><td>影片</td></tr>
<tr><td>帧数</td><td>900（视频总帧数）</td></tr>
<tr><td>起始帧</td><td>1</td></tr>
<tr><td>偏移</td><td>0</td></tr>
<tr><td>自动刷新</td><td>✓</td></tr>
<tr><td>色彩空间</td><td>sRGB</td></tr>
</tbody></table>
<blockquote><strong>帧号规则（唯一要背的公式）</strong>：时间轴第 N 帧 = 视频第 <code>N − 起始帧 + 偏移</code> 帧。起始帧 1、偏移 0 → 一一对应。<strong>想让电影晚 3 秒出现？起始帧改 91（30fps×3s+1）。</strong>想让电影掐头 5 秒？偏移改 150。</blockquote>
<img src="assets/projector/10.webp" alt="源切影片后多出的四个参数：帧 900 / 起始帧 1 / 偏移 0 / 自动刷新" loading="lazy" />
<p><em>源切「影片」后多出的四个参数：帧 900 / 起始帧 1 / 偏移 0 / 自动刷新。</em></p>
<img src="assets/projector/11.webp" alt="时间轴 118 帧：幕布上正在播第 118 帧的画面" loading="lazy" />
<p><em>时间轴 118 帧：幕布上正在播第 118 帧的画面。时间轴就是播放器的进度条。</em></p>
<blockquote><strong>自动刷新的性能税</strong>：开着它，视口<strong>每一帧都会重新解码一遍视频</strong>，弱机会卡。形状调完之后可以关掉（画面会停在当前帧），<strong>渲染输出前再打开</strong>。</blockquote>

<h2>09 · 第七步：加上同步的声音</h2>
<ul>
<li><code>Shift+A → 声音 → 扬声器（Speaker）</code>。场景里出现一个小喇叭图标——把它<strong>挪到灯旁边</strong>，让声音从「投影仪」方向传来（空间音频逻辑自洽）。</li>
<li>选中它，右侧物体属性 → 声音 → 打开<strong>同一个 mp4</strong>。</li>
<li>音量 1.0、间距 1.0，衰减区保持默认。</li>
<li>按空格播放——画面和声音一起走。</li>
</ul>
<blockquote><strong>✓ 验收</strong>：播放时，幕布电影和声音<strong>口型/动作/音效完全同步</strong>。因为画面和声音都由同一条时间轴驱动、读同一个文件、起点都是 0——这是结构性同步，不是对齐出来的。</blockquote>
<img src="assets/projector/12.webp" alt="扬声器加载同一个 mp4，音量 1.0 / 间距 1.0" loading="lazy" />
<p><em>第七步 · 扬声器加载同一个 mp4，音量 1.0/1.0，衰减 1.0。物体摆到灯旁边，声音从「投影仪」方向传来。</em></p>
<blockquote><strong>为什么不用视频编辑器（VSE）加声音</strong>：VSE 的声音在<strong>渲染动画时不输出</strong>（除非用 ffmpeg 插件混流）。Speaker 是场景物体，混音跟着动画帧走，是<strong>3D 场景内声音</strong>的标准答案——还白送空间音频（离喇叭越近声音越大）。</blockquote>

<h2>10 · 第八步：渲染输出</h2>
<table><thead><tr><th>项目</th><th>值</th></tr></thead><tbody>
<tr><td>分辨率</td><td>1920 × 1080 · 100%</td></tr>
<tr><td>帧率</td><td>30 fps（与视频源一致）</td></tr>
<tr><td>帧范围</td><td>1 → 900</td></tr>
<tr><td>格式</td><td>PNG · 8bit</td></tr>
<tr><td>输出路径</td><td>桌面（自定）</td></tr>
<tr><td>采样</td><td>≤ 64（有体积别开高）</td></tr>
</tbody></table>
<ul>
<li>确认<strong>自动刷新已开启</strong>（否则渲染出的每一帧都是同一画面）。</li>
<li>顶栏 <code>渲染 → 渲染动画（Ctrl+F12）</code>，输出 PNG 序列。</li>
<li>合成成品：PNG 序列 + 原视频的声音，丢进 ffmpeg 或任意剪辑软件合流。</li>
</ul>
<pre><code>ffmpeg -framerate 30 -i proj_%04d.png -i BLV.mp4 -c:v libx264 -pix_fmt yuv420p -shortest out.mp4</code></pre>
<blockquote><strong>✓ 验收</strong>：成品 mp4 里——电影在幕布上播放、声音同步、光柱轻微呼吸（体积噪点）、地面有画面反射的映光。<strong>一台完整的投影仪交付。</strong></blockquote>
<img src="assets/projector/13.webp" alt="输出面板全景：1920×1080、30fps、帧范围 1–900、PNG 8bit" loading="lazy" />
<p><em>输出面板全景：1920×1080、30fps、帧范围 1–900、PNG 8bit。</em></p>

<h2>11 · 排查手册：症状 → 病因 → 药方</h2>
<table><thead><tr><th>症状</th><th>最可能病因</th><th>药方</th></tr></thead><tbody>
<tr><td>幕布上没有画面</td><td>线没接对</td><td>检查 <code>环境纹理.颜色 → 自发光.颜色</code> 是否接上；灯功率是否被调到 0</td></tr>
<tr><td>画面是圆形的</td><td>没做鱼眼校正</td><td>补上 分离XYZ → 相除X/Z·Y/Z → 合并XYZ 链（第二步 4.2 节）</td></tr>
<tr><td>画面是矩形但不在幕布上</td><td>映射没调</td><td>按口诀：先缩放（调小=放大）铺满，再位置居中</td></tr>
<tr><td>画面比例不对，有黑边</td><td>缩放 X/Y 未匹配幕布比例</td><td>单独微调 X 或 Y（我终值缩放 2.350、位置 0.5/0.5）</td></tr>
<tr><td>画面是镜像/颠倒的</td><td>相除后坐标轴向问题</td><td>映射节点里给 X 或 Y 的缩放<strong>取负值</strong>翻转</td></tr>
<tr><td>换成视频后画面不动</td><td>① 源没切「影片」② 自动刷新没勾 ③ 时间轴没播放</td><td>三项依次检查。渲染前尤其确认 ②</td></tr>
<tr><td>视频播一半定格</td><td>时间轴结束帧 &lt; 视频总帧数</td><td>时间轴结束帧 ≥ 视频帧数（900）</td></tr>
<tr><td>有画面没声音</td><td>① Speaker 没加载文件 ② 时间轴没在播放模式</td><td>检查 Speaker 声音文件；播放用空格（Scene 播放），不是视口回放</td></tr>
<tr><td>音画不同步</td><td>起始帧不一致</td><td>画面与声音的起始帧必须相同（都为 1）；别只改一边的偏移</td></tr>
<tr><td>光柱是实心白筒</td><td>体积密度太大</td><td>密度除以 10，直到光柱透明（我落在 0.032）</td></tr>
<tr><td>体积根本看不见</td><td>① 锥体没罩住光锥 ② 体积接到了表面口 ③ 灯功率太低</td><td>对位锥体；确认接「体积」口；加大灯功率</td></tr>
<tr><td>渲染出的视频画面全一样</td><td>渲染时自动刷新未开</td><td>开启后重新渲染（已渲的帧不用重渲，PNG 序列的好处）</td></tr>
<tr><td>渲染极慢</td><td>体积 + 高采样</td><td>采样 ≤64；光柱只在必要镜头出现；去噪开 OpenImageDenoise</td></tr>
</tbody></table>

<h2>12 · 参数速查卡 + 延伸玩法</h2>
<h3>全参数一表流（我的实测场景，照抄即可起步）</h3>
<table><thead><tr><th>位置</th><th>参数</th><th>值</th></tr></thead><tbody>
<tr><td>灯（Spot）</td><td>功率</td><td>50 W（投画面；做光柱的第二盏灯实测 119W）</td></tr>
<tr><td>灯（Spot）</td><td>自发光强度</td><td>25（跟着素材亮度走，加正片叠底后我调到 352）</td></tr>
<tr><td>灯（Spot）</td><td>光锥尺寸 / 混合</td><td>40°（投矩形画面）/ 1.0；照光柱的灯用 78.5°</td></tr>
<tr><td>灯（Spot）</td><td>半径（软阴影）</td><td>0 → 渲染嫌硬再给一点</td></tr>
<tr><td>灯（Spot）</td><td>阴影分辨率</td><td>1024</td></tr>
<tr><td>映射节点</td><td>位置 X/Y/Z</td><td>0.5 / 0.5 / 0（按幕布居中为准）</td></tr>
<tr><td>映射节点</td><td>旋转 X/Y/Z</td><td>0° / 0° / 15°（画面摆正为准，我实测从 180° 调到 15°）</td></tr>
<tr><td>映射节点</td><td>缩放 X/Y/Z</td><td>2.350 / 2.350 / 2.350</td></tr>
<tr><td>环境纹理</td><td>源 / 帧数 / 起始帧 / 偏移</td><td>影片 / 900 / 1 / 0</td></tr>
<tr><td>环境纹理</td><td>自动刷新 / 色彩空间 / 插值</td><td>✓ / sRGB / 线性·平直·裁剪</td></tr>
<tr><td>正片叠底</td><td>系数 / B 色</td><td>0.696 / 深蓝（影院冷调）</td></tr>
<tr><td>锥体体积</td><td>密度</td><td>0.032（实测）</td></tr>
<tr><td>Speaker</td><td>音量 / 间距 / 衰减</td><td>1.0 / 1.0 / 1.0（默认）</td></tr>
<tr><td>输出</td><td>分辨率 / 帧率 / 范围 / 格式</td><td>1920×1080 / 30fps / 1–900 / PNG 8bit</td></tr>
</tbody></table>

<h3>节点拓扑速查</h3>
<table><thead><tr><th>链路</th><th>连线</th></tr></thead><tbody>
<tr><td>坐标链</td><td>纹理坐标.生成 → 分离XYZ → (X÷Z, Y÷Z) → 合并XYZ → 映射.矢量</td></tr>
<tr><td>画面链</td><td>映射.矢量 → 环境纹理.矢量；环境纹理.颜色 → 正片叠底.A → 自发光.颜色</td></tr>
<tr><td>体积链</td><td>原理化体积 → 材质输出.体积（挂在锥体上，与灯无关）</td></tr>
<tr><td>声音链</td><td>Speaker 物体 ← 同一个 mp4（无节点，物体属性面板配置）</td></tr>
</tbody></table>

<h3>同一套手法还能做什么</h3>
<p>「灯 = 投影仪」是一把万能钥匙，画面可以是任何图、任何视频：</p>
<table><thead><tr><th>玩法</th><th>换什么</th></tr></thead><tbody>
<tr><td>窗外的树影摇曳</td><td>环境纹理换成一张黑白树影图，灯在窗外斜打进来；视频版就是风吹树影</td></tr>
<tr><td>霓虹招牌滚动字幕</td><td>投影内容换成带透明通道的动图/视频，墙就是招牌面</td></tr>
<tr><td>舞台追光打 Logo</td><td>静态 Logo 图 + 窄光锥（光锥尺寸 20° 左右），灯做摇摆关键帧</td></tr>
<tr><td>汽车大灯扫过墙面</td><td>灯挂在车上跟着车动，投影画面用椭圆渐变（模拟灯碗形状）</td></tr>
<tr><td>老电视闪烁</td><td>把「正片叠底」的 B 色随时间做噪波关键帧，画面产生放映机式的呼吸</td></tr>
</tbody></table>

<blockquote><strong>收尾的话</strong>：这套东西的精髓不在那几个参数——参数永远跟着你的场景变。精髓是三层结构：<strong>灯吃图像 = 投影仪，体积吃锥体 = 可见光路，时间轴吃 mp4 = 放映</strong>。把这三层记住，下次哪怕是「透过毛玻璃看霓虹闪烁」这种怪需求，你也能自己推出来怎么做。</blockquote>
<p><em>原理图解、调参口诀、排查手册为原创整理。</em></p>`
    },

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

<h3>先说结论：这篇能带走什么</h3>
<ul>
<li><strong>零构建不等于零优化</strong>：省掉构建步骤，但关键 CSS、字体加载和缓存指纹仍要主动处理。</li>
<li><strong>撞色的核心是约束，不是选色</strong>：限死 60/30/10 的比例与强调色出现次数，颜色才会「pop」而不是糊成一片。</li>
<li><strong>诊断要量不要猜</strong>：用 CDP 直接问浏览器「动画在跑吗、有没有横向溢出」，比截图目测可靠得多。</li>
<li><strong>给改造留退路</strong>：旧样式一行不删、覆盖前先备份并记下回滚锚点，才敢在老站上大改。</li>
</ul>
<p>如果你只想快速判断这套做法适不适合自己：看第 06 节的 15 个坑和第 09 节的三条经验；关心设计决策的可以跳读第 02、03 节。</p>

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
<li><strong>动效</strong>：星球六组动画、滚动入场、鼠标视差、点击星点与样条线，以及 hero 与档案区之间的手绘三线分隔（黄粉虚线流动 + 中心星芒呼吸）。克制留白优先：早期那四个漂浮装饰和满幅色带波浪已移除，因为收窄后会变成悬在留白里的突兀色块。</li>
</ul>
<p>性能上有个克制：手绘抖动滤镜只给静态封面、小涂鸦和短命的点击线，不给动画元素 —— 否则每帧重算 feTurbulence，刚修好的卡顿会立刻回来。</p>

<h2>05 · 技术实现</h2>
<p><strong>零构建数据层</strong>：<code>posts.js</code> 暴露 BLOG_META 与 BLOG_POSTS，渲染引擎负责网格、筛选、全文搜索、排序、编号、阅读层与上下篇。加文章只需复制一个对象。</p>
<p><strong>三态路由</strong><em>（让每个视图都能被链接直达，且弹层关掉后不把你丢回首页）</em>：hash 托管首页 / 分类 / 文章详情 / 关于 / 404 彩蛋；Wander 唤起门扉不改 hash，从文章页点开彩蛋关掉后仍停在那篇文章。</p>
<p><strong>主题后置覆盖</strong><em>（新主题盖在旧稿之上，一行不删，随时能一键退回，不用推倒重来）</em>：<code>theme.css</code> 在 head 末尾引入覆盖内联暗色样式，旧暗色稿成为可回退底稿。</p>
<p><strong>性能开关</strong>：亮色主题下不启动 180 粒子循环、不做全屏 blur(25px)、不做逐帧 3D 倾斜；移除 link 回退暗色时三者自动恢复。</p>
<p><strong>手绘封面</strong>：6 套基础 SVG 图案 × 按 slug 派生的镜像、旋转、星点位置 —— 展开后 13 张全唯一，新增文章不用单独画图。</p>

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
数据    13 篇 / 7 栏目 / 4 篇精选 / 无重复 slug
渲染    首页 / 详情 / #404 彩蛋 / 独立档案页 四态通过
响应式  1440 与真实 390px：scrollW === inner，零溢出
封面    展开后 13 张全唯一
动效    10 组 animation running，周期 2.6s / 3.4s
分隔线  手绘三线 + 中心星芒，宽度对齐正文（1440 / 1100 / 390）
点击    scribbles=1 paths=3 sparks=6 rings=1
性能    Canvas 循环已停 / overlayBlur=none
双击    file:// 完整渲染
远程    逐字节一致，community profile 四件套就位</pre>
<p>这些数字不是摆设：<strong>语法零错误</strong>意味着没靠浏览器容错兜底，不会「本地好好的线上崩」；<strong>scrollW === inner</strong>意味着手机端没有隐藏的横向溢出，不会出现页面能左右晃的廉价感；<strong>13 张封面全唯一</strong>意味着列表页没有重复视觉，每篇第一眼都是独立的。</p>
<p>验收方式本身也是经验：<strong>CDP 行为级验收</strong>（直接问浏览器「动画真的在跑吗、有没有横向溢出」，而不靠截图目测）—— 用 computed style、getAnimations、DOM 计数与 scrollWidth 取证，上面第 3、4、5、9 条都是这么抓到的。这套取舍基于本站的内容密度与动效预算；动效更重的站点需要重新评估。</p>

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
    },

    {
        slug: 'npr-outline-methods',
        title: '三渲二描边效果 · 七种做法实录',
        subtitle: '菲涅尔 / 实体化外扩 / 蜡笔画 / Freestyle / 边缘检测 / 几何节点 / 射线检测',
        date: '2026-11-11',
        category: 'tutorials',
        tags: ['三渲二', '描边', 'Blender'],
        readTime: 6,
        featured: false,
        excerpt: '从菲涅尔混合到 5.2 的光线透射节点，把七种描边方案的做法、坑点和效果截图一次收齐。原笔记以图为主，这里保留全部 9 张效果图。',
        content: `<h2>第一种通过加入菲涅尔系数添加</h2>
<p>直接在基础三渲二材质节点上添加菲涅尔系数与之混合<img src="assets/outline-01.png" alt="Pasted image 20261111204202.png" loading="lazy" /><img src="assets/outline-02.png" alt="Pasted image 20261111204222.png" loading="lazy" /><img src="assets/outline-03.png" alt="Pasted image 20261111204234.png" loading="lazy" /></p>
<h2>第二种方式实体化创建厚度外扩</h2>
<p>创建实体化修改器至于最上方，勾选翻转和添加材质偏移<img src="assets/outline-04.png" alt="Pasted image 20261111204458.png" loading="lazy" />新建槽二描边材质，设置中剔除摄像机和阴影<img src="assets/outline-05.png" alt="Pasted image 20261111204447.png" loading="lazy" /></p>
<h2>第三种添加蜡笔画</h2>
<p>蜡笔画修改器至于最上方，后续通过添加噪波、多个笔画、色调修改器调整描边。</p>
<p>注意蜡笔画效果基于摄像机视角产生且添加后容易卡死 &#x27;&#x27;空洞骑士大黄蜂中使用的为集合蜡笔画效果&#x27;&#x27;</p>
<h2>第四种Freestyle</h2>
<p>在渲染中勾选Freestyle只会出现在渲染结果中！！视图层不会出现</p>
<p><img src="assets/outline-06.png" alt="Pasted image 20261111204811.png" loading="lazy" /></p>
<p>线条集确认描边显示范围</p>
<h2>第五种边缘检测（属于后期合成的范畴）先要渲染好一个图像或动画</h2>
<p>会检测出所有边缘<img src="assets/outline-07.png" alt="Pasted image 20261111204827.png" loading="lazy" /></p>
<h2>第六种几何节点</h2>
<p><img src="assets/outline-08.png" alt="Pasted image 20261111204846.png" loading="lazy" /></p>
<p><img src="assets/outline-09.png" alt="Pasted image 20261111204853.png" loading="lazy" /></p>
<h2>第七种射线检测版本5.2更新的光线透射节点</h2>
<p>在cycles引擎中使用</p>
<p>太复杂了不学了！！！！</p>`
    },

    {
        slug: 'blender-ai-agent-mcp',
        title: 'Blender AI Agent 自动建模搭建流程',
        subtitle: 'Windows + Codex + MCP：从装 uv 到第一次自动建模',
        date: '2026-10-11',
        category: 'lab',
        tags: ['MCP', 'AI Agent', 'Blender'],
        readTime: 12,
        featured: false,
        excerpt: '自然语言驱动 AI 操作 Blender 的完整落地记录：整体架构、uv 与 mcp-for-blender 安装、Codex 里配 STDIO 服务、第一次自动建模测试。',
        content: `<p>目标：通过自然语言驱动 AI Agent 自动操作 Blender，实现自动建模、修改、渲染。</p>
<p>环境： - 操作系统：Windows - Blender：5.2.2 LTS - AI 客户端：Codex - MCP 服务：mcp-for-blender - 用户基础：无需编程基础</p>
<h2>1. 整体架构</h2>
<pre><code>用户自然语言指令
        |
        v
Codex AI Agent
        |
        v
MCP Server (mcp-for-blender)
        |
        v
Blender MCP 插件
        |
        v
Blender Python API
        |
        v
3D模型 / 材质 / 灯光 / 渲染结果</code></pre>
<p>工作逻辑：</p>
<ul><li>用户描述需求。</li><li>AI Agent 理解任务。</li><li>AI 调用 Blender MCP 工具。</li><li>MCP 将命令传递给 Blender。</li><li>Blender 执行建模操作。</li></ul>
<h2>2. 安装准备</h2>
<h2>安装 Blender</h2>
<p>下载并安装 Blender：</p>
<ul><li>官方地址： https://www.blender.org/download/</li></ul>
<p>建议版本：</p>
<pre><code>Blender 5.2 LTS</code></pre>
<h2>3. 安装 uv 环境</h2>
<p>打开 Windows PowerShell：</p>
<p>执行：</p>
<pre><code>powershell -c &quot;irm https://astral.sh/uv/install.ps1 | iex&quot;</code></pre>
<p>检查：</p>
<pre><code>uvx --version</code></pre>
<p>如果显示版本号，说明安装成功。</p>
<h2>4. 安装 Blender MCP</h2>
<p>执行：</p>
<pre><code>uvx mcp-for-blender install-addon</code></pre>
<p>作用：</p>
<ul><li>安装 Blender MCP 插件</li><li>建立 AI 与 Blender 的通信能力</li></ul>
<h2>5. 启动 MCP Server 测试</h2>
<p>PowerShell 执行：</p>
<pre><code>uvx mcp-for-blender</code></pre>
<p>成功状态：</p>
<pre><code>BlenderMCPServer - INFO
Connected to Blender at localhost:9876

Successfully connected to Blender on startup</code></pre>
<p>说明：</p>
<p>✅ MCP 服务启动成功 ✅ Blender 插件连接成功</p>
<h2>6. Codex 添加 MCP 服务</h2>
<p>进入：</p>
<pre><code>Codex
→ 设置
→ MCP
→ 添加自定义 MCP</code></pre>
<p>填写：</p>
<p><strong>名称</strong></p>
<pre><code>blender</code></pre>
<p><strong>类型</strong></p>
<pre><code>STDIO</code></pre>
<p><strong>启动命令</strong></p>
<pre><code>uvx</code></pre>
<p><strong>参数</strong></p>
<pre><code>mcp-for-blender</code></pre>
<p><strong>工作目录</strong></p>
<p>例如：</p>
<pre><code>C:\\Administrator\\Documents\\Codex</code></pre>
<h2>7. MCP 配置完成后的状态</h2>
<p>正确配置：</p>
<pre><code>启动命令:
uvx

参数:
mcp-for-blender</code></pre>
<p>保存后：</p>
<p>重新启动 Codex。</p>
<h2>8. 第一次测试</h2>
<p>不要直接创建复杂模型。</p>
<p>先测试：</p>
<pre><code>连接 Blender，读取当前场景信息。</code></pre>
<p>正常返回：</p>
<pre><code>Camera
Light
Cube</code></pre>
<p>代表：</p>
<pre><code>Codex
 |
MCP
 |
Blender</code></pre>
<p>通信成功。</p>
<h2>9. 第一次自动建模测试</h2>
<p>发送：</p>
<pre><code>请控制 Blender 创建一个红色立方体，
放置在原点位置，并保存工程。</code></pre>
<p>成功表现：</p>
<ul><li>Blender 自动生成 Cube</li><li>Cube 材质变为红色</li><li>文件自动保存</li></ul>
<h2>10. 创建复杂模型示例</h2>
<p>示例任务：</p>
<pre><code>请使用已连接的 Blender MCP 工具，直接在 Blender 中创建一个完整的低多边形小木屋场景，不要只向我解释步骤。
 要求：
 
 1. 先检查当前场景，并保留或清理默认物体，避免重复创建。
 2. 使用基础网格构建一栋小木屋：米黄色墙壁、深红色双坡屋顶、棕色木门、两扇蓝色玻璃窗。
 3. 添加绿色草地、几块石头和两棵简化的低多边形树。
 4. 给不同物体创建合适的材质，并为关键边缘添加适度倒角。
 5. 设置柔和的太阳光、世界背景和 3/4 视角的正交摄像机。
 6. 使用 Eevee 渲染器，输出一张 1280×720 的预览图。
 7. 执行建模后检查场景，确认物体、材质、摄像机和灯光存在；发现问题时修复并重新渲染。
 8. 将工程保存为用户文档目录下的 Blender_AI_Test/cottage.blend，并将预览图保存为同目录下的 cottage.png。
 9. 每完成一个阶段，简要报告执行结果；保存文件前确认目标路径和文件是否存在。     
 
 请直接调用工具执行，不要仅生成 Python 代码让我手动运行。</code></pre>
<p>AI Agent 会自动：</p>
<pre><code>需求分析
 ↓
生成建模步骤
 ↓
调用Blender工具
 ↓
创建模型
 ↓
检查结果
 ↓
修改优化
 ↓
保存文件</code></pre>
<h2>11. 常见问题</h2>
<h2>问题1：uvx 找不到</h2>
<p>解决：</p>
<p>重新打开 PowerShell。</p>
<p>检查：</p>
<pre><code>where uvx</code></pre>
<h2>问题2：MCP连接失败</h2>
<p>检查：</p>
<ul><li>Blender 是否打开</li><li>MCP 插件是否启用</li><li>Codex 是否重新启动</li></ul>
<h2>问题3：AI只生成代码，不操作 Blender</h2>
<p>原因：</p>
<p>MCP 工具没有加载。</p>
<p>解决：</p>
<p>检查 Codex MCP 状态。</p>
<h2>12. 安全建议</h2>
<p>AI 可以通过 Blender Python 执行操作。</p>
<p>建议：</p>
<ul><li>使用测试目录</li><li>重要工程提前备份</li><li>不允许未知脚本删除文件</li><li>不开放 MCP 服务到公网</li></ul>
<h2>13. 当前完成状态</h2>
<p>截至目前：</p>
<p>✅ Blender 已安装 ✅ MCP 插件已安装 ✅ MCP Server 已启动 ✅ Blender 通信成功 ✅ Codex MCP 配置完成</p>
<p>下一步：</p>
<p>完成 Codex 与 Blender 的最终调用测试。</p>
<p><strong>后续升级方向</strong></p>
<p><strong>初级</strong></p>
<p>文字 → Blender模型</p>
<p><strong>中级</strong></p>
<p>图片 → 3D模型</p>
<p><strong>高级</strong></p>
<p>AI Agent 自动：</p>
<ul><li>建模</li><li>UV展开</li><li>材质制作</li><li>灯光设计</li><li>渲染</li><li>导出游戏资产</li></ul>`
    }

];
