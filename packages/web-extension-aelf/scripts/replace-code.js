#!/usr/bin/env node
/* eslint-disable */
const fs = require('fs');
const path = require('path');

/**
 * 代码替换脚本
 * 用于在webpack编译后对特定文件进行代码替换
 */

const OUTPUT_DIR = path.resolve(__dirname, '../app/public');
const TARGET_FILES = ['js/content.js', 'js/inject.js', 'js/popup.js', 'js/prompt.js', 'js/serviceWorker.js'];

/**
 * 执行代码替换
 * @param {string} filePath - 文件路径
 * @param {string} content - 文件内容
 * @returns {string} - 替换后的内容
 */
function replaceCode(filePath, content) {
  let replaced = content;
  let totalReplacements = 0;

  // 1: return Function("return function*() {}")() -> return function*() {}
  const case1Pattern = /return\s+Function\("return function\*\(\) \{\}"\)\(\)/g;
  const case1Matches = replaced.match(case1Pattern);
  if (case1Matches) {
    replaced = replaced.replace(case1Pattern, 'return function* () {}');
    totalReplacements += case1Matches.length;
    console.log(`  Case1: ${case1Matches.length} replacements`);
  }

  // 2: Function('return this')() / new Function('return this')() / new Function("return this")() -> globalThis
  const case2Pattern = /(?:new\s+)?Function\(['"]return this['"]\)\(\)/g;
  const case2Matches = replaced.match(case2Pattern);
  if (case2Matches) {
    replaced = replaced.replace(case2Pattern, 'globalThis');
    totalReplacements += case2Matches.length;
    console.log(`  Case2: ${case2Matches.length} replacements`);
  }

  // 3: return _Function_(source)(); 或 return Function(source)();
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
    totalReplacements += case3Matches.length;
    console.log(`  Case3: ${case3Matches.length} replacements`);
  }

  // 4: Function("r","regeneratorRuntime = r")(i)
  const case4Pattern = /\bFunction\s*\(\s*["']r["'],\s*["']regeneratorRuntime\s*=\s*r["']\s*\)\s*\(\s*([^)]*)\s*\)/g;
  const case4Matches = replaced.match(case4Pattern);
  if (case4Matches) {
    replaced = replaced.replace(
      case4Pattern,
      `regeneratorRuntime = $1`,
    );
    totalReplacements += case4Matches.length;
    console.log(`  Case4: ${case4Matches.length} replacements`);
  }

  // 5-1:
  // bound = Function('binder', 'return function (' + joiny(boundArgs, ',') + '){ return binder.apply(this,arguments); }')(binder);
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
    totalReplacements += case5Matches.length;
    console.log(`  Case5-1: ${case5Matches.length} replacements`);
  }
  // 5-2:
  // o=Function("binder","return function ("+function(e,t){for(var r="",n=0;n<e.length;n+=1)r+=e[n],n+1<e.length&&(r+=",");return r}(u)
  const case52Pattern = /\bFunction\s*\(\s*["']binder["']\s*,\s*["']return function\s*\(\s*.*?function\s*\(.*?\)\s*\{[^}]+\}(.*?)\)\s*\{.*?\}\s*['"]\)/g;
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
    totalReplacements += case52Matches.length;
    console.log(`  Case5-2: ${case52Matches.length} replacements`);
  }

  // 6:
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
    totalReplacements += case6Matches.length;
    console.log(`  Case6: ${case6Matches.length} replacements`);
  }

  // 7:
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
    totalReplacements += case7Matches.length;
    console.log(`  case7: ${case7Matches.length} replacements`);
  }

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
    totalReplacements += caseFunctionFinalMatches.length;
    console.log(`  caseFunctionFinal: ${caseFunctionFinalMatches.length} replacements`);
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
};
