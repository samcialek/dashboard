const fs = require('fs');
const script = fs.readFileSync('briefs/causal-robustness-frameworks-tts.md','utf8');
const parts = script.split(/^## Part \d+$/m).filter(s=>s.trim());
parts.forEach((p,i) => {
  const text = p.trim().replace(/\u2018|\u2019/g,"'").replace(/\u201C|\u201D/g,'"').replace(/\u2014|\u2013/g,', ');
  const body = JSON.stringify({text, model_id:'eleven_v3', voice_settings:{stability:0.5,similarity_boost:0.75}});
  fs.writeFileSync('dashboard-repo/audio/chunk'+(i+1)+'.json', body);
  console.log('Chunk '+(i+1)+': '+text.length+' chars');
});
