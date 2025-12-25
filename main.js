// 常用工具集合 - 主要JavaScript逻辑

// 工具导航切换
function initToolNavigation() {
    const navBtns = document.querySelectorAll('.tool-nav-btn');
    const sections = document.querySelectorAll('.tool-section');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTool = this.dataset.tool;
            
            // 更新按钮状态
            navBtns.forEach(b => {
                b.classList.remove('active');
                b.classList.add('bg-gray-700', 'text-gray-300');
                b.classList.remove('bg-gradient-to-r', 'from-orange-400', 'to-orange-600', 'text-white');
            });
            this.classList.add('active');
            this.classList.remove('bg-gray-700', 'text-gray-300');
            this.classList.add('bg-gradient-to-r', 'from-orange-400', 'to-orange-600', 'text-white');
            
            // 显示对应工具
            sections.forEach(section => {
                if (section.id === targetTool) {
                    section.classList.add('active');
                    // 动画效果
                    anime({
                        targets: section,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        duration: 400,
                        easing: 'easeOutQuart'
                    });
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });
}

// 代码类型检测
function detectCodeType(code) {
    const trimmedCode = code.trim();
    if (!trimmedCode) return 'empty';
    
    let htmlScore = 0;
    let jsScore = 0;
    let cssScore = 0;
    
    // HTML检测
    const htmlPatterns = [
        /<html\b/i, /<body\b/i, /<div\b/i, /<span\b/i, /<p\b/i,
        /<script\b/i, /<style\b/i, /<link\b/i, /<meta\b/i
    ];
    
    // JavaScript检测
    const jsPatterns = [
        /function\s*\(/, /\bvar\b/, /\blet\b/, /\bconst\b/, /=>/,
        /\bif\s*\(/, /\bfor\s*\(/, /\bwhile\s*\(/, /console\.log/,
        /document\./, /window\./, /addEventListener/
    ];
    
    // CSS检测
    const cssPatterns = [
        /[{]\s*[a-zA-Z-]+\s*:/, /\bcolor\s*:/, /\bwidth\s*:/, /\bheight\s*:/,
        /\bmargin\s*:/, /\bpadding\s*:/, /@media\s/, /\bclass\s*[{]/
    ];
    
    // 计算匹配分数
    htmlPatterns.forEach(pattern => {
        if (pattern.test(trimmedCode)) htmlScore++;
    });
    
    jsPatterns.forEach(pattern => {
        if (pattern.test(trimmedCode)) jsScore++;
    });
    
    cssPatterns.forEach(pattern => {
        if (pattern.test(trimmedCode)) cssScore++;
    });
    
    // 判断类型
    const maxScore = Math.max(htmlScore, jsScore, cssScore);
    if (maxScore === 0) return 'unknown';
    
    if (htmlScore > 0 && (jsScore > 0 || cssScore > 0)) return 'mixed';
    if (htmlScore === maxScore) return 'html';
    if (jsScore === maxScore) return 'javascript';
    if (cssScore === maxScore) return 'css';
    
    return 'unknown';
}

// 代码混淆功能
const CodeObfuscator = {
    // 移除注释
    removeComments(code, type) {
        let result = code;
        
        if (type === 'javascript' || type === 'mixed') {
            // 移除JS单行和多行注释
            result = result.replace(/\/\/.*$/gm, '');
            result = result.replace(/\/\*[\s\S]*?\*\//g, '');
        }
        
        if (type === 'css' || type === 'mixed') {
            // 移除CSS注释
            result = result.replace(/\/\*[\s\S]*?\*\//g, '');
        }
        
        if (type === 'html' || type === 'mixed') {
            // 移除HTML注释，但保留条件注释
            result = result.replace(/<!--(?!\[if\s|\<!\[endif\])[\s\S]*?-->/g, '');
        }
        
        return result;
    },
    
    // 压缩空白
    compressWhitespace(code) {
        return code
            .replace(/\s+/g, ' ')  // 多个空白转为单个空格
            .replace(/\s*([{}();,:])\s*/g, '$1')  // 移除符号周围空格
            .replace(/;\s*}/g, '}')  // 移除闭括号前的分号
            .trim();
    },
    
    // 重命名变量
    renameVariables(code) {
        // 简化的变量重命名，实际应用中需要更复杂的AST解析
        const varMap = new Map();
        let counter = 0;
        
        // 匹配变量声明
        return code.replace(/\b(var|let|const)\s+(\w+)/g, (match, keyword, varName) => {
            if (!varMap.has(varName) && varName.length > 1) {
                varMap.set(varName, String.fromCharCode(97 + (counter++ % 26)));
            }
            return `${keyword} ${varMap.get(varName) || varName}`;
        });
    },
    
    // 编码字符串
    encodeStrings(code) {
        return code.replace(/"([^"]*?)"/g, (match, content) => {
            // 简单的Unicode编码
            const encoded = content.replace(/./g, char => 
                char.length > 0 ? '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0') : ''
            );
            return `"${encoded}"`;
        });
    },
    
    // 主要混淆函数
    obfuscate(code, options) {
        let result = code;
        const type = detectCodeType(code);
        
        if (options.removeComments) {
            result = this.removeComments(result, type);
        }
        
        if (options.compressWhitespace) {
            result = this.compressWhitespace(result);
        }
        
        if (options.renameVariables) {
            result = this.renameVariables(result);
        }
        
        if (options.encodeStrings) {
            result = this.encodeStrings(result);
        }
        
        return result;
    }
};

// 代码格式化功能
const CodeFormatter = {
    formatHTML(code) {
        let indent = 0;
        const indentSize = 2;
        
        return code
            .replace(/>\s+</g, '><')  // 移除标签间空白
            .replace(/(<\/?[^>]+>)/g, (match, tag) => {
                if (tag.match(/<\/(html|head|body|div|section|article|ul|ol|table|form)>/)) {
                    indent = Math.max(0, indent - 1);
                }
                const result = '  '.repeat(indent) + tag + '\n';
                if (tag.match(/<(html|head|body|div|section|article|ul|ol|table|form)[^>]*>/)) {
                    indent++;
                }
                return result;
            })
            .trim();
    },
    
    formatJS(code) {
        // 简化的JS格式化
        return code
            .replace(/;\s*/g, ';\n')
            .replace(/{\s*/g, '{\n  ')
            .replace(/\s*}/g, '\n}')
            .replace(/\n\s*\n/g, '\n')
            .trim();
    },
    
    formatCSS(code) {
        // 简化的CSS格式化
        return code
            .replace(/\s*{/g, ' {\n  ')
            .replace(/;\s*/g, ';\n  ')
            .replace(/\s*}/g, '\n}\n')
            .replace(/\n\s*\n/g, '\n')
            .trim();
    },
    
    fixErrors(code) {
        // 简单的错误修复
        let result = code;
        
        // 修复未闭合的括号
        const openBrackets = (result.match(/\{/g) || []).length;
        const closeBrackets = (result.match(/\}/g) || []).length;
        if (openBrackets > closeBrackets) {
            result += '}'.repeat(openBrackets - closeBrackets);
        }
        
        // 修复未闭合的分号（在CSS中）
        if (detectCodeType(code) === 'css') {
            result = result.replace(/([^;{])\s*}/g, '$1; }');
        }
        
        return result;
    },
    
    splitFiles(code) {
        const type = detectCodeType(code);
        const files = { html: '', css: '', js: '' };
        
        if (type === 'html' || type === 'mixed') {
            // 提取CSS
            const cssMatches = code.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
            cssMatches.forEach(match => {
                const cssContent = match.replace(/<style[^>]*>|<\/style>/gi, '');
                files.css += cssContent + '\n';
            });
            
            // 提取JS
            const jsMatches = code.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
            jsMatches.forEach(match => {
                const jsContent = match.replace(/<script[^>]*>|<\/script>/gi, '');
                files.js += jsContent + '\n';
            });
            
            // 保留HTML结构
            files.html = code
                .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '<link rel="stylesheet" href="styles.css">')
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '<script src="script.js"></script>');
        }
        
        return files;
    }
};

// 示例代码
const exampleCodes = {
    mixed: `<!DOCTYPE html>
<html>
<head>
    <title>示例页面</title>
    <style>
        body {
            background: #f0f0f0;
            font-family: Arial, sans-serif;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>欢迎使用代码工具</h1>
        <button onclick="showMessage()">点击我</button>
    </div>
    
    <script>
        function showMessage() {
            // 显示欢迎消息
            alert('Hello, World!');
            console.log('Button clicked');
        }
        
        // 页面加载完成
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Page loaded');
        });
    </script>
</body>
</html>`,
    
    javascript: `// 计算斐波那契数列
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 数组排序函数
function sortArray(arr) {
    // 使用快速排序算法
    return arr.sort((a, b) => a - b);
}

// 事件监听器
document.addEventListener('click', function(e) {
    console.log('Clicked element:', e.target);
});`,
    
    css: `/* 基础样式重置 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* 主体样式 */
body {
    background-color: #f5f5f5;
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
}

/* 容器样式 */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* 按钮样式 */
.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}`
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initToolNavigation();
    
    // 代码输入监听
    const inputCode = document.getElementById('inputCode');
    if (inputCode) {
        inputCode.addEventListener('input', function() {
            const code = this.value;
            const type = detectCodeType(code);
            const typeDisplay = document.getElementById('codeType');
            
            const typeNames = {
                'html': 'HTML',
                'javascript': 'JavaScript',
                'css': 'CSS',
                'mixed': '混合代码',
                'unknown': '未知类型',
                'empty': '自动检测中...'
            };
            
            if (typeDisplay) {
                typeDisplay.textContent = typeNames[type] || '未知类型';
                typeDisplay.className = `px-2 py-1 text-xs rounded ${
                    type === 'empty' ? 'bg-gray-500 bg-opacity-20 text-gray-400' :
                    type === 'mixed' ? 'bg-purple-500 bg-opacity-20 text-purple-400' :
                    'bg-orange-500 bg-opacity-20 text-orange-400'
                }`;
            }
            
            // 自动勾选相关选项
            if (code.trim()) {
                document.getElementById('removeComments').checked = true;
                document.getElementById('compressWhitespace').checked = true;
                document.getElementById('renameVariables').checked = type === 'javascript' || type === 'mixed';
                document.getElementById('encodeStrings').checked = type === 'javascript' || type === 'mixed';
            }
        });
    }
});

// 混淆功能
function obfuscateCode() {
    const inputCode = document.getElementById('inputCode');
    const outputCode = document.getElementById('outputCode');
    const originalSize = document.getElementById('originalSize');
    const obfuscatedSize = document.getElementById('obfuscatedSize');
    const savedSize = document.getElementById('savedSize');
    const compressionRate = document.getElementById('compressionRate');
    
    if (!inputCode || !inputCode.value.trim()) {
        showNotification('请先输入要混淆的代码', 'error');
        return;
    }
    
    const options = {
        removeComments: document.getElementById('removeComments').checked,
        compressWhitespace: document.getElementById('compressWhitespace').checked,
        renameVariables: document.getElementById('renameVariables').checked,
        encodeStrings: document.getElementById('encodeStrings').checked
    };
    
    const originalCode = inputCode.value;
    const obfuscatedCode = CodeObfuscator.obfuscate(originalCode, options);
    
    // 更新输出
    outputCode.value = obfuscatedCode;
    
    // 更新统计
    const origSize = originalCode.length;
    const obfSize = obfuscatedCode.length;
    const saved = Math.max(0, origSize - obfSize);
    const rate = origSize > 0 ? Math.round((saved / origSize) * 100) : 0;
    
    originalSize.textContent = origSize.toLocaleString();
    obfuscatedSize.textContent = obfSize.toLocaleString();
    savedSize.textContent = saved.toLocaleString();
    compressionRate.textContent = `${rate}%`;
    
    showNotification('代码混淆完成！', 'success');
}

// 格式化功能
function formatCode() {
    const inputCode = document.getElementById('formatInput');
    const outputCode = document.getElementById('formatOutput');
    const formatType = document.getElementById('formatType').value;
    
    if (!inputCode || !inputCode.value.trim()) {
        showNotification('请先输入要格式化的代码', 'error');
        return;
    }
    
    const code = inputCode.value;
    let formatted = code;
    
    try {
        const type = formatType === 'auto' ? detectCodeType(code) : formatType;
        
        switch (type) {
            case 'html':
                formatted = CodeFormatter.formatHTML(code);
                break;
            case 'javascript':
                formatted = CodeFormatter.formatJS(code);
                break;
            case 'css':
                formatted = CodeFormatter.formatCSS(code);
                break;
            default:
                formatted = CodeFormatter.formatHTML(code);
        }
        
        outputCode.value = formatted;
        showNotification('代码格式化完成！', 'success');
    } catch (error) {
        showNotification('格式化失败：' + error.message, 'error');
    }
}

// AI关键词功能
function insertKeyword(btn) {
    const commandText = btn.querySelector('.font-medium').textContent;
    const description = btn.querySelector('.text-gray-400').textContent;
    const aiCommand = document.getElementById('aiCommand');
    
    if (aiCommand) {
        aiCommand.value += (aiCommand.value ? '\n\n' : '') + description;
        aiCommand.focus();
        
        // 动画效果
        anime({
            targets: btn,
            scale: [1, 0.95, 1],
            duration: 200,
            easing: 'easeOutQuart'
        });
    }
}

// 复制功能
function copyResult() {
    const outputCode = document.getElementById('outputCode');
    if (outputCode && outputCode.value) {
        navigator.clipboard.writeText(outputCode.value).then(() => {
            showNotification('代码已复制到剪贴板', 'success');
        }).catch(() => {
            showNotification('复制失败，请手动复制', 'error');
        });
    }
}

function copyFormattedCode() {
    const formatOutput = document.getElementById('formatOutput');
    if (formatOutput && formatOutput.value) {
        navigator.clipboard.writeText(formatOutput.value).then(() => {
            showNotification('代码已复制到剪贴板', 'success');
        }).catch(() => {
            showNotification('复制失败，请手动复制', 'error');
        });
    }
}

function copyAICommand() {
    const aiCommand = document.getElementById('aiCommand');
    if (aiCommand && aiCommand.value) {
        navigator.clipboard.writeText(aiCommand.value).then(() => {
            showNotification('AI指令已复制到剪贴板', 'success');
        }).catch(() => {
            showNotification('复制失败，请手动复制', 'error');
        });
    }
}

// 下载功能
function downloadResult() {
    const outputCode = document.getElementById('outputCode');
    if (outputCode && outputCode.value) {
        const blob = new Blob([outputCode.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'obfuscated_code.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('文件已下载', 'success');
    }
}

// 加载示例
function loadExample() {
    const inputCode = document.getElementById('inputCode');
    if (inputCode) {
        inputCode.value = exampleCodes.mixed;
        inputCode.dispatchEvent(new Event('input'));
        showNotification('已加载示例代码', 'success');
    }
}

// 清空功能
function clearInput() {
    const inputCode = document.getElementById('inputCode');
    const outputCode = document.getElementById('outputCode');
    if (inputCode) inputCode.value = '';
    if (outputCode) outputCode.value = '';
    
    // 重置统计
    document.getElementById('originalSize').textContent = '0';
    document.getElementById('obfuscatedSize').textContent = '0';
    document.getElementById('savedSize').textContent = '0';
    document.getElementById('compressionRate').textContent = '0%';
    
    showNotification('已清空输入', 'info');
}

function clearFormatInput() {
    const formatInput = document.getElementById('formatInput');
    const formatOutput = document.getElementById('formatOutput');
    if (formatInput) formatInput.value = '';
    if (formatOutput) formatOutput.value = '';
    showNotification('已清空输入', 'info');
}

function clearAICommand() {
    const aiCommand = document.getElementById('aiCommand');
    if (aiCommand) aiCommand.value = '';
    showNotification('已清空AI指令', 'info');
}

// 错误修复
function fixErrors() {
    const formatInput = document.getElementById('formatInput');
    const formatOutput = document.getElementById('formatOutput');
    
    if (!formatInput || !formatInput.value.trim()) {
        showNotification('请先输入要修复的代码', 'error');
        return;
    }
    
    const fixed = CodeFormatter.fixErrors(formatInput.value);
    formatOutput.value = fixed;
    showNotification('错误修复完成！', 'success');
}

// 文件拆分
function splitFiles() {
    const formatInput = document.getElementById('formatInput');
    
    if (!formatInput || !formatInput.value.trim()) {
        showNotification('请先输入要拆分的代码', 'error');
        return;
    }
    
    const files = CodeFormatter.splitFiles(formatInput.value);
    
    // 创建下载链接
    Object.keys(files).forEach(type => {
        if (files[type].trim()) {
            const blob = new Blob([files[type]], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = type === 'html' ? 'index.html' : type === 'css' ? 'styles.css' : 'script.js';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    });
    
    showNotification('文件已拆分并下载', 'success');
}

// 添加注释
function addComments() {
    const formatOutput = document.getElementById('formatOutput');
    const commentType = document.getElementById('commentType').value;
    
    if (!formatOutput || !formatOutput.value.trim()) {
        showNotification('请先格式化代码', 'error');
        return;
    }
    
    let commented = formatOutput.value;
    
    switch (commentType) {
        case 'line':
            commented = commented.split('\n').map(line => {
                if (line.trim() && !line.trim().startsWith('//')) {
                    return '// ' + line;
                }
                return line;
            }).join('\n');
            break;
        case 'block':
            commented = '/*\n * 代码文件\n * 生成时间: ' + new Date().toLocaleString() + '\n */\n\n' + commented;
            break;
    }
    
    formatOutput.value = commented;
    showNotification('注释添加完成', 'success');
}

// 快速添加上下文
function addContext(type) {
    const aiCommand = document.getElementById('aiCommand');
    const codeContext = document.getElementById('codeContext');
    
    if (aiCommand) {
        let context = '';
        switch (type) {
            case '替换法':
                context = '用替换法告诉我怎么改：';
                break;
            case '拆除代码':
                context = '拆除这段代码，按功能模块分离';
                break;
            case '全局变量':
                context = '增加全局变量，使函数间可以共享数据';
                break;
            case '性能优化':
                context = '优化这段代码的性能和可读性';
                break;
        }
        
        if (codeContext && codeContext.value.trim()) {
            context += '\n\n代码上下文：\n' + codeContext.value;
        }
        
        aiCommand.value += (aiCommand.value ? '\n\n' : '') + context;
        aiCommand.focus();
        showNotification('已添加上下文', 'success');
    }
}

// 通知系统
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`;
    
    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
        warning: 'bg-yellow-500 text-black'
    };
    
    notification.className += ` ${colors[type] || colors.info}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 动画显示
    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });
    
    // 3秒后自动消失
    setTimeout(() => {
        anime({
            targets: notification,
            translateX: [0, 300],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuart',
            complete: () => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }
        });
    }, 3000);
}

// 页面加载时检查URL hash来切换工具
window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        const navBtn = document.querySelector(`[data-tool="${hash}"]`);
        if (navBtn) {
            navBtn.click();
        }
    }
});

// 导出主要函数到全局作用域
window.obfuscateCode = obfuscateCode;
window.formatCode = formatCode;
window.copyResult = copyResult;
window.copyFormattedCode = copyFormattedCode;
window.copyAICommand = copyAICommand;
window.downloadResult = downloadResult;
window.loadExample = loadExample;
window.clearInput = clearInput;
window.clearFormatInput = clearFormatInput;
window.clearAICommand = clearAICommand;
window.fixErrors = fixErrors;
window.splitFiles = splitFiles;
window.addComments = addComments;
window.insertKeyword = insertKeyword;
window.addContext = addContext;