# Validation record

## 计算视觉与交互体验升级 — 2026-09-29

基于已有未提交的浏览交互工作继续实现。下方“本地待审核”章节保留其当时状态，属于历史记录。本节描述最终组合版本；内容数据、文字、路由、图片顺序、静态导出和 Pages 配置保持不变。

### 本轮实际修改

- `components/research-graph.tsx`（新增）：以原节点—路径语言扩展固定 16 节点示意图，三个组明确映射已有 research ID，标签取自原始标题；紧凑标记和主图复用同一结构。小型客户端包裹监听真实链接，跟随最新指针或键盘操作增强对应节点与路径，移开后恢复。SVG 为 `aria-hidden`，不进入键盘导航，不表示实际研究数据。
- `app/research-graph.css`（新增）：统一浅色/深色图形，主要节点和路径默认清晰；仅增强选中组，不隐藏其他组。过渡使用 180ms 状态变量，减少动态时保留状态但取消过渡。
- `app/research.css`（新增）：首页上方标题与关系图、下方三个研究卡片；Research 内页紧凑深色页头及三个真实方向锚点，下方长文保留浅色。761px 起三张等宽卡片，760px 及以下自然单列；主关系图在手机保留。
- `components/pages.tsx`：组合展示区、图形及原有卡片；向真实链接添加明确的研究 ID，标签、标题和序号全部由现有数据读取。原卡片链接目标不变。
- `components/ui.tsx`：移除被统一组件替代的旧小图形，增加三种节点/几何线性图标；不添加标签或技术能力文案。
- `app/globals.css`：集中新增深色展示区的四个颜色变量、180ms 按压时长；Research 卡片改为细边框、白色表面和既有圆角，保留键盘焦点。Learning 等说明卡片没有新增点击行为。
- `app/editorial.css`：Focus Strip 改用共享图形紧凑版，按钮时长引用统一变量；原照片定位、手动轮播和桌面滚动缩放保持不变。
- `app/experience.css`：页头收紧，增加连续细轨道、清晰日期、白色细边框条目表面及当前状态；手机轨道放入外侧留白，不挤压正文。文章没有按压或悬停按钮效果。
- `components/reading-motion.tsx`：将已实现的一次性入场选择器适配新 Research 包裹层，保留可见性、快速滚动、键盘、锚点和恢复处理。
- `components/shell.tsx`：引入两份研究专用样式，保持服务器正文与静态输出。
- `docs/VALIDATION.md`：本次实现、验证和复现说明。

本轮原样保留上轮 `components/photo-carousel.tsx`、`components/experience-browser.tsx` 的滚动缩放、原生锚点与 BFCache 修复，最终发布包含这些已验证的未提交实现。没有添加运行时依赖、视频/序列帧、外部字体请求或虚构资源路径。Inter / IBM Plex Sans 仍是优先字体名称，实际使用设备可用的系统回退，不声称已加载对应字体文件。

### 检查与证据

- 修改前和最终生产构建均通过，生成 23 个静态页面；`npm run typecheck`、`npm run check:content`、`npm run format:check`、`git diff --check` 通过。项目没有 lint/test 脚本，未安装新的测试或动画框架。
- 全站 `../audit-current.cjs computational-upgrade-all`：18 个中英文页面 × 375/768/1440px，共 54 组，通过；无横向溢出、缺图、浏览器异常、失败资源或失效内部地址。轮播和菜单保持可用。
- 新专项及截图位于 `../previews/audit-computational-upgrade/`；原始基线只读保留。默认静态关系图、主题对比、手机可见性、真实链接与方向反馈分别核验，不以截图代替交互测试。
- 专项最终覆盖 102 个中英文视图、110 组交互、1,520 条断言，0 失败；正常模式另抽查 640/641/760/761/900/901/1100/1101px 边界。正文、原链接与 ID 保持，浅深主题、手机图形、悬停/聚焦/恢复、减少动态及无 JavaScript 均通过；18 次禁用 JS 的预期脚本拒绝单独记录，无非预期资源或浏览器错误。最初七项失败来自审计先聚焦顶部导航造成的尚未结束的平滑滚动，改用 `focus({preventScroll:true})` 并等待状态过渡后定向复测通过；初次和重跑报告均保留，没有为测试改动产品滚动行为。
- 最终入场与缩放复测：1440px 英文研究卡片各播放一次，560ms / 0、70、140ms 延迟；375px 中文逐条播放一次。首页桌面照片 1.03→1，手机与减少动态始终为 1；真实按钮按压 0.98、180ms 恢复，减少动态不缩放。中页刷新内容完整，原生恢复位置误差最多 1px，照片缩放与实际位置一致。见 `sequence-report.json`。
- 定向混合输入七步通过：鼠标停在方向 A 时按 Tab 到 B，图形跟随 B；再次移动鼠标可切回 A；移出恢复现存焦点；真实点击继续原生锚点导航。375/768px、中英文图形标签无越界或节点重叠，实测标签字号约 11.61/12.51px。证据位于 `../previews/audit-research-graph-targeted/`。
- 初始化故障四组全部通过：Research / Experience 入场 Observer、Experience ResizeObserver、Hero 媒体查询初始化失败后，正文与正常基线相同，原生链接和轮播可用，无页面异常。
- 真实 BFCache 复测通过：先打开第一条锚点，再手动滚到第三条，离开并后退；`pageshow.persisted=true`，恢复 scrollY=498 和第三条当前状态，URL 中旧第一条 hash 不干扰阅读位置。第二、第三条锚点的前进后退也通过。

### 预览与复现

使用现有命令 `npm run preview -- --port 4185 --base /zhongshengluo06`。

1. 打开 `http://127.0.0.1:4185/zhongshengluo06/en/`，原生滚过首屏，照片约 1.03→1；姓名、介绍及按钮始终可用。研究区鼠标悬停三张卡片或用 Tab 聚焦，观察对应图形组增强。
2. 打开 `/zhongshengluo06/en/research/`，在深色页头的三个方向链接间悬停、Tab、Enter；图形状态关联最新操作，点击仍进入原详情锚点。切中文后重复。
3. 打开 `/zhongshengluo06/zh/experience/#data-administration`，检查目标在导航下方立即可见；桌面向下读，索引/节点跟随，前进后退保持原生行为。375px 下文章自然单列，日期在标题上方。
4. 开启减少动态或禁用 JavaScript 后刷新，正文和静态图形仍然完整，原生锚点可用；减少动态时关闭缩放、位移和路径过渡。

录屏能力仍缺少 Playwright 所需的 `ffmpeg-1011/ffmpeg-win64.exe`，未生成视频，也未为此安装依赖。提供真实状态报告和桌面/手机截图，按以上步骤可复现。本次使用本机 Edge/Chromium 验证；真实 iOS/Safari 设备仍未实测。

## 浏览交互动效（本地待审核）— 2026-09-29

起点是已发布的 `577e6f2`，开始时工作树干净。保留既有视觉系统、文案、数据与摄影，只增加本轮授权的浏览反馈。以下全部为本地验证；本轮没有 commit、push 或触发 Pages 部署。

### 实际文件与行为

- `components/experience-browser.tsx`（新增）：接收服务器从原经历数据提取的 ID、日期、标题及原始文章 children。桌面真实锚点索引使用 `aria-current="location"` 表示当前经历；被动 scroll + rAF 跟踪阅读位置，不调用 history API、不拦截滚轮或触摸。原生 hash、前进后退、直接锚点保留；BFCache 恢复优先跟随实际阅读位置，而不是重新锁定旧 hash。
- `app/experience.css`（新增）：240px 上限的紧凑索引与展开正文，sticky 限制在经历网格内；900px 及以下隐藏重复索引，正文自然单列。当前节点与边线变化，不降低其他文章透明度；`:target` 立即提供浅底/边线提示。没有满屏条目、人为滚动高度、空白占位或弹窗。
- `components/pages.tsx`：仅用上述组件包裹原有 timeline，传入现有标题和日期；三条原文章的 ID、文字、顺序、日期及子结构保持不变。
- `components/reading-motion.tsx`（新增）：小型客户端增强控制器。Research 标题、首页研究卡片、研究内页与经历条目按进入视口播放一次：16px 位移、560ms、同组间隔 70ms；瞬态 opacity 为 0.86–1，正文从未有默认隐藏状态。使用 IntersectionObserver / Web Animations API，不向服务器内容组件传递客户端渲染要求。
- `components/photo-carousel.tsx`：仅为既有 picture 层计算桌面原生滚动进度，照片由 1.03 缩至 1。保留所有图像来源、加载属性、取景与手动轮播，不自动切图；媒体偏好变化、恢复页面与 resize 会同步状态，取消增强后恢复 scale 1。
- `app/editorial.css`：缩放仅作用于大于 900px 且未要求减少动态的 picture 层，裁剪容器与既有 img transform 独立。两张人物照片已目视核对，姓名、介绍、按钮不参与开场动画。补齐首屏反色按钮、轮播箭头的键盘聚焦反馈与按压过渡。
- `app/globals.css`：真实按钮与轮播控件轻按压 scale 0.98，140ms 恢复；键盘焦点有同等颜色与轮廓反馈。不使用 `transition: all`，普通说明卡片不增加按压或导航行为；减少动态模式关闭新增位移/缩放，同时关闭既有文字链接箭头的小位移。
- `components/shell.tsx`：引入经历页局部样式和无界面增强控制器，保持原静态导出及服务器页面结构。
- `docs/VALIDATION.md`：本轮实现、验证、复现方式和限制记录。

### 可见性与恢复边界

HTML 与 CSS 默认呈现全部正文。无 JavaScript、缺少增强 API、动效初始化失败时不需要等待脚本解除隐藏；动态偏好切换会取消正在播放的动画。直接目标、键盘焦点、恢复到页面中部的可见内容优先直接显示。快速滚动取消尚在播放的入场，已出现条目不因反向滚动重播。

修复并实测两处边界：浏览器后退使用 BFCache 时跟随恢复视口；增强初始化异常由局部保护和清理处理，不进入 React 错误页。没有增加动画框架、媒体资源、网络服务或字体请求。

### 验证记录

- 最终 `npm run build`、`npm run typecheck`、`npm run check:content`、`npm run format:check` 和 `git diff --check` 通过。生产构建保持 23 个静态生成页面，继续使用原 `/zhongshengluo06` 前缀。
- 原全站审计 `../audit-current.cjs motion-final`：18 个中英文页面 × 375/768/1440px，共 54 组；无布局溢出、缺图、控制台错误或异常资源请求，内部目的地址全部返回 200。
- 专项 `../audit-motion.cjs` 检查首页、Research、Experience 的中英文与三个宽度，并分别测试正常动态、减少动态、关闭 JavaScript。记录真实浏览器动画帧、滚动、原生历史、锚点直达与键盘操作；报告位于 `../previews/audit-motion/report.json`，不是仅用截图证明交互。
- 专项最终共 54 组页面、70 组交互、480 条断言，0 失败，记录到 1,892 帧实际播放状态。修正审计中把 scale 1 的单位矩阵误判为运动、把禁用 JavaScript 导致的预期脚本拒绝当成网络故障后，定向重跑全部 18 组 no-JS；原始与重跑报告及合并来源均保留。30 次明确的 no-JS 脚本 CSP 拒绝单独记录，正常页面没有非预期资源失败。
- 原有正文、链接目标与基线比较一致；Experience 仅增加从既有数据生成的索引文字和三个本页锚点，未修改原内容。减少动态时无入场动画/滚动缩放；无 JavaScript 时正文和真实锚点可用，照片保持原尺寸。
- 独立 BFCache 实测：1440×900，进入第一条 hash 后手动滚至第三条（scrollY=551），跳到 Research 再后退，真实触发 `pageshow.persisted=true`；恢复位置与当前索引仍为第三条，即使 URL 保留第一条 hash。第二、第三条锚点及前进后退也正常。证据：`experience-history.json`。
- 定向增强初始化故障 4/4 通过：Research/Experience 的 ReadingMotion Observer 构造失败、Experience ResizeObserver 构造失败、Hero 动态媒体查询初始化失败；正文与正常基线一致，原生锚点与目标背景可用，首页轮播保留，无 pageerror。证据：`initialization-failures.json`。
- 独立计数实测：1440px 英文研究三张卡片首次各调用一次 animate，往返后仍各一次；duration 为 560ms，同组 delay 为 0/70/140ms。375px 中文卡片逐条进入，分别播放一次。桌面 scrollY=0/400/1054 时照片 scale 为 1.03/1.01742/1；手机始终为 1。滚至 400px 后刷新，文字按钮立即可见，原生恢复位置后照片随当前进度显示，没有顶部开场或正文入场重播。证据：`sequence-report.json`。
- 特意让全局所有 IntersectionObserver 都失败的极端探针会先触发 Next 自身预取模块错误；SSR 正文仍可读，但不将该探针描述为“无脚本错误”。原始结果保存在 `global-io-probe.json`，与本轮定向增强失败检查分开。
- 数据、消息、原链接目标、路由文件、照片文件及顺序、package 依赖、Next 配置和 Pages workflow 未修改。所有 QA 脚本/截图/报告放在源码目录外，不进入部署。

### 本地预览与复现

预览使用已有命令 `npm run preview -- --port 4185 --base /zhongshengluo06`。

1. 在 1440px 宽访问 `http://127.0.0.1:4185/zhongshengluo06/en/experience/`，缓慢向下读三条经历，左索引跟随当前项；继续滚动到页脚，索引随经历区域结束吸附。点击索引，再用浏览器后退/前进，观察 URL hash 与目标提示。
2. 直接访问 `/zhongshengluo06/zh/experience/#data-administration`，首条立即显示于导航下方并带浅底。使用 Tab 到桌面索引，Enter 跳转；改为 375/768px 后索引隐藏，文章自然单列且仍有当前节点提示。
3. 在首页从顶部滚过首屏，观察照片约 1.03→1 的轻缩放，文字与按钮保持静止；按住按钮可见约 0.98 的按压。手动切第二张照片仍沿用原控制方式。
4. 缓慢进入首页研究卡片或研究内页，再向上、向下往返；同一条目只入场一次。快速滚动、刷新到中页和 Tab 聚焦时内容继续可见。
5. 在浏览器开发工具中模拟 `prefers-reduced-motion: reduce`，或者关闭 JavaScript 后刷新；内容与锚点仍可阅读、定位，新增位移和缩放不播放。

当前 Playwright 录制实测缺少 `ffmpeg-1011/ffmpeg-win64.exe`，无法生成短视频；未安装额外依赖。提供上述准确复现步骤、浏览器逐帧数据及截图，不以截图代替动态测试。本轮交互仅在本地待审核，线上仍为 `577e6f2`。

本轮没有已知未完成的交互项。浏览器验证使用本机 Edge/Chromium 和指定视口模拟，未在真实 iOS/Safari 设备上实测；视频录制限制如上。

## Computational 视觉精修（本地待审核）— 2026-09-28

基于下方已经完成的 Design System 工作树，只补充少量计算研究视觉细节。开始状态另存于源码目录外的 `../computational-start/`，用于区分本轮与此前累计改动；没有回滚、重做版式或改写内容。未 commit、未 push。

### 本轮实际修改

- `public/fonts/fonts.css`：新增系统等宽字体栈 `--font-mono`，不下载字体，保留 Heading / Body / 中文字体角色。
- `app/globals.css`：仅把既有序号、日期、更新 metadata 和研究页 eyebrow 改为 Mono；AI 组技术标签使用原标签蓝底混入 5% Accent Purple 的派生颜色，其余学术标签保持原色；首页 Research 卡片原有 top border 左端增加 5px 空心节点，hover / focus 时节点边框使用紫色。
- `app/editorial.css`：照片计数及 Research / Learning 既有 eyebrow 使用 Mono；Hero 左侧暗部增加纯 CSS 局部点阵；微调既有 ConceptGraph 线条、透明度与 hover。所有照片、遮罩、取景和轮播逻辑保持原样。
- `docs/VALIDATION.md`：追加本记录，保留前轮验证历史。

### 视觉边界与可访问性

- Hero 点阵 opacity 为 `0.07`，宽度为 `min(24%, 320px)`，通过 mask 向右淡出；只在大于 900px 时显示。1440px 下点阵结束于 x=320，而照片从 x≈345.61 开始，因此不覆盖照片或人物。文字和 controls 位于点阵上方，保持原摄影遮罩。
- ConceptGraph 仍只在已有 Focus Strip 出现；线条采用 `0.75px` 非缩放描边和 `0.4` 透明度，整体默认 `0.75`，鼠标 hover 时以 250ms 过渡至 `1`。保留唯一紫色中心节点，不增加第二套图形或大幅插画。
- 紫色只出现在原图形中心、AI 标签的极浅混色，以及研究卡片微型节点的 hover / focus；没有增加紫色大背景、光效或渐变边框。
- 新装饰为无文本伪元素或既有 `aria-hidden` SVG，均 `pointer-events: none`，不产生新的可聚焦元素。卡片保持 `overflow: visible`，原 2px 键盘焦点环未裁切。
- 新 hover 限定 `(hover: hover) and (pointer: fine)`；沿用全局 reduced-motion，开启后新图形及节点过渡均为 `0s`。
- 正文、人物区域、Navbar、Footer 分隔线、经历与奖项布局不增添图形。它们已有明确层次，保留学术与人文重心；Footer 只调整既有更新时间的字体，不新增定位文案。没有给每个 Section 堆叠装饰。

### 最终验证

- 使用原 `/zhongshengluo06` 前缀与 `https://wesweswes7.github.io` 来源完成 `npm run build`，静态生成 23 个构建页面；`npm run typecheck`、`npm run check:content`、`npm run format:check` 与 `git diff --check` 均通过。未新增 lint/test 工具或依赖。
- 原 `../audit-current.cjs` 保持未改，覆盖 18 个中英文页面 × 375/768/1440px，共 54 组；全部返回 200，无横向溢出、图片/alt 缺失、资源请求失败或浏览器/控制台错误。18 个内部目的地址均返回 200。
- 54 组可见文本和链接列表与本轮开始前的 `audit-system-final` 完全一致；轮播切换、方向键回绕、移动菜单及 Escape 关闭通过。内容数据、消息、组件、路由、图像、依赖、Next 配置与 Pages workflow 均未修改。
- 另用源码目录外的 `../audit-computational-detail.cjs` 记录局部几何与交互，输出 6 张研究页截图并人工核对首页、两张照片和研究页在三个宽度下的呈现；没有新增生产代码或运行时请求。
- Header、Hero、正文与 Footer 内容左基准在三种宽度分别为 20 / 32 / 168px；中英文一致。导航总高度沿用手机 66px、其余 74px；主要按钮均为 44px 高、8px 圆角，研究 topic tags 均为 29.5px 高。
- 中文标题无英文负字距，技术标签字距为 0。Contact 与 Footer 无额外外部空隙，保留 Contact 底部 48px（手机）/64px（其余）呼吸空间。新增点阵在 375/768px 隐藏。
- 鼠标 hover 下 ConceptGraph 实测透明度升至 1、过渡 0.25s；触控环境不匹配 fine-hover 查询，研究节点保持蓝色，未新增粘滞 hover 装饰。减少动态效果下过渡关闭，键盘 focus ring 保留。
- 浏览器检查未产生字体或外部资源请求；本轮没有新增图片、JavaScript 或字体文件。系统字体仍会随访客设备回退，这是前轮已明确的现有策略。
- 全站报告、局部报告和截图位于 `../previews/audit-computational/`，不进入 GitHub Pages 构建。本轮视觉范围已完成，仅保留本地修改待用户审核。

## Design System 落地（本地待审核）— 2026-09-28

本记录续接下方的“当前文件审计与局部修复”。开始时保留了 `app/editorial.css` 和本文件的未提交修改，基于现有工作树完成视觉系统整理；未 commit、未 push。下面较早记录中的“仍未完成”描述的是当时状态，由本节更新。根据本轮明确要求，继续保留摄影式首页，浅色左右分栏 Hero 已不属于待办。

### 修改文件与职责

| 文件                     | 本轮实际修改                                                                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/globals.css`        | 统一颜色、字号、间距、宽度、圆角、阴影和交互时长变量；管理基础排版、导航、共享按钮/标签/卡片/页脚及内页响应式布局；清理旧 Hero 遗留规则和文件尾部重复字号补丁 |
| `app/editorial.css`      | 仅保留摄影首屏、图片取景、遮罩、caption/controls、首页简介和 focus strip 的排版；复用共享变量，不再重定义主题或覆盖内页组件                                   |
| `public/fonts/fonts.css` | 明确 Heading、Body 和中文字体栈及回退策略；不引用不存在的字体文件，不新增外部字体请求                                                                         |
| `docs/VALIDATION.md`     | 保留前轮完整记录，追加本轮实现、验证、限制和本地审核状态                                                                                                      |

上一轮的 44px 控件点击区域、手机单列/平板双列、语言切换对比度修复已保留并纳入共享系统。原有本地 `../audit-current.cjs` 未改动，继续用于全站审计；新增源码目录外的 `../audit-design-system.cjs` 检查字体实际渲染、容器对齐和断点边界。开始状态备份保存在 `../design-system-start/`，不进入网站构建。

### Design Tokens

核心颜色唯一真实定义位于 `globals.css` 的基础 `:root`：

| Token                    | 值        |
| ------------------------ | --------- |
| `--color-bg`             | `#F8FAFC` |
| `--color-surface`        | `#FFFFFF` |
| `--color-surface-subtle` | `#F1F5F9` |
| `--color-primary`        | `#123B66` |
| `--color-primary-hover`  | `#2563EB` |
| `--color-accent`         | `#7C3AED` |
| `--color-text`           | `#1E293B` |
| `--color-text-muted`     | `#64748B` |
| `--color-border`         | `#E2E8F0` |

补充边框色 `#CBD5E1`、标签底色 `#E8F1FA` 和摄影遮罩颜色也集中定义。紫色只用于现有计算图的一个中心节点。`--ink`、`--muted`、`--blue`、`--blue-dark`、`--line`、`--light`、`--soft-blue` 保留为兼容 alias，全部引用统一 Token，没有独立颜色值；旧字体变量也只映射到新字体角色。

同一选择器和条件下没有重复变量定义。字号仅由统一基础等级和手机断点等级控制；两个样式文件不再互相覆盖共享组件字号。基础元素分组、状态规则和媒体查询仍有必要的选择器复用，并非声称所有 CSS selector 只出现一次。

### Typography

- 英文 Heading：`IBM Plex Sans → Segoe UI → Arial → 中文回退栈`。
- 英文 Body/UI：`Inter → Segoe UI → Arial → 中文回退栈`。
- 中文：`Noto Sans SC → Source Han Sans SC → Microsoft YaHei → PingFang SC → sans-serif`；中文标题不加英文负字距，eyebrow 不强制 uppercase。
- 当前未打包 Web Font。尝试获取字体样式时 `fonts.googleapis.com:443` 连接失败，因此按用户允许的方案使用系统回退；没有引入运行时外部请求、大字体包或新的依赖。本机通过浏览器实际渲染字体检查，英文为 Segoe UI，中文为本地 Noto Sans SC；不能将此结果推广为所有访客都安装了这些字体。
- 首屏姓名 `clamp(48px, 5.4vw, 72px)`，页面 H1 为 40–48px，Section H2 为 30–36px，Card H3 为 22px；正文 16px / 1.75，辅助文字 14px，eyebrow 12px。手机分别采用首屏 36–46px、页面 36px、Section 28px、Card 20px、辅助文字 13px、eyebrow 11px。

### Layout / Navbar / Hero

- 主要容器统一最大宽度 1200px，桌面左右 padding 48px，中等尺寸 32px，手机 20px。长文维持约 65–72ch 的阅读宽度。
- 主 Section 间距使用 96px / 64px / 48px 三档；卡片 padding 24px，网格 gap 32px / 24px，标题间距使用 16/24/32px。照片取景、字距、标签 padding 等保留必要光学校正。
- Navbar 保留 sticky、桌面导航、About 下拉和手机菜单；高度仍为桌面 74px、手机 66px，使用轻微透明背景和细边框。品牌字体和 active 色统一，语言切换仍为文字入口。
- Hero 保留全宽照片、两张手动轮换、caption 和 controls；只调整字体等级、文字容器对齐、按钮 8px 圆角、间距及遮罩可读性。手机副标题和学校信息使用平衡换行。图像来源、数据结构和取景定位未改变。
- 保留 Hero 白色主按钮和深色描边次按钮的反色版本；普通页面主按钮使用深蓝、hover 使用交互蓝。

### Cards / Tags / Motion

- Research：保留上边线开放式列表，统一 22/20px 标题、间距和轻微边框/标题 hover，不增加白色盒子或悬浮移动。
- Learning：白色、1px 边框、12px 圆角、`0 8px 24px rgba(15,23,42,.04)` 轻阴影；保留首页 3/2/1 列和学习内页 2/1 列逻辑。
- Experience：保留日期与经历的开放式行布局；Award 保留图标、标题和结果分栏；Project 延续原有卡片结构，仅统一边框、圆角和字号。未添加任何项目或成果。
- Topic tags 和状态标签统一 13px、蓝色浅底和小型圆角；浅灰背景上的部分辅助文本改用较深的现有颜色，避免对比度不足。
- 交互时长统一 0.25s，无新增入场动画或视差。只有一处 reduced-motion 规则，统一关闭 transition/animation 并取消平滑滚动。

### Validation

- 最终生产静态构建、`npm run typecheck`、`npm run check:content` 和 `npm run format:check` 均通过；`git diff --check` 通过。未添加不存在的 lint/test 命令或相关工具。
- 使用原部署前缀 `/zhongshengluo06` 和站点来源 `https://wesweswes7.github.io` 构建；路由、Next.js 配置、Pages workflow 和依赖均无修改。
- 现有审计脚本覆盖 18 个中英文页面 × 375/768/1440px，共 54 组；无横向溢出、图片/alt 缺失、失败资源请求或浏览器/控制台错误，18 个内部目的地址均为 200。修改后的照片切换、键盘回绕、手机菜单及 Escape 关闭通过。
- 新增辅助审计覆盖六类内页的两种语言与三个尺寸，共 36 张内页截图；同时验证 320/640/641/900/901/1100/1440px 下的首页容器对齐和首屏文字/控制区无交叠。About 下拉导航和语言切换保留当前子页面通过。
- 导航、首屏和正文左边线测量一致；相关控件保持至少 44px；reduced-motion 下按钮 transition 为 `0s`、滚动为 `auto`。
- 字体和外部 CSS 请求为零；没有未定义的 CSS 变量。辅助文字在主背景上的对比度约 4.55:1；较深标签文字用于浅灰底，避免直接使用对比度约 4.34:1 的灰字组合。
- 内容数据、组件、消息、图片文件和链接目标未改动，54 组页面链接全部与前轮一致。可见文本对比中仅中文 Contact 的 CSS 大小写呈现由 `GITHUB` 恢复源文案 `GitHub`（三个尺寸），这是取消中文 uppercase 的结果，不是文案修改；其余文本一致。
- 最终全站报告和首页截图：`../previews/audit-system-final/`；内页截图、实际字体和断点审计：`../previews/audit-system/`。这些本地 QA 文件不进入部署。

### Remaining

本轮视觉范围已落地。唯一字体限制是尚未提供可在所有访客设备上保证一致的 Inter / IBM Plex Sans 字体资源；已按本轮允许的系统字体回退方案处理，不依赖外部加载。没有其它必须完成的视觉项。所有变更仅在本地，等待用户审核；未 commit、未 push。

## 当前文件审计与局部修复 — 2026-09-28

本次按用户的新要求先检查落盘状态、执行现有检查，再做局部修复。审计对象为 `website-upgrade/git-source`，起始 HEAD 为 `47dc1bf`，开始时工作区无未提交修改。以下结果是本地生产构建的验证，本轮未提交或推送 GitHub，也未重新验证线上部署。

### 上一轮实际落盘的文件

最近一次提交 `47dc1bf` 共涉及 12 个文件，内容是照片清晰度与原有首页的局部优化：

| 文件                                                                                              | 已写入的修改                                                   |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `app/editorial.css`                                                                               | 首屏小标题装饰线、简介区布局与字号、当前学习信息区的边框和间距 |
| `components/pages.tsx`                                                                            | 按照片配置生成多尺寸 `srcSet`                                  |
| `components/photo-carousel.tsx`                                                                   | 配合现有封面宽度设置响应式图片 `sizes`                         |
| `data/photos.json`                                                                                | 水畔照片原始尺寸和响应式宽度配置                               |
| `public/images/photos/by-the-water.jpg`                                                           | 更新高清 JPEG 回退图片                                         |
| `public/images/photos/by-the-water-640.webp`、`by-the-water-1080.webp`                            | 更新既有 WebP 图片                                             |
| `public/images/photos/by-the-water-1920.webp`、`by-the-water-2880.webp`、`by-the-water-3840.webp` | 新增更高分辨率 WebP 图片                                       |
| `scripts/validate-content.mjs`                                                                    | 校验照片响应式资源配置                                         |
| `docs/CONTENT.zh-CN.md`                                                                           | 同步照片维护说明                                               |

之后提出的 Academic + Computational + Humanistic 全面设计方案尚未写入。当前仍是深色照片封面、衬线标题和原有开放式内容布局，不能将上一轮方案描述为已实现。

### 本次仅修改两个项目文件

- `app/editorial.css`：复用既有样式入口，新增 `--control-size: 44px`；补足语言切换、移动菜单、照片控制及手机首屏按钮的点击区域；将 641–900px 的研究和学习列表改为两列，640px 以下保持单列；未选中语言的文字颜色改用现有 `--muted`，白底对比度由约 3.29:1 提高到 4.95:1。
- `docs/VALIDATION.md`：记录本次审计依据、验证结果和未完成的视觉任务。

没有改动 JSX、个人信息、中英文文案、照片资源、路由、链接目标、依赖或 GitHub Pages 配置。首屏照片取景、两张手动轮换、讲台照不进入封面、原有键盘焦点和减少动态效果设置均保留。

### 验证结果

- 修改前后均运行实际已有的 `npm run build`、`npm run typecheck`、`npm run check:content`；均通过。`npm run format:check` 与 `git diff --check` 通过。项目未定义 `lint` 或 `test` 脚本。
- 构建使用既有 `/zhongshengluo06` 项目前缀和 `https://wesweswes7.github.io` 站点来源，静态导出成功；没有需要修复的原始构建错误。
- 本地 Edge / Playwright 检查 18 个中英文页面 × 375、768、1440px，共 54 个组合；修改前后均无横向溢出、图片加载或 alt 缺失、浏览器异常、控制台错误、失败资源请求。18 个内部目的地址均返回 200。
- 54 组页面的可见文字与链接目标在修改前后逐项一致。
- 两张照片的切换及键盘回绕、移动菜单打开与 Escape 关闭通过；额外检查了 320px 下的中英文首页、语言切换、菜单和布局。
- 修复后的相关控件点击区域至少 44px；375、768、1440px 首页研究和学习列表分别为一、二、三列。键盘跳转链接的焦点轮廓可见；减少动态效果模式下滚动为 `auto`。
- 本地检查脚本与截图不进入站点源码，保存在上级目录的 `audit-current.cjs` 和 `previews/audit-before`、`previews/audit-after` 中。

### 仍未完成的视觉任务

- 全局颜色与 8px 间距体系尚未统一；`globals.css` 和后加载的 `editorial.css` 仍有重复变量及覆盖规则。本轮仅增加点击区域变量，没有宣称完成统一 Design Tokens。
- IBM Plex Sans / Inter / Noto Sans SC 字体体系尚未接入；`public/fonts/fonts.css` 仍仅含系统字体策略说明。
- 浅色、左文右图的首屏与约 4:5 人像框尚未实现；目前保留原深色照片封面。
- 1200px 内容宽度、56/36/22px 标题层级、16px 圆角卡片、标签、全站按钮和页脚统一规范尚未实现。

这些属于后续系统性视觉升级，按本轮“不要重复大范围修改”的要求保持待办，不影响当前构建和导航功能。

## Visual redesign and new project URL — 2026-09-24

Current release target: [Wesweswes7/zhongshengluo06](https://github.com/Wesweswes7/zhongshengluo06), with the website at [https://wesweswes7.github.io/zhongshengluo06/](https://wesweswes7.github.io/zhongshengluo06/). **The repository rename and local project-path QA are confirmed; deployment and live verification are in progress.** The user chose to keep this project URL. This release does not provide redirects from the former Pages project URLs. An HTTP 200 response from the renamed project alone is not evidence that the redesigned build is live.

- The local redesign uses a large photographic cover, serif headings, generous spacing, fine separators, and white/navy styling. The author's name and academic identity remain unchanged.
- The cover contains **two photographs only**: the original conference photograph and the retouched waterside photograph. The podium photograph is excluded from the cover. No separate photo pages or gallery navigation were added.
- The initial redesign checks ran on a local build without a project prefix. A subsequent production build under `/zhongshengluo06/` passed the full 18-page matrix at viewport widths of 1440, 390, and 320 pixels. All 18 internal destinations, document languages, language switching with page retention, mobile menus, Escape handling, desktop About navigation, the English default root, and unknown-route 404 behavior passed. The new-project report contains no layout/link issues or browser errors.
- Both language versions passed carousel checks at all three widths under the new `/zhongshengluo06/` base path: two slides, previous/next wraparound, direct dot selection, keyboard arrows, stable frame height, loaded images, and no horizontal overflow. The waterside image is not requested until selected; the podium image is never requested by the cover. The initial photograph remains available with JavaScript disabled. No photo-detail route appears in the sitemap, and the removed photo-detail URL returns 404.

Local evidence is retained outside the website source in the task's `work/` directory: `qa-new-project.json`, `qa_carousel.cjs`, and `carousel-checks.json`. The earlier `qa-redesign.json` covers the prior local root-path build. Root-path redirect experiments are superseded and are not part of this release.

## Earlier homepage photo carousel — 2026-09-24

The following records the earlier three-photo layout, which is superseded by the two-photo local redesign above.

- Three photos share the existing homepage frame: the original conference image and two AI-retouched additions. No photo detail routes or gallery navigation were added.
- The production static build, TypeScript, content validation and formatting checks passed.
- English and Chinese homepages passed browser checks at 1440, 390 and 320 pixels: previous/next wraparound, direct dot selection, keyboard arrows, stable frame height, no horizontal overflow, and no failed resources or browser errors.
- Network checks confirmed the two new photos are not requested until selected. Responsive WebP variants are approximately 30–245 KB; JPEG fallback files are approximately 143–323 KB.
- The first photo remains present without JavaScript. Mobile layout uses a full photo frame with 44-pixel controls. Desktop and mobile screenshots were visually reviewed.
- Production Webpack caching is disabled after a local incremental build reused stale CSS. A full recompilation included the current styles and passed the checks above; this affects build time only.

Date: 2026-09-23. Local tests used Windows, Node.js 24, and Microsoft Edge through Playwright. The GitHub Pages workflow also built and deployed successfully using Node.js 22 on GitHub's Ubuntu runner.

## Production build

- Next.js 16.3.6 static export: passed.
- TypeScript check: passed.
- Content validation: passed; the release has zero published projects and zero notes, matching the supplied information.
- Prettier check: passed.
- Root URL renders English; English and Chinese pages have the correct document language.

## Browser checks

All 18 core pages (nine pages × two languages) were checked at viewport widths of 1440, 390, and 320 pixels. The same matrix was checked in an isolated project build using the `/personal-website` base path.

- No horizontal overflow, missing images, empty anchor placeholders, or uncaught browser exceptions were found.
- All core internal links returned successful responses.
- Language switching retained the current page.
- Mobile navigation opened, closed after navigation, and closed with Escape.
- Desktop About navigation reached the Awards page.
- Unknown URLs returned 404.

Initial static-host testing found failed framework RSC prefetch requests. Internal links now use native document navigation to exported HTML, with the deployment base path applied centrally. Rechecking found no failed resource requests. This trades client-side page transitions for straightforward static-host behavior.

## Future content checks

Only the separate validation copy received test entries. The release source and output contain none of these entries.

Twenty-one assertions passed, covering generated English and Chinese project pages, Markdown tables, deployment-aware canonical URLs and internal links, language switching within an article, a missing-translation page with `noindex`, an original-language link, sitemap exclusion of missing translations, and exclusion of draft notes and projects from both exported pages and the sitemap. These also verify that published projects and notes restore their navigation entries and homepage sections in both languages.

## Loading and navigation update

- Rechecked all 18 pages at 1440, 390, and 320 pixels with the project base path: no failed links, missing images, horizontal overflow, or browser exceptions.
- Empty project/note entries are absent from the header, mobile menu, footer, homepage, and related links. Their existing URLs still return 200 with `noindex`; empty archives are excluded from the sitemap.
- Both language homepages lead to research interests and contact. Missing CVs, publications, and academic profiles no longer produce placeholder panels.
- The browser made zero external CSS requests: the shared stylesheet is inlined. This saves a render-blocking round trip, with the trade-off of a larger HTML response and no independently cached stylesheet. Next.js's inline CSS option is experimental and should be rechecked after framework upgrades.
- The site-specific navigation JavaScript chunk decreased from about 11.6 KB to 3.3 KB uncompressed (about 5.1 KB to 1.4 KB gzip). Shared React/Next.js runtime chunks remain; these numbers are not the total page script size.
- Intent-based document prefetch was observed reaching `Ready`, then `PrefetchResponseUsed` on navigation. Full prerender was disabled by the automated browser's DevTools session, so the prefetch fallback is verified; full prerender acceleration is not claimed from this test.
- Language switching, browser back navigation, menu interaction, and ordinary navigation with JavaScript disabled passed. Unsupported or resource-constrained browsers may decline speculative loading without breaking links.
- Local click timings are not an estimate of public GitHub Pages speed. Network latency remains dependent on the visitor's connection.

## Historical live deployment — former project URL

- Repository: [Wesweswes7/personal-website](https://github.com/Wesweswes7/personal-website).
- Website: [English](https://wesweswes7.github.io/personal-website/en/) · [中文](https://wesweswes7.github.io/personal-website/zh/).
- [First deployment](https://github.com/Wesweswes7/personal-website/actions/runs/35867044435): build and deploy both passed.
- HTTP checks passed for the root, all 18 core pages, 18 internal destinations, and 11 referenced assets. Document languages, canonical URLs, base paths, sitemap, and the unknown-route 404 were checked.
- The deployed photograph's SHA-256 matches the approved local photograph.
- The first live Playwright navigation timed out on the local connection. The browser interaction and responsive checks above refer to the local production build with the same project base path; the live checks used direct HTTPS requests.

## Remaining content

- CV files, formal experience roles, official award titles/years, and optional academic profile links remain pending.
- The original user-supplied photograph is retained without image editing; CSS controls framing.
