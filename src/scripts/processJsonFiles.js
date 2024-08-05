const fs = require('fs');
const path = require('path');

// Define the input directory
const inputDir = path.join(__dirname, '../../public/testData');

// List of stop words to be excluded from word frequencies
const stopWords = new Set([
    // General stop words
    'a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'yet', 'so',
    'at', 'by', 'with', 'on', 'in', 'of', 'to', 'from', 'as', 'up', 'down',
    'out', 'over', 'under', 'between', 'through', 'about', 'against', 'during',
    'before', 'after', 'above', 'below', 'around', 'among', 'across', 'behind',
    'am', 'are', 'is', 'was', 'were', 'been', 'be', 'has', 'have', 'had', 'having',
    'will', 'shall', 'should', 'would', 'can', 'could', 'may', 'might', 'must',
    'its', 'it', 'him', 'her', 'his', 'hers', 'its', 'their', 'them', 'they', 'those',
    'these', 'this', 'that', 'there', 'where', 'here', 'when', 'why', 'how', 'what',
    'which', 'who', 'whom', 'whose', 'my', 'your', 'his', 'her', 'its', 'our', 'their',
    'yours', 'hers', 'ours', 'theirs', 'me', 'you', 'he', 'she', 'it', 'we', 'they',
    'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'themselves',
    'each', 'every', 'some', 'any', 'one', 'none', 'all', 'both', 'either', 'neither',
    'few', 'many', 'several', 'such', 'more', 'most', 'less', 'least', 'own', 'other',
    'another', 'than', 'then', 'that', 'these', 'those', 'what', 'where', 'which',
    'who', 'whom', 'why', 'how', 'if', 'whether', 'because', 'although', 'unless',
    'until', 'while', 'since', 'even', 'though', 'so', 'such',
    // Contractions and informal terms
    'um', 'uh', 'don\'t', 'doesn\'t', 'didn\'t', 'wasn\'t', 'weren\'t',
    'hasn\'t', 'haven\'t', 'hadn\'t', 'won\'t', 'wouldn\'t', 'shouldn\'t', 'mightn\'t',
    'mustn\'t', 'that\'s', 'it\'s', 'there\'s', 'here\'s', 'what\'s', 'who\'s', 'where\'s',
    'how\'s', 'let\'s', 'that\'d', 'could\'ve', 'should\'ve', 'would\'ve', 'might\'ve',
    'must\'ve', 'aren\'t', 'isn\'t', 'wasn\'t', 'weren\'t', 'hasn\'t', 'haven\'t', 'hadn\'t',
    // Common terms to filter out
    'just', 'really', 'very', 'quite', 'some', 'any', 'now', 'then', 'there', 'here',
    'so', 'that', 'which', 'who', 'what', 'how', 'where', 'when', 'why', 'if',
    'as', 'than', 'because', 'since', 'until', 'while', 'during', 'after', 'before',
    'over', 'under', 'around', 'among', 'within', 'without', 'up', 'down', 'left', 'right',
    'back', 'forward', 'again', 'once', 'twice', 'always', 'never', 'ever', 'often',
    'rarely', 'usually', 'sometimes', 'maybe', 'perhaps', 'possibly', 'likely', 'unlikely',
    'sure', 'certain', 'certainly', 'definitely', 'probably', 'possibly', 'seems', 'appears',
    // Filter out words that are too generic or less meaningful in the context of therapy
    'like', 'thing', 'things', 'people', 'person', 'time', 'way', 'fact', 'case',
    'point', 'moment', 'situation', 'idea', 'part', 'question', 'answer', 'problem', 'solution',
    'topic', 'issue', 'discussion', 'conversation', 'speech', 'talk', 'statement', 'utterance',
    'you.', 'it.', 'um,', 'Um,', 'I', "I'm", 'not', 'something', 'much', 'sit', 'go', 'want', 'see', 'being',
    // Additional specific words from results
    'uh,', 'that.', 'me,', 'me.', "you're", "I've", "I'm",
    // Include more variations and contractions if needed
    'i', 'i\'m', 'i\'ve', 'you', 'you\'re', 'it\'s', 'don\'t', 'doesn\'t', 'didn\'t', 'wasn\'t', 'weren\'t', 'hasn\'t', 'haven\'t', 'hadn\'t', 'won\'t', 'wouldn\'t', 'shouldn\'t', 'mightn\'t', 'mustn\'t', 'that\'s', 'it\'s', 'there\'s', 'here\'s', 'what\'s', 'who\'s', 'where\'s', 'how\'s', 'let\'s', 'that\'d', 'could\'ve', 'should\'ve', 'would\'ve', 'might\'ve', 'must\'ve', 'aren\'t', 'isn\'t', 'wasn\'t', 'weren\'t', 'hasn\'t', 'haven\'t', 'hadn\'t',
    // General and common terms
    'the', 'and', 'but', 'or', 'for', 'with', 'on', 'in', 'at', 'by', 'to', 'from', 'as', 'up', 'down', 'out', 'over', 'under', 'between', 'through', 'about', 'against', 'during', 'before', 'after', 'above', 'below', 'around', 'among', 'across', 'behind', 'am', 'are', 'is', 'was', 'were', 'been', 'be', 'has', 'have', 'had', 'having', 'will', 'shall', 'should', 'would', 'can', 'could', 'may', 'might', 'must', 'its', 'it', 'him', 'her', 'his', 'hers', 'its', 'their', 'them', 'they', 'those', 'these', 'this', 'that', 'there', 'where', 'here', 'when', 'why', 'how', 'what', 'which', 'who', 'whom', 'whose', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'yours', 'hers', 'ours', 'theirs', 'me', 'you', 'he', 'she', 'it', 'we', 'they', 'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'themselves', 'each', 'every', 'some', 'any', 'one', 'none', 'all', 'both', 'either', 'neither', 'few', 'many', 'several', 'such', 'more', 'most', 'less', 'least', 'own', 'other', 'another', 'than', 'then', 'that', 'these', 'those', 'what', 'where', 'which', 'who', 'whom', 'why', 'how', 'if', 'whether', 'because', 'although', 'unless', 'until', 'while', 'since', 'even', 'though', 'so', 'such',
    // Filter out words that are too generic or less meaningful
    'like', 'thing', 'things', 'people', 'person', 'time', 'way', 'fact', 'case', 'point', 'moment', 'situation', 'idea', 'part', 'question', 'answer', 'problem', 'solution', 'topic', 'issue', 'discussion', 'conversation', 'speech', 'talk', 'statement', 'utterance', 'um', 'uh', 'something', 'much', 'sit', 'go', 'want', 'see', 'being'
]);

// Helper function to get the current date and time
const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0]; // HH:MM:SS
    return { date, time };
};

// Helper function to read JSON file and parse it
const readJsonFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading file ${filePath}:`, err);
        return null;
    }
};

// Helper function to write JSON file
const writeJsonFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error(`Error writing file ${filePath}:`, err);
    }
};

// Helper function to check if the filename is a JSON file
const isJsonFile = (filename) => {
    return filename.endsWith('.json');
};

// Extract date from metadata if present
const extractDateFromMetadata = (jsonData) => {
    return jsonData.metadata && jsonData.metadata.date;
};

// Helper function to remove stop words and count frequencies
const calculateWordFrequencies = (words) => {
    const wordCounts = {};
    words.forEach(word => {
        const text = word.text.toLowerCase();
        if (!stopWords.has(text)) {
            if (wordCounts[text]) {
                wordCounts[text] += 1;
            } else {
                wordCounts[text] = 1;
            }
        }
    });
    return Object.fromEntries(
        Object.entries(wordCounts)
            .filter(([_, count]) => count > 2)
            .sort(([, countA], [, countB]) => countB - countA)
    );
};

console.log('Starting script execution');

// Read all files in the input directory
fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', inputDir, err);
        return;
    }

    console.log('Files found in directory:', files);

    // Read and parse JSON files, and extract date from metadata
    const jsonFiles = files.filter(isJsonFile).map(filename => {
        const filePath = path.join(inputDir, filename);
        const jsonData = readJsonFile(filePath);
        const date = jsonData ? extractDateFromMetadata(jsonData) : null;

        console.log(`Extracted date from file '${filename}':`, date);

        return { filename, filePath, date, jsonData };
    }).filter(file => file.date);

    console.log('Filtered files with date:', jsonFiles);

    // Sort files by date
    const sortedFiles = jsonFiles.sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log('Sorted files:', sortedFiles);

    // Continue with processing if there are files
    if (sortedFiles.length === 0) {
        console.log('No valid files to process.');
        return;
    }

    sortedFiles.forEach((file, index) => {
        const { filename, filePath, date, jsonData } = file;

        // Create a new filename based on the order
        const newFilename = `haleysession${index + 1}.json`;
        const newFilePath = path.join(inputDir, newFilename);

        // Add metadata with current date and time at the top
        const { date: currentDate, time: currentTime } = getCurrentDateTime();
        jsonData.metadata = { date: date, time: currentTime };

        // Initialize data structures
        const organizedData = {
            metadata: jsonData.metadata,
            utterances: {},
            words: {},
            "word frequencies": {},
            summary: {}
        };

        // Initialize speakers
        const speakers = new Set();
        jsonData.words.forEach(word => speakers.add(word.speaker));
        jsonData.utterances.forEach(utterance => speakers.add(utterance.speaker));
        if (Array.isArray(jsonData.summary)) {
            jsonData.summary.forEach(sum => speakers.add(sum.speaker));
        }

        // Initialize data structures for each speaker
        speakers.forEach(speaker => {
            organizedData.words[speaker] = [];
            organizedData.utterances[speaker] = [];
            organizedData.summary[speaker] = {};
            organizedData["word frequencies"][speaker] = {};
        });

        // Organize words by speaker
        jsonData.words.forEach(word => {
            organizedData.words[word.speaker].push(word);
        });

        // Organize utterances by speaker and sort by start time
        jsonData.utterances.forEach(utterance => {
            if (!organizedData.utterances[utterance.speaker]) {
                organizedData.utterances[utterance.speaker] = [];
            }
            organizedData.utterances[utterance.speaker].push(utterance);
        });
        for (const speaker in organizedData.utterances) {
            organizedData.utterances[speaker].sort((a, b) => a.start - b.start);
        }

        // Organize summaries by speaker and index
        if (Array.isArray(jsonData.summary)) {
            jsonData.summary.forEach(sum => {
                if (!organizedData.summary[sum.speaker]) {
                    organizedData.summary[sum.speaker] = {};
                }
                organizedData.summary[sum.speaker][sum.index] = {
                    index: sum.index,
                    speaker: sum.speaker,
                    text: sum.text,
                    start: sum.start,
                    end: sum.end,
                    confidence: sum.confidence,
                    word_count: sum.word_count,
                    tokenised_word_count: sum.tokenised_word_count,
                    score: sum.score,
                    density: sum.density,
                    percentile: sum.percentile
                };
            });
        }

        // Calculate word frequencies
        for (const speaker of speakers) {
            const speakerWords = jsonData.words.filter(word => word.speaker === speaker);
            organizedData["word frequencies"][speaker] = calculateWordFrequencies(speakerWords);
        }

        console.log(`Organized data for: ${filename}`);

        // Write the organized data to a new JSON file
        writeJsonFile(newFilePath, organizedData);
        console.log(`Processed file saved: ${newFilePath}`);
    });
});
