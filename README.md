Local-ai-image是一个基于 React 和 Express 的全栈应用，用于在无限画布上进行基于节点的图像生成。当前版本由 Right Codes Draw API 提供支持，专为希望在画布上放置参考资料、将其连接到生成节点并进行可视化迭代的工作流程而设计，而非使用纯文本 UI。
主要特点
- 带有可拖动图像和生成节点的无限画布
- Right Codes 图像生成，支持每个节点的提示符、模型和宽高比设置
- 参考图像可通过文件选择器、拖放和剪贴板粘贴导入
- 将提示文本中的引用绑定到@用户界面中显示的编号引用标签。
- Right Codes 的多参考支持功能，可将选定的参考资料合并到联系表中。
- 内置生成历史记录库，可将旧输出发送回画布。
- Right Codes 提升流程，以获得更清晰的后续输出
车型选项
当前画布用户界面公开了以下 Right Codes 模型选项：
暂时无法在飞书文档外展示此内容
工作流程
1. 启动应用程序，并在浏览器中打开画布。
2. 将一张或多张参考图像导入到绘图板上。
3. 创建或选择一个生成节点。
4. 连接指向该节点的引用并写入提示。
5. （可选）使用用户界面中的编号@引用标签来定位提示中的特定引用。
6. 使用正确的代码生成结果，并继续在画布上排列结果。
7. 当您需要更清晰的最终图像时，请对选定的输出进行放大。
技术栈
- React 19
- TypeScript
- 维特
- 表达
- 正确的代码绘制 API
- Tailwind CSS v4
- 运动
- 生产服务器捆绑包的 esbuild
入门
先决条件
- 推荐使用 Node.js 20+
- Right Codes Draw 的 API 密钥
Codex / Cursor 运行
在codex中新建一个文件夹
[图片]
在对话框中输入：https://github.com/kacey221/Local-ai-image.git 这个网址，下载并运行这个程序
接下来就让codex自行运行，中途遇到问题，codex会有提示，只需要按照它的建议做就行，直到运行成功。
电脑本地运行
请按照以下步骤操作：
1. 检查电脑上是否安装得有node.js 20+的版本。
①.打开终端：系统键+R,在弹出来的对话框中输入powershell点回车。
②.默认的情况下输入：node -v 或 node --version
输出 v20.15.0 / v22.4.1 → 已安装 20+ 版本
输出 v18.20.3 / v16.20.2 → 版本低于 20，不符合（建议更新）
提示 'node' 不是内部或外部命令 → 未安装或未配置环境变量
③.安装node.js（有node的，这一步就忽略，没有的就按照这个步骤进行安装）
Node:  下载地址：https://nodejs.org/en/download
[图片]
ps：node是基础的一个语言环境，后面很多东西依赖他，
验证：终端输入：node -v

2. 进入项目文件夹：
终端输入：cd https://github.com/kacey221/Local-ai-image.git  或 cd E:\kacey\codex\Local-ai-image-main （保存文件夹的地址） 点击回车
3. 安装依赖项：
npm install
3. 复制示例环境文件：
cp .env.example .env
如果您在 Windows 系统上使用 PowerShell，也可以运行以下命令：
Copy-Item .env.example .env
4. 打开.env并设置您的正确代码密钥：
RIGHTCODES_API_KEY=your_api_key_here
https://www.right.codes   (开始可以充1元试试，1元都可以生好多张图了 ) / 邀请码：02770667
5. 启动本地开发服务器：
npm run dev
6. 打开浏览器并访问http://localhost:3000。
7. 确认应用正在运行：
- 终端应该打印类似如下的一行：Server running on http://0.0.0.0:3000
- 访问http://localhost:3000/api/config-status应该返回 JSON
- 画布用户界面应该在浏览器中加载。
开发服务器在单个端口上同时运行 Express 后端和 Vite 前端。

环境变量
当前版本仅需要RIGHTCODES_API_KEY。
暂时无法在飞书文档外展示此内容
可用脚本
npm run dev
启动本地全栈开发服务器http://localhost:3000。
npm run build
使用 Vite 构建前端并将服务器打包到dist/server.cjs.
npm run start
从此处运行生产包dist/。
npm run lint
使用 . 运行 TypeScript 类型检查tsc --noEmit。
npm test
.test.ts使用 Node 测试运行器运行存储库的文件tsx，这是此 TypeScript + ESM 设置所必需的。
API概述
活动路由
- GET /api/config-status
- POST /api/rightcodes/generate-image
- POST /api/rightcodes/upscale-image
兼容性路由
- POST /api/gemini/generate-image
此路由目前是 Right Codes 生成处理程序的别名，因此旧的前端调用仍然有效。
旧版占位符或已禁用路由
- POST /api/gemini/enhance-prompt
- POST /api/gemini/edit-image
- POST /api/gemini/upscale-image
- POST /api/gemini/outpaint-image
- POST /api/gemini/cutout-image
/api/gemini/enhance-prompt目前直接返回原始提示信息，未做任何更改。图像编辑、抠图、裁剪和 Gemini 放大等功能仅保留410 Gone在此版本中以保持兼容性和功能正常。
项目结构
.
|- src/                     # React app and canvas UI
|- server/                  # Right Codes request helpers and tests
|- docs/plans/              # Design notes and implementation plans
|- server.ts                # Express server and API routes
|- .env.example             # Example environment variables
|- package.json             # Scripts and dependencies
`- dist/                    # Production build output
注释和限制
- 该仓库目前仅以 Right Codes 构建方式运行。
- 多参考图像生成后，会被合并成一张单独的联系表图像，然后再发送到上游服务器。
- 提示增强是当前服务器中的一个直通占位符。
- gemini即使路由生成由 Right Codes 处理，但仍有一些路由名称为了向后兼容而使用。
- 该应用不包含持久化、身份验证或多人协作编辑功能。
这份自述文件存在的意义
该代码库基于通用模板创建，因此本 README 文件主要关注当前代码库中实际存在的行为。如果您持续开发该产品，则需要更新的最重要部分包括：
- 环境变量
- 活跃的 API 路由
- 支持的生成工作流程
- 功能限制
