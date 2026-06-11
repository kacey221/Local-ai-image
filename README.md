
Local-ai-image 是一个基于 React 和 Express 的全栈应用，用于在无限画布上进行基于节点的图像生成。当前版本由 Right Codes Draw API 提供支持，专为希望在画布上放置参考资料、将其连接到生成节点并进行可视化迭代的工作流程而设计，而非使用纯文本 UI。
主要特点
带有可拖动图像和生成节点的无限画布
Right Codes 图像生成，支持每个节点的提示词、模型和宽高比设置
参考图像可通过文件选择器、拖放和剪贴板粘贴导入
可将提示文本中的引用绑定到 UI 中显示的编号 @ 引用标签
支持 Right Codes 多参考生成，可将选定的参考资料合并为联系表
内置生成历史记录库，可将旧输出重新发送回画布
提供 Right Codes 放大流程，以获得更清晰的后续输出
模型选项
当前画布 UI 提供以下 Right Codes 模型选项：
模型	说明	支持分辨率
gpt-image-2-vip	OpenAI 最新的画图模型，官方直连。	1K、2K、4K
gpt-image-2	OpenAI 最新的画图模型，特价版。	1K
nano-banana	由 gemini-2.5-flash-image 模型封装而来。	当前仓库未单独标注
nano-banana-2	Nano Banana 第二代绘图模型，综合效果强于上一代。	1K、2K、4K
nano-banana-pro	Nano Banana 第二代高阶绘图模型，综合效果强于上一代。	1K、2K、4K

工作流程
启动应用程序，并在浏览器中打开画布。
将一张或多张参考图像导入到绘图板上。
创建或选择一个生成节点。
连接指向该节点的引用并写入提示词。
可选：使用 UI 中编号的 @ 引用标签，在提示词中指定特定参考图。
使用 Right Codes 生成结果，并继续在画布上排列结果。
当您需要更清晰的最终图像时，可对选定输出进行放大。
技术栈
React 19
TypeScript
Vite
Express
Right Codes Draw API
Tailwind CSS v4
Motion
esbuild，用于生产服务器打包
入门
先决条件
推荐使用 Node.js 20+
Right Codes Draw 的 API 密钥
Codex / Cursor 运行
在 Codex 或 Cursor 中新建一个文件夹。
在对话框中输入仓库地址：
https://github.com/kacey221/Local-ai-image.git
让 Codex / Cursor 下载并运行这个程序。
接下来可以让 Codex 自行继续执行；如果中途遇到问题，Codex 会给出提示，按提示处理即可，直到运行成功。
电脑本地运行
请按照以下步骤操作：
检查电脑上是否安装了 Node.js 20+。
打开终端：
Windows：按 Win + R
输入 powershell
按回车
然后执行：
node -v
或：
node --version
判断方式：
输出 v20.x.x、v22.x.x：已安装 20+ 版本
输出 v18.x.x、v16.x.x：版本低于 20，建议更新
提示 'node' 不是内部或外部命令：说明未安装或未配置环境变量
如果没有安装 Node.js，请先安装。
下载地址：
Node.js 下载页面
说明：
Node.js 是项目运行所依赖的基础运行环境
安装完成后，可再次执行 node -v 验证是否成功
获取项目代码并进入项目文件夹。
如果你还没有下载项目，请先执行：
git clone https://github.com/kacey221/Local-ai-image.git
cd Local-ai-image
如果项目已经在本地，只需要进入项目目录，例如：
cd E:\kacey\codex\Local-ai-image-main
安装依赖项：
npm install
复制示例环境文件：
cp .env.example .env
如果您在 Windows PowerShell 中操作，也可以运行：
Copy-Item .env.example .env
打开 .env 并设置您的 Right Codes 密钥：
RIGHTCODES_API_KEY=your_api_key_here
Right Codes 官网：
https://www.right.codes
备注：
开始时可以先少量充值测试
你给出的邀请码是：02770667
启动本地开发服务器：
npm run dev
打开浏览器并访问：http://localhost:3000

确认应用正在运行：终端应打印类似如下信息：Server running on http://0.0.0.0:3000
访问 http://localhost:3000/api/config-status 应返回 JSON
画布 UI 应在浏览器中正常加载

开发服务器会在单个端口上同时运行 Express 后端和 Vite 前端。
另一台电脑运行
如果要在另一台电脑上启用该程序，需要满足以下条件：
已安装 Node.js 20+
该电脑上也配置了 RIGHTCODES_API_KEY
该电脑可以访问 Right Codes 的公网接口
本机 3000 端口没有被其他程序占用
如果只是希望让同一局域网内的其他设备访问本程序：
先在宿主机上启动项目
宿主机访问：http://localhost:3000
局域网内其他设备访问：http://<宿主机局域网IP>:3000
另外，可能还需要在宿主机防火墙中放行 3000 端口。
环境变量
当前版本仅需要 RIGHTCODES_API_KEY。
变量名	是否必须	说明
RIGHTCODES_API_KEY	是	用于 Right Codes 图像生成与放大接口
APP_URL	否	偏部署用途的占位变量，本地运行不是必须

可用脚本
npm run dev
启动本地全栈开发服务器，访问地址为：
http://localhost:3000
npm run build
使用 Vite 构建前端，并将服务器打包到：
dist/server.cjs
npm run start
从 dist/ 运行生产包。
npm run lint
运行 TypeScript 类型检查：
tsc --noEmit
npm test
使用 tsx 和 Node 测试运行器执行仓库中的 .test.ts 文件。这是当前 TypeScript + ESM 配置所需的测试方式。
API 概述
活动路由
GET /api/config-status
POST /api/rightcodes/generate-image
POST /api/rightcodes/upscale-image
兼容性路由
POST /api/gemini/generate-image
此路由目前是 Right Codes 生成处理程序的别名，因此旧的前端调用仍然有效。
旧版占位符或已禁用路由
POST /api/gemini/enhance-prompt
POST /api/gemini/edit-image
POST /api/gemini/upscale-image
POST /api/gemini/outpaint-image
POST /api/gemini/cutout-image
/api/gemini/enhance-prompt 目前直接返回原始提示信息，不做任何更改。图像编辑、抠图、扩图和 Gemini 放大等功能仅为兼容性保留，在当前版本中会返回 410 Gone。
项目结构
.
|- src/                     # React 应用和画布 UI
|- server/                  # Right Codes 请求辅助模块和测试
|- docs/plans/              # 设计记录和实施计划
|- server.ts                # Express 服务和 API 路由
|- .env.example             # 环境变量示例
|- package.json             # 依赖与脚本
`- dist/                    # 生产构建输出
注释和限制
该仓库当前仅以 Right Codes 构建方式运行
多参考图像在发送到上游前，会被合并成一张单独的联系表图像
提示增强是当前服务器中的一个直通占位符
即使生成由 Right Codes 处理，部分路由名称仍保留 gemini，以保持向后兼容
该应用不包含持久化、身份验证或多人协作编辑功能
这份 README 存在的意义
该代码库基于通用模板创建，因此本 README 主要关注当前代码库中实际存在的行为。如果您持续开发该产品，则最需要及时更新的部分包括：
环境变量
活跃的 API 路由
支持的生成工作流程
功能限制
