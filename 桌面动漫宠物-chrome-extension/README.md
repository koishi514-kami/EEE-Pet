# 桌面动漫宠物 · Chrome 扩展

一个常驻在所有网页上的动漫小人：拖着走、点一下摸摸、双击打开面板；面板里有养成互动、AI 聊天、页面管家和设置。

## 安装（加载已解压的扩展程序）

1. 打开 Chrome，地址栏输入 `chrome://extensions/`
2. 打开右上角的 **开发者模式**
3. 点 **加载已解压的扩展程序**，选择本目录（含 `manifest.json` 的这个文件夹）
4. 随便打开一个普通网页，小人会出现在右下角

装好后可以点工具栏里的图标打开设置页。

## 使用

| 操作 | 效果 |
| --- | --- |
| 单击小人 | 摸摸它（好感度 +3，经验 +6） |
| 双击小人 | 打开 / 收起面板 |
| 拖动小人 | 换位置（位置会记住） |
| 双击面板标题栏 | 也可以拖动面板；点面板外面任意处关闭 |

面板分四页：

- **聊天**：和它说话；勾上「让它看到当前页面」后，它会带上本页正文一起回答
- **养成**：好感度 / 饱食度 / 精力 / 经验，喂食、摸摸、陪玩、休息；番茄钟和喝水提醒
- **管家**：一键净化当前页面（收起广告、悬浮层、侧栏推荐）、暗色模式、阅读模式、朗读本页、AI 总结本页
- **设置**：改名、选模型、开关自己冒话 / 眼神跟随 / 番茄钟、调整时长、重置存档

存档由扩展后台在所有网站之间共享同一份：换标签页、关掉再打开，等级和好感都还在。

## AI 接口配置（可选）

「聊天」和「总结本页」需要一个 OpenAI 兼容接口。点工具栏图标打开设置页填写：

| 平台 | 接口地址 | 模型示例 |
| --- | --- | --- |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` |
| DeepSeek | `https://api.deepseek.com/v1` | `deepseek-chat` |
| 通义千问 | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `qwen-plus` |
| 本地 Ollama | `http://localhost:11434/v1` | `qwen2.5` |

请求由扩展后台发出，不经过网页，因此不受页面 CSP 限制；API Key 只写在本机 `chrome.storage` 里，不会上传到别处。

不配置接口也能正常使用养成、番茄钟、喝水提醒、清理干扰、暗色 / 阅读模式、朗读，只有 AI 相关功能会提示去配置。

## 权限说明

| 权限 | 用途 |
| --- | --- |
| `storage` | 保存宠物存档和 AI 接口配置（不含任何页面数据） |
| `host_permissions: <all_urls>` | 让小人能在你浏览的任意网站上出现 |

扩展不收集、不上传任何浏览数据；只有你在聊天页主动发消息时，才会把当前页面正文（可取消勾选）和你输入的文本发给你自己配置的 AI 接口。

## 目录结构（开发者）

```
manifest.json        扩展清单（MV3）
content.js           打包产物：注入到每个页面的插件本体（勿手改）
background.js        service worker：代理 AI 请求 + 首次安装打开设置页
options.html/js      设置页
icons/               工具栏图标 16/32/48/128
assets/pet/*.png     立绘（web_accessible_resources）
```

本目录的 `content.js` 是构建产物。源码在工作区里，改动后重新生成：

```
run build/build-extension.ts    # 源码 → extension/content.js
run build/make-icons.ts         # 生成图标
run build/make-zip.ts           # 打成 zip 方便分发
```

构建用浏览器版 esbuild（esbuild-wasm）+ `@vue/compiler-sfc`，把 `src/*.ts` + `components/*.vue` 编译成单个 classic script；
`extension-src/lf-shim.ts` 提供与 PluginX 运行时同名同形的 `LFRuntime / LFDOM / LFStore / LFModel`，
于是同一套业务源码既能当用户脚本跑，也能当原生扩展跑。
