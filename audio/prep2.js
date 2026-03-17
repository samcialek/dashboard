const fs = require('fs');
const script = fs.readFileSync('briefs/causal-robustness-frameworks-tts.md','utf8');
const parts = script.split(/^## Part \d+$/m).filter(s=>s.trim());
// Skip first chunk (just title), start from index 1
for(let i=1; i<parts.length; i++) {
  const text = parts[i].trim();
  const body = JSON.stringify({text, model_id:'eleven_v3', voice_settings:{stability:0.5,similarity_boost:0.75}});
  fs.writeFileSync('dashboard-repo/audio/chunk'+i+'.json', body);
  console.log('Part '+i+': '+text.length+' chars');
}
