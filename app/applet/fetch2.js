import https from 'https';
https.get('https://gwiav5oqbgrs2.ok.kimi.link/assets/index-C5vGwYuP.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const classNames = data.match(/className:"[^"]*"/g);
    if (classNames) {
      console.log("CLASSNAMES:");
      console.log(classNames.slice(0, 50).join('\n'));
    }
    const texts = data.match(/>([^<]+)</g);
    if (texts) {
      console.log("TEXTS:");
      console.log(texts.slice(0, 50).join('\n'));
    }
    
    const strings = data.match(/"([^"\\]*(\\.[^"\\]*)*)"/g);
    if (strings) {
      const filtered = strings.filter(s => s.length > 20 && !s.includes('className') && !s.includes('function') && !s.includes('return'));
      console.log("STRINGS:");
      console.log(filtered.slice(0, 50).join('\n'));
    }
  });
});
