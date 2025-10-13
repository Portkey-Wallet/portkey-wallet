#!/usr/bin/env node
/* eslint-disable */
const fs = require('fs');
const path = require('path');

/**
 * 代码替换脚本
 * 用于在webpack编译后对特定文件进行代码替换
 */

const OUTPUT_DIR = path.resolve(__dirname, '../app/public');
const TARGET_FILES = ['js/content.js', 'js/inject.js', 'js/popup.js', 'js/prompt.js', 'js/serviceWorker.js', 'js/sandboxUtil.js'];

/**
 * 规则配置
 * 每个规则可以指定适用的文件
 */
const RULE_CONFIG = {
  // 规则1-7和FunctionFinal：适用于所有文件，除了sandboxUtil.js
  case1: { files: ['js/content.js', 'js/inject.js', 'js/popup.js', 'js/prompt.js', 'js/serviceWorker.js'] },
  case2: { files: ['js/content.js', 'js/inject.js', 'js/popup.js', 'js/prompt.js', 'js/serviceWorker.js'] },
  case3: { files: ['js/content.js', 'js/inject.js', 'js/popup.js', 'js/prompt.js', 'js/serviceWorker.js'] },
  case4: { files: ['js/content.js', 'js/inject.js', 'js/popup.js', 'js/prompt.js', 'js/serviceWorker.js'] },
  case5: { files: ['js/content.js', 'js/inject.js', 'js/popup.js', 'js/prompt.js', 'js/serviceWorker.js'] },
  case52: { files: ['js/content.js', 'js/inject.js', 'js/popup.js', 'js/prompt.js', 'js/serviceWorker.js'] },
  case6: { files: ['js/content.js', 'js/inject.js', 'js/popup.js', 'js/prompt.js', 'js/serviceWorker.js'] },
  case7: { files: ['js/content.js', 'js/inject.js', 'js/popup.js', 'js/prompt.js', 'js/serviceWorker.js'] },
  caseFunctionFinal: { files: ['js/content.js', 'js/inject.js', 'js/popup.js', 'js/prompt.js', 'js/serviceWorker.js'] },

  // 规则8和8-1：适用于所有文件
  case81: { files: 'all' },
  case8: { files: 'all' }
};

/**
 * 检查规则是否适用于当前文件
 * @param {string} ruleName - 规则名称
 * @param {string} filePath - 文件路径
 * @returns {boolean} - 是否适用
 */
function isRuleApplicable(ruleName, filePath) {
  const config = RULE_CONFIG[ruleName];
  if (!config) return true; // 如果没有配置，默认适用所有文件

  if (config.files === 'all') return true;

  const fileName = filePath.split('/').pop(); // 获取文件名
  return config.files.includes(fileName);
}

/**
 * 执行单个规则替换
 * @param {string} ruleName - 规则名称
 * @param {string} filePath - 文件路径
 * @param {string} content - 文件内容
 * @returns {Object} - { content: 替换后的内容, replacements: 替换次数 }
 */
function applyRule(ruleName, filePath, content) {
  if (!isRuleApplicable(ruleName, filePath)) {
    return { content, replacements: 0 };
  }

  let replaced = content;
  let replacements = 0;

  switch (ruleName) {
    case 'case1':
      // return Function("return function*() {}")() -> return function*() {}
      const case1Pattern = /return\s+Function\("return function\*\(\) \{\}"\)\(\)/g;
      const case1Matches = replaced.match(case1Pattern);
      if (case1Matches) {
        replaced = replaced.replace(case1Pattern, 'return function* () {}');
        replacements += case1Matches.length;
        console.log(`  Case1: ${case1Matches.length} replacements`);
      }
      break;

    case 'case2':
      // Function('return this')() / new Function('return this')() / new Function("return this")() -> globalThis
      const case2Pattern = /(?:new\s+)?Function\(['"]return this['"]\)\(\)/g;
      const case2Matches = replaced.match(case2Pattern);
      if (case2Matches) {
        replaced = replaced.replace(case2Pattern, 'globalThis');
        replacements += case2Matches.length;
        console.log(`  Case2: ${case2Matches.length} replacements`);
      }
      break;

    case 'case3':
      // return _Function_(source)(); 或 return Function(source)();
      const case3Pattern = /return\s+[_]*Function[_]*\([^)]*\)\(\)/g;
      const case3Matches = replaced.match(case3Pattern);
      if (case3Matches) {
        replaced = replaced.replace(
          case3Pattern,
          `return function () {
    console.warn("Static fallback logic executed!");
    return {};
};`,
        );
        replacements += case3Matches.length;
        console.log(`  Case3: ${case3Matches.length} replacements`);
      }
      break;

    case 'case4':
      // Function("r","regeneratorRuntime = r")(i)
      const case4Pattern = /\bFunction\s*\(\s*["']r["'],\s*["']regeneratorRuntime\s*=\s*r["']\s*\)\s*\(\s*([^)]*)\s*\)/g;
      const case4Matches = replaced.match(case4Pattern);
      if (case4Matches) {
        replaced = replaced.replace(case4Pattern, `regeneratorRuntime = $1`);
        replacements += case4Matches.length;
        console.log(`  Case4: ${case4Matches.length} replacements`);
      }
      break;

    case 'case5':
      // bound = Function('binder', 'return function (' + joiny(boundArgs,',') + '){ return binder.apply(this,arguments); }')(binder);
      const case5Pattern = /\bFunction\s*\(\s*['"]binder['"]\s*,\s*['"]return function\s*\(.*?\)\s*\{[^}]*\}\s*['"]\)/g;
      const case5Matches = replaced.match(case5Pattern);
      if (case5Matches) {
        replaced = replaced.replace(
          case5Pattern,
          `
      function (binder) {
          return function (...args) {
              return binder.apply(this, args);
          };
      }
      `,
        );
        replacements += case5Matches.length;
        console.log(`  Case5-1: ${case5Matches.length} replacements`);
      }
      break;

    case 'case52':
      // o=Function("binder","return function ("+function(e,t){for(var r="",n=0;n<e.length;n+=1)r+=e[n],n+1<e.length&&(r+=",");return r}(u)
      const case52Pattern = /\bFunction\s*\(\s*["']binder["']\s*,\s*["']return function\s*\(\s*.*?function\s*\(.*?\)\s*\{[^}]+\\}(.*?)\)\s*\{.*?\}\s*['"]\)/g;
      const case52Matches = replaced.match(case52Pattern);
      if (case52Matches) {
        replaced = replaced.replace(
          case52Pattern,
          `
      function (binder) {
          return function (...args) {
              return binder.apply(this, args);
          };
      }
      `,
        );
        replacements += case52Matches.length;
        console.log(`  Case5-2: ${case52Matches.length} replacements`);
      }
      break;

    case 'case6':
      // =Function, =Function; = Function, = Function;
      const case6Pattern = /=\s*Function(\s*[;,])/g;
      const case6Matches = replaced.match(case6Pattern);
      if (case6Matches) {
        replaced = replaced.replace(
          case6Pattern,
          `= function () {
                      console.warn("Dynamic Function constructor is disabled. Case6");
                  }$1`,
        );
        replacements += case6Matches.length;
        console.log(`  Case6: ${case6Matches.length} replacements`);
      }
      break;

    case 'case7':
      // "%eval%":eval | '%eval%': eval ...
      const case7Pattern = /(['"])%eval%\1\s*:\s*eval/g;
      const case7Matches = replaced.match(case7Pattern);
      if (case7Matches) {
        replaced = replaced.replace(
          case7Pattern,
          `$1%eval%$1: function () {
                      console.warn("Dynamic eval has been disabled.");
                  }`,
        );
        replacements += case7Matches.length;
        console.log(`  case7: ${case7Matches.length} replacements`);
      }
      break;

    case 'caseFunctionFinal':
      // FunctionFinal: Function(...) {}
      const caseFunctionFinalPattern = /\bFunction\s*\(([^)]*)\)\s*\{/g;
      const caseFunctionFinalMatches = replaced.match(caseFunctionFinalPattern);
      if (caseFunctionFinalMatches) {
        replaced = replaced.replace(
          caseFunctionFinalPattern,
          `function () {
    console.warn("Dynamic Function replaced");
    return {};
};`,
        );
        replacements += caseFunctionFinalMatches.length;
        console.log(`  caseFunctionFinal: ${caseFunctionFinalMatches.length} replacements`);
      }
      break;

    case 'case81':
      // setTGScript method replacement (specific format with async and compressed code)
      const case81Pattern = /static\s+async\s+setTGScript\(\)\s*\{\s*if\s*\(\s*typeof\s+document\s*>\s*["']u["']\s*\)\s*return;\s*const\s+\w+\s*=\s*document\.createElement\(["']script["']\);\s*\w+\.src\s*=\s*["']https:\/\/telegram\.org\/js\/telegram-web-app\.js["'],\s*document\.body\.appendChild\(\w+\),\s*\w+\s*\?\s*\.addEventListener\(["']load["'],\s*\(\)\s*=>\s*\{\}\)\s*\}/g;
      // multi () support, like () => {}) & (() => {}))
      // /static\s+async\s+setTGScript\(\)\s*\{\s*if\s*\(\s*typeof\s+document\s*>\s*["']u["']\s*\)\s*return;\s*const\s+\w+\s*=\s*document\.createElement\(["']script["']\);\s*\w+\.src\s*=\s*["']https:\/\/telegram\.org\/js\/telegram-web-app\.js["'],\s*document\.body\.appendChild\(\w+\),\s*\w+\s*\?\s*\.addEventListener\(["']load["'],\s*\({0,2}\s*\(\)\s*=>\s*\{\}\s*\){0,2}\)\s*\}/g;
      const case81Matches = replaced.match(case81Pattern);
      if (case81Matches) {
        replaced = replaced.replace(
          case81Pattern,
          `static async setTGScript() {
    console.warn("setTGScript method has been disabled");
}`,
        );
        replacements += case81Matches.length;
        console.log(`  Case8-1: ${case81Matches.length} replacements`);
      }
      break;

    case 'case8':
      // setTGScript method replacement (unified pattern for all formats)
      const case8Pattern = /static\s+setTGScript\(\)\s*\{[\s\S]*?\}(?:\s*[}\)];?\s*)*/g;
      const case8Matches = replaced.match(case8Pattern);
      if (case8Matches) {
        replaced = replaced.replace(
          case8Pattern,
          `static setTGScript() {
    console.warn("setTGScript method has been disabled");
}`,
        );
        replacements += case8Matches.length;
        console.log(`  Case8: ${case8Matches.length} replacements`);
      }
      break;

    default:
      console.warn(`  Unknown rule: ${ruleName}`);
  }

  return { content: replaced, replacements };
}

/**
 * 执行代码替换
 * @param {string} filePath - 文件路径
 * @param {string} content - 文件内容
 * @returns {string} - 替换后的内容
 */
function replaceCode(filePath, content) {
  let replaced = content;
  let totalReplacements = 0;

  // 按顺序应用所有规则
  const ruleNames = Object.keys(RULE_CONFIG);
  for (const ruleName of ruleNames) {
    const result = applyRule(ruleName, filePath, replaced);
    replaced = result.content;
    totalReplacements += result.replacements;
  }

  return { content: replaced, replacements: totalReplacements };
}

/**
 * 处理单个文件
 * @param {string} relativePath - 相对路径
 */
function processFile(relativePath) {
  const fullPath = path.join(OUTPUT_DIR, relativePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${relativePath}`);
    return;
  }

  try {
    console.log(`📝 Processing: ${relativePath}`);

    const originalContent = fs.readFileSync(fullPath, 'utf8');
    const { content: newContent, replacements } = replaceCode(fullPath, originalContent);

    if (replacements > 0) {
      fs.writeFileSync(fullPath, newContent, 'utf8');
      console.log(`✅ ${relativePath}: ${replacements} total replacements made`);
    } else {
      console.log(`ℹ️  ${relativePath}: No replacements needed`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${relativePath}:`, error.message);
  }
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 Starting code replacement process...');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);

  let processedFiles = 0;
  let totalReplacements = 0;

  TARGET_FILES.forEach((relativePath) => {
    const fullPath = path.join(OUTPUT_DIR, relativePath);
    if (fs.existsSync(fullPath)) {
      processFile(relativePath);
      processedFiles++;
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Files processed: ${processedFiles}`);
  console.log(`   Target files: ${TARGET_FILES.length}`);
  console.log('✨ Code replacement completed!');
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  replaceCode,
  processFile,
  main,
  RULE_CONFIG,
  isRuleApplicable,
};
