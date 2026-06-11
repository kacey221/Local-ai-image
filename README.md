# Local-ai-image

Local-ai-image 是一个基于 React 和 Express 的全栈应用，用于在无限画布上进行基于节点的图像生成。当前版本由 Right Codes Draw API 提供支持，专为希望在画布上放置参考资料、将其连接到生成节点并进行可视化迭代的工作流程而设计，而非使用纯文本 UI。

## 主要特点

- 带有可拖动图像和生成节点的无限画布
- Right Codes 图像生成，支持每个节点的提示符、模型和宽高比设置
- 参考图像可通过文件选择器、拖放和剪贴板粘贴导入
- 将提示文本中的引用绑定到用户界面中显示的编号 `@` 引用标签
- 支持 Right Codes 多参考生成，可将选定的参考资料合并到联系表中
- 内置生成历史记录库，可将旧输出发送回画布
- Right Codes 提升流程，以获得更清晰的后续输出

## 模型选项

当前画布用户界面提供以下 Right Codes 模型选项：

| 模型 | 描述 | 分辨率支持 |
| --- | --- | --- |
| `gpt-image-2-vip` | 通过官方上游途径获取 OpenAI 的最新图像模型。 | `1K`、`2K`、`4K` |
| `gpt-image-2` | OpenAI 最新图像模型的低成本版本。 | `1K` |
| `nano-banana` | 由 `gemini-2.5-flash-image` 包裹的模型。 | 本仓库中未指定 |
| `nano-banana-2` | 第二代 Nano Banana 机型，整体图像质量比上一代更强。 | `1K`、`2K`、`4K` |
| `nano-banana-pro` | 第二代 Nano Banana 高阶机型，整体图像质量比上一代更强。 | `1K`、`2K`、`4K` |

## 工作流程

1. 启动应用程序，并在浏览器中打开画布。
2. 将一张或多张参考图像导入到绘图板上。
3. 创建或选择一个生成节点。
4. 连接指向该节点的引用并写入提示。
5. 可选：使用用户界面中的编号 `@` 引用标签来定位提示中的特定引用。
6. 使用 Right Codes 生成结果，并继续在画布上排列结果。
7. 当您需要更清晰的最终图像时，请对选定的输出进行放大。

## 技术栈

- React 19
- TypeScript
- Vite
- Express
- Right Codes Draw API
- Tailwind CSS v4
- Motion
- esbuild，用于生产服务器打包

## 入门

### 先决条件

- 推荐使用 Node.js 20+
- Right Codes Draw 的 API 密钥

### Codex / Cursor 运行

1. 在 Codex 中新建一个文件夹。
2. 在对话框中输入：

```text
https://github.com/kacey221/Local-ai-image.git
```

3. 下载并运行这个程序。
4. 接下来让 Codex 自行继续运行；如果中途遇到问题，Codex 会有提示，只需要按照它的建议操作，直到运行成功。

### 电脑本地运行

请按照以下步骤操作：

1. 检查电脑上是否安装了 Node.js 20+。

打开终端：

- 按 `Win + R`
- 在弹出的对话框中输入 `powershell`
- 按回车

执行：

```bash
node -v
```

或：

```bash
node --version
```

判断方式：

- 输出 `v20.15.0`、`v22.4.1` 等：已安装 20+ 版本
- 输出 `v18.20.3`、`v16.20.2` 等：版本低于 20，不符合，建议更新
- 提示 `'node' 不是内部或外部命令`：说明未安装或未配置环境变量

2. 如果没有安装 Node.js，请先安装。

Node 下载地址：

- [https://nodejs.org/en/download](https://nodejs.org/en/download)

说明：

- Node 是基础运行环境，后面很多东西依赖它
- 安装完成后，可再次在终端输入 `node -v` 验证

3. 进入项目文件夹。

如果项目还没有下载，请先执行：

```bash
git clone https://github.com/kacey221/Local-ai-image.git
cd Local-ai-image
```

如果项目已经在本地，则直接进入保存该项目的文件夹，例如：

```powershell
cd E:\kacey\codex\Local-ai-image-main
```

4. 安装依赖项：

```bash
npm install
```

5. 复制示例环境文件：

```bash
cp .env.example .env
```

如果您在 Windows 系统上使用 PowerShell，也可以运行以下命令：

```powershell
Copy-Item .env.example .env
```

6. 打开 `.env` 并设置您的 Right Codes 密钥：

```env
RIGHTCODES_API_KEY=your_api_key_here
```

Right Codes 官网：

- [https://www.right.codes](https://www.right.codes)

说明：

- 开始可以先充 1 元试试，1 元通常也可以生成很多张图
- 邀请码：`02770667`

7. 启动本地开发服务器：

```bash
npm run dev
```

8. 打开浏览器并访问：

- [http://localhost:3000](http://localhost:3000)

9. 确认应用正在运行：

- 终端应该打印类似如下的一行：`Server running on http://0.0.0.0:3000`
- 访问 [http://localhost:3000/api/config-status](http://localhost:3000/api/config-status) 应该返回 JSON
- 画布用户界面应该在浏览器中加载

开发服务器在单个端口上同时运行 Express 后端和 Vite 前端。

## 环境变量

当前版本仅需要 `RIGHTCODES_API_KEY`。

| 变量 | 必需的 | 笔记 |
| --- | --- | --- |
| `RIGHTCODES_API_KEY` | 是的 | 用于主动图像生成和放大路径 |
| `APP_URL` | 不 | 面向部署的占位符；本地开发不需要 |

## 可用脚本

```bash
npm run dev
```

启动本地全栈开发服务器：

- `http://localhost:3000`

```bash
npm run build
```

使用 Vite 构建前端，并将服务器打包到：

- `dist/server.cjs`

```bash
npm run start
```

运行生产包：

- `dist/`

```bash
npm run lint
```

运行 TypeScript 类型检查：

```bash
tsc --noEmit
```

```bash
npm test
```

使用 Node 测试运行器运行仓库中的 `.test.ts` 文件，底层命令为 `tsx`，这是当前 TypeScript + ESM 设置所必需的。

## API 概述

### 活动路由

- `GET /api/config-status`
- `POST /api/rightcodes/generate-image`
- `POST /api/rightcodes/upscale-image`

### 兼容性路由

- `POST /api/gemini/generate-image`

此路由目前是 Right Codes 生成处理程序的别名，因此旧的前端调用仍然有效。

### 旧版占位符或已禁用路由

- `POST /api/gemini/enhance-prompt`
- `POST /api/gemini/edit-image`
- `POST /api/gemini/upscale-image`
- `POST /api/gemini/outpaint-image`
- `POST /api/gemini/cutout-image`

`/api/gemini/enhance-prompt` 目前直接返回原始提示信息，未做任何更改。图像编辑、抠图、裁剪和 Gemini 放大等功能仅保留 `410 Gone`，在此版本中以保持兼容性和功能正常。

## 注释和限制

- 该仓库目前仅以 Right Codes 构建方式运行。
- 多参考图像生成后，会被合并成一张单独的联系表图像，然后再发送到上游服务器。
- 提示增强是当前服务器中的一个直通占位符。
- 即使路由生成由 Right Codes 处理，但仍有一些路由名称为了向后兼容而使用 `gemini`。
- 该应用不包含持久化、身份验证或多人协作编辑功能。

## 这份自述文件存在的意义

该代码库基于通用模板创建，因此本 README 文件主要关注当前代码库中实际存在的行为。如果您持续开发该产品，则需要更新的最重要部分包括：

- 环境变量
- 活跃的 API 路由
- 支持的生成工作流程
- 功能限制
