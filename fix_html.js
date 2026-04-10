const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');
const files = fs.readdirSync(frontendDir).filter(f => f.endsWith('.html'));

for(let file of files) {
  const filePath = path.join(frontendDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove the old injected script and style
  content = content.replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>\s*/g, '');
  content = content.replace(/<style type="text\/tailwindcss">[\s\S]*?<\/style>/g, '');
  
  // Add the CSS link if not present
  if (!content.includes('href="style.css"')) {
    content = content.replace('</head>', '    <link rel="stylesheet" href="style.css">\n</head>');
  }
  
  fs.writeFileSync(filePath, content);
}
console.log('HTML files cleaned and linked to style.css.');
