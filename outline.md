# 常用工具网站项目大纲

## 文件结构

### 主要页面文件
- **index.html** - 主页面，展示4个工具分类
- **code-tools.html** - 代码工具页面（重点开发）
- **text-tools.html** - 文本处理工具页面（占位）
- **image-tools.html** - 图像工具页面（占位）
- **network-tools.html** - 网络工具页面（占位）

### 资源文件
- **main.js** - 主要JavaScript逻辑
- **resources/** - 图片和媒体资源文件夹
  - **tool-icons/** - 工具图标集合
  - **backgrounds/** - 背景图片
  - **examples/** - 示例代码文件

## 页面功能分配

### index.html - 主页面
**功能**：
- 展示4个工具分类标签
- 每个分类显示工具卡片网格
- 工具图标和简介
- 点击跳转到对应工具页面

**内容区域**：
- 简洁的头部导航
- 4个分类标签（代码工具、文本处理、图像工具、网络工具）
- 每个分类显示3x4的工具卡片网格
- 页脚版权信息

**视觉效果**：
- 工具卡片悬停动画
- 标签切换平滑过渡
- 背景粒子效果

### code-tools.html - 代码工具页面（核心）
**功能**：
- 代码混淆工具（主要功能）
- 代码格式化工具
- AI编程关键词工具
- 代码压缩工具（占位）

**代码混淆工具界面**：
- 左侧：代码输入区域（支持拖拽和粘贴）
- 右侧：混淆结果预览
- 底部：混淆选项面板（自动检测并勾选）
- 侧边：统计信息和操作按钮

**代码格式化工具界面**：
- 格式化选项选择
- 文件拆分功能
- 注释生成工具
- 错误修复选项

**AI关键词工具界面**：
- 预设指令模板
- 关键词快速插入
- 自定义指令保存

### 其他工具页面（占位）
**text-tools.html**：
- 文本替换工具（图标和简介）
- 文本加密工具
- 文本对比工具
- 更多文本工具...

**image-tools.html**：
- 图像压缩工具
- 格式转换工具
- Base64转换工具
- 更多图像工具...

**network-tools.html**：
- URL编码工具
- 时间戳转换工具
- JSON格式化工具
- 更多网络工具...

## JavaScript模块结构

### main.js 主要模块
```javascript
// 工具分类和导航模块
const ToolCategories = {
  codeTools: [...],
  textTools: [...],
  imageTools: [...],
  networkTools: [...]
};

// 代码混淆核心模块
const CodeObfuscator = {
  detectType(code),
  removeComments(code, type),
  compressWhitespace(code),
  renameVariables(code),
  encodeStrings(code),
  obfuscate(code, options)
};

// 代码格式化模块
const CodeFormatter = {
  formatHTML(code),
  formatJS(code),
  formatCSS(code),
  fixErrors(code),
  splitFiles(code),
  addComments(code, type)
};

// AI关键词模块
const AIKeywords = {
  templates: [...],
  insertKeyword(keyword),
  customTemplate(template)
};

// UI交互模块
const UI = {
  initAnimations(),
  handleTabSwitch(),
  updateProgress(),
  showNotification(message)
};
```

## 资源需求

### 图标设计
- 每个工具需要独特的图标
- 统一风格：线性图标，橙色主题
- 尺寸：64x64px，PNG格式

### 示例代码
- HTML混合代码示例
- JS复杂函数示例
- CSS样式表示例
- 用于演示混淆和格式化效果

### 背景素材
- 几何图形装饰
- 代码字符纹理
- 渐变背景图片