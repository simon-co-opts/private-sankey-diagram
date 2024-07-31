const fs = require('fs');
const path = require('path');

// Paths
const rootDir = path.resolve(__dirname, '../../'); // Root directory of the project
const inputDir = path.join(rootDir, 'public/data');
const outputDir = path.join(rootDir, 'src/utils/convertedd3files');

// Ensure output directory exists
if (!fs.existsSync(outputDir)){
  fs.mkdirSync(outputDir, { recursive: true });
}

// List of session files
const sessionFiles = [
  'Celebrate Your Goodness - Hayley Ep 4_pretty_tx.json',
  'Access Your Anger - Hayley Ep 5_pretty_tx.json',
  'Listen To Your Inner Child - Hayley Ep 6_pretty_tx.json',
  'Discover Your Hidden Strength - Hayley Ep 7_pretty_tx.json'
];

const processFiles = async () => {
  try {
    const nodes = [];
    const links = [];

    for (let i = 0; i < sessionFiles.length; i++) {
      const filePath = path.join(inputDir, sessionFiles[i]);
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Process each file
      const topWords = Object.entries(data["word frequencies"])
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([word, value]) => ({ word, value }));

      topWords.forEach((word, index) => {
        const nodeId = `${word.word}-${i}`;
        nodes.push({
          id: nodeId,
          name: word.word,
          group: i,
          description: word.value
        });

        // Create links to previous file's top words
        if (i > 0) {
          const prevFilePath = path.join(inputDir, sessionFiles[i - 1]);
          if (!fs.existsSync(prevFilePath)) {
            throw new Error(`File not found: ${prevFilePath}`);
          }
          const prevData = JSON.parse(fs.readFileSync(prevFilePath, 'utf8'));

          const prevTopWords = Object.entries(prevData["word frequencies"])
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([word, value]) => ({ word, value }));

          const currentWordId = nodeId;
          prevTopWords.forEach(prevWord => {
            if (prevWord.word === word.word) {
              links.push({
                source: `${prevWord.word}-${i - 1}`,
                target: currentWordId,
                value: Math.min(prevWord.value, word.value)
              });
            }
          });
        }
      });
    }

    // Write the processed data to a JSON file
    const sankeyData = { nodes, links };
    fs.writeFileSync(path.join(outputDir, 'sankeyData.json'), JSON.stringify(sankeyData, null, 2));
    console.log('Sankey data has been written to sankeyData.json');
  } catch (error) {
    console.error('Error processing files:', error);
  }
};

// Run the processing function
processFiles();
