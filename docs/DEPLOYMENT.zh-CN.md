# 发布到 GitHub Pages

源码仓库为 [Wesweswes7/wesweswes7.github.io](https://github.com/Wesweswes7/wesweswes7.github.io)，网站目标为 [https://wesweswes7.github.io/](https://wesweswes7.github.io/)，不再使用项目路径。

## 发布流程

1. 使用 `Wesweswes7/wesweswes7.github.io` 仓库，默认分支为 `main`，现有提交历史保留。
2. 将本目录内容作为仓库根目录；不要上传外层 `outputs` 或整个工作目录。`.github/workflows/deploy.yml` 必须位于仓库根目录下的 `.github/workflows/`。
3. 不上传 `node_modules`、`.next`、`out`，这些目录已被 `.gitignore` 忽略。提交 `package-lock.json`。
4. 打开仓库 Settings → Pages，将 Source 设为 GitHub Actions。
5. 在 Actions 中手动运行 `Deploy website to GitHub Pages`，或者向 `main` 提交变更。仓库改名后需要重新构建，以使用新的项目路径。
6. 等待 build 与 deploy 两个任务完成，从部署任务显示的链接访问网站，再检查两种语言与全部导航。

根网址下，英文入口为 `/en/`，中文入口为 `/zh/`，`/` 显示英文首页。

工作流通过 `actions/configure-pages` 读取 `origin` 与 `base_path`。Next.js 以这些信息生成页面资源、图片、语言切换、canonical 和 sitemap。无需在每个内容文件里添加仓库前缀。

GitHub Pages 在工作流运行前需要启用。若 configure-pages 提示站点不存在，先检查 Settings → Pages 的 Source 是否已经设置为 GitHub Actions。组织或账号的 Actions 策略也可能限制工作流执行。

## 本地模拟正式根网址

```powershell
$env:NEXT_PUBLIC_BASE_PATH = ''
$env:NEXT_PUBLIC_SITE_URL = 'https://wesweswes7.github.io'
npm run build
npm run preview
```

访问预览服务打印的地址。环境变量在构建时生效，不能只在上传后改变路径。本地构建通过不代表公网发布已经完成。

## 更新旧链接

GitHub 会为改名前的仓库 URL 提供重定向，但不会自动重定向旧的 GitHub Pages 项目网址。新站验证完成后，将书签、个人资料、对外分享，以及图片和 CV 的直接链接从 `/personal-website/` 更新为 `/`。

当前发布不包含旧 Pages 路径的兼容跳转。不要把仓库 URL 的重定向当作网站 URL 也会重定向。

## 其他仓库与独立域名

`wesweswes7.github.io` 是网站源码和 Pages 用户站点仓库。Profile README 的同名仓库 `Wesweswes7` 用于 GitHub 个人资料页，两者用途不同。

若未来使用独立域名，先在 GitHub Pages 中配置域名和 DNS，工作流随后读取新地址；重新部署并检查 canonical、语言切换、图片和 CV。

## 验证与恢复

发布后打开两种语言的首页、全部导航页面、一个真实项目或笔记详情（如果已有），并直接刷新子页面。检查图片、CV、canonical 与 sitemap，确认内部资源和链接不再包含旧项目路径。发布失败时先阅读 build 或 deploy 的错误日志；恢复旧版本可回退导致问题的提交，再运行同一工作流。

官方参考：[Next.js 静态导出](https://nextjs.org/docs/app/guides/static-exports)、[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)、[GitHub 仓库改名](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository)。
