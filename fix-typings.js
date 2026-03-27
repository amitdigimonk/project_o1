const fs = require('fs');
const path = require('path');

const dir = 'd:/PROJECT/vibe-walls/react-native-template/components/ChillMode';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(f => {
  const p = path.join(dir, f);
  let cnt = fs.readFileSync(p, 'utf8');
  const newCnt = cnt.replace(/createAnimatedComponent\(([a-zA-Z]+)\)(?! as any)/g, 'createAnimatedComponent($1) as any');
  if (cnt !== newCnt) {
    fs.writeFileSync(p, newCnt);
    console.log('Fixed', f);
  }
});
console.log('Done fixing components.');
