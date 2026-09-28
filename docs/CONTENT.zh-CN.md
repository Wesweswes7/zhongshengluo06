# 内容维护指南

平时只需要修改内容文件，不必改页面布局。所有公开页面都在构建时生成，所以修改内容后需要重新构建或提交到触发 GitHub Actions 的分支。

## 修改已有资料

| 文件                                   | 管理内容                                               |
| -------------------------------------- | ------------------------------------------------------ |
| `data/profile.json`                    | 姓名、标题、学校、专业、简介、照片、CV、技能与联系方式 |
| `data/research.json`                   | 研究主线、主题与希望探索的问题                         |
| `data/learning.json`                   | 正在学习的主题与未来探索                               |
| `data/experience.json`                 | 活动、实践经历、日期和说明                             |
| `data/awards.json`                     | 奖项、正式名称、授予单位与年份                         |
| `data/projects.json`                   | 项目列表及详情字段                                     |
| `data/publications.json`               | 自己的论文成果；不用于论文阅读笔记                     |
| `data/categories.json`                 | 项目与笔记类别                                         |
| `data/todos.json`                      | 待补充事项，仅供维护，不直接公开展示                   |
| `messages/en.json`、`messages/zh.json` | 导航、按钮、空状态和界面提示                           |

`en` 与 `zh` 分别保存英文和中文描述。同一经历的 ID、链接、日期不重复维护。未知年份保留 `null`，不要填写推测日期。`profile.updatedAt` 应在实际更新内容时改成当天日期。

当前研究问题是方向表达，不是正在开展的具体项目。确认经历角色与正式奖项名称后，可替换相应说明。奖项年份现在均未填写。

## 添加 CV 或学术账号

将英文与中文 PDF 分别放进 `public/cv/`，然后把 `data/profile.json` 的 `cv.en`、`cv.zh` 改为 `/cv/文件名.pdf`。只有文件确实存在时，构建才能通过；下载按钮随后自动出现。网站的部署前缀会自动加上，不要把 `/personal-website` 写入文件内容。

LinkedIn、Google Scholar、ORCID 建立后，将 `linkedin`、`scholar`、`orcid` 从 `null` 改成真实 HTTPS 链接。

## 首页照片轮换

首页封面包含原来的会议照和水畔照，通过左右箭头、圆点或键盘方向键切换，不自动播放，也不跳转到独立照片页。第一张照片取自 `data/profile.json`；`data/photos.json` 管理其余照片的顺序、固定 `slug`、中英文标题、简短说明、替代文字以及图片尺寸。`showOnCover` 控制是否进入封面轮换；讲台照设为 `false`，保留文件但不在封面展示。`slug` 仅用作稳定标识。

网页图片放在 `public/images/photos/`。`image` 填写不含扩展名的前缀，例如 `/images/photos/by-the-water`；同一前缀下提供 `.jpg` 备用图，并在 `responsiveWidths` 中按升序列出 WebP 宽度，为每种宽度生成 `-宽度.webp`。浏览器按设备分辨率选图；所有版本保持相同构图和宽高比，`width`、`height` 记录原始照片尺寸。将原片另行私下备份，不要提交到公开仓库。替换照片时从原片重新导出尺寸版本，不要从网页压缩图放大。

图片在固定尺寸的相框内等比例取景，不拉伸。首次打开只请求当前照片，其余照片在切换时加载；浏览器随后可复用缓存。更换照片时同步更新标题、说明和替代文字；日期、地点、活动名称只填写已确认的信息。修改后运行构建，检查两个语言版本及手机显示效果。

## 新增一篇笔记

1. 复制 `docs/templates/note.md` 到 `content/notes/`，建议命名为 `主题.en.md` 或 `主题.zh.md`。
2. 填写标题、摘要、日期、类别与正文。日期必须放在引号中，如 `"2026-09-23"`。
3. `slug` 使用小写英文、数字和短横线。中英文译文使用同一个 slug。
4. 草稿保持 `status: draft`。准备公开后改为 `published`。
5. 执行 `npm run build`，再预览页面。

笔记类别限定为 `Paper Reading`、`Learning Notes`、`Technical Articles`、`Research Thoughts`。`draft` 和 `archived` 不会进入公开列表或站点地图。

Markdown 支持标题、链接、列表、代码块、表格与引用。当前未加入数学公式扩展。图片可放在 `public/images/`，正文引用 `/images/文件名`，程序会处理部署前缀。不要用原始 HTML 编写交互内容。

某篇文章只有一种语言时，切换到另一种语言会进入“译文待补充”页，并提供原文入口。该回退页不会进入站点地图，也不允许搜索引擎索引。

## 新增项目

1. 查看 `docs/templates/project.json`，把一个完整项目对象加入 `data/projects.json` 数组。
2. 填写两种语言的标题、问题摘要和个人贡献，选择一个主要类别。
3. `status` 为 `draft` / `published` / `archived`，控制页面是否公开。
4. `progress` 为 `planned` / `ongoing` / `completed`，描述实际工作阶段。不要把未开始的计划标记成进行中。
5. 代码、文档、演示链接只填实际存在的 URL；缺失时省略字段或保留 null。
6. 如需长篇说明，添加 `content/projects/项目slug.en.md`、`项目slug.zh.md`；这些文件只有正文，无需元数据头。

发布后，项目列表、首页精选与 `/en/projects/项目slug/`、`/zh/projects/项目slug/` 自动生成，不需要修改路由。当前项目优先按数据文件顺序展示，首页取前两项。

## 添加自己的论文成果

在 `data/publications.json` 中增加条目，字段包括双语 `title`、作者字符串 `authors`、真实链接 `url` 和 `status`。状态限定为 `Submitted`、`Preprint`、`Accepted`、`Published`。只有实际存在的成果才添加；论文阅读记录应发布到 Notes。

## 自动显示与收起

- 项目和笔记没有已发布条目时，首页、桌面导航、手机导航、页脚和相关内容链接会自动收起这些入口。笔记按当前语言判断。
- 发布第一项内容并重新构建后，入口和首页精选自动出现，不需要手动修改导航。
- 空归档的旧网址继续可访问，但不进入站点地图，并设置 `noindex`。
- 当前语言未配置 CV 时，不显示简历按钮和联系页的简历面板。配置有效的 PDF 路径后自动恢复。
- 论文与学术账号为空时收起对应板块；这些设置不影响内部待办清单。

## 更新前后检查

先运行 `npm run check:content`，再运行 `npm run build`。检查相关中英文页面、链接、照片、手机布局和 CV。使用 `npm run preview` 检查实际静态输出，不以开发服务器正常作为部署一定正常的依据。

姓名与技能修改后，手动同步 `github-profile/` 的 README；代码与笔记细节主要保留在对应 GitHub 仓库，网站使用摘要与链接。
