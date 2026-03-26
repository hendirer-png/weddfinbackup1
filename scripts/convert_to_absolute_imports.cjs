const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../src');

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, fileList);
    } else {
      if (/\.(ts|tsx|js|jsx)$/.test(filePath) && !filePath.includes('node_modules') && !filePath.includes('dist')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const files = findFiles(srcDir);
let modifiedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const dirName = path.dirname(file);
  
  // Match imports and exports from relative paths
  // e.g. import ... from './...'
  // e.g. export ... from '../...'
  // e.g. import './style.css'
  const regex = /(from\s+|import\s+)(['"])(\.\.?\/[^'"]+)(['"])/g;
  
  let modified = false;
  content = content.replace(regex, (match, prefix, q1, importPath, q2) => {
    const absoluteImportPath = path.resolve(dirName, importPath);
    
    if (absoluteImportPath.startsWith(srcDir) || absoluteImportPath === srcDir) {
      let relativeToSrc = path.relative(srcDir, absoluteImportPath);
      relativeToSrc = relativeToSrc.split(path.sep).join('/'); // Normalize to forward slash
      
      const newImportPath = relativeToSrc === '' ? '@' : `@/${relativeToSrc}`;
      modified = true;
      return `${prefix}${q1}${newImportPath}${q2}`;
    }
    return match;
  });
  
  // Match dynamic imports
  // e.g. import('./...')
  const dynamicRegex = /(import\()(['"])(\.\.?\/[^'"]+)(['"])\)/g;
  content = content.replace(dynamicRegex, (match, prefix, q1, importPath, q2) => {
    const absoluteImportPath = path.resolve(dirName, importPath);
    
    if (absoluteImportPath.startsWith(srcDir) || absoluteImportPath === srcDir) {
      let relativeToSrc = path.relative(srcDir, absoluteImportPath);
      relativeToSrc = relativeToSrc.split(path.sep).join('/');
      
      const newImportPath = relativeToSrc === '' ? '@' : `@/${relativeToSrc}`;
      modified = true;
      return `${prefix}${q1}${newImportPath}${q2})`;
    }
    return match;
  });

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log(`Updated: ${path.relative(srcDir, file).split(path.sep).join('/')}`);
  }
}

console.log(`\nConversion complete. Updated ${modifiedCount} files.`);
