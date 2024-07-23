const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'public', 'data');
const sessionsListFile = path.join(dataDir, 'sessionsList.json');

// Read the sessionsList.json file
fs.readFile(sessionsListFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading sessionsList.json:', err);
        return;
    }

    const sessionsList = JSON.parse(data);

    const updatedSessionsList = sessionsList.map(fileName => {
        const newFileName = fileName.replace(/\s+/g, '_'); // Replace spaces with underscores
        fs.renameSync(path.join(dataDir, fileName), path.join(dataDir, newFileName));
        return newFileName;
    });

    // Write the updated list back to sessionsList.json
    fs.writeFile(sessionsListFile, JSON.stringify(updatedSessionsList, null, 2), 'utf8', err => {
        if (err) {
            console.error('Error writing updated sessionsList.json:', err);
        } else {
            console.log('Updated sessionsList.json and renamed files successfully.');
        }
    });
});
