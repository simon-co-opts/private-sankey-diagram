export const processSessionData = (sessionsData) => {
    const nodes = [];
    const links = [];
    const wordMap = new Map();

    sessionsData.forEach((session, sessionIndex) => {
        if (!session || !session['word frequencies']) {
            console.error(`Invalid session data for session ${sessionIndex}`);
            return;
        }

        Object.entries(session['word frequencies']).forEach(([word, frequency]) => {
            if (!wordMap.has(word)) {
                wordMap.set(word, { id: word, value: 0 });
            }
            wordMap.get(word).value += frequency;

            nodes.push({
                id: `${word}-${sessionIndex}`,
                name: word,
                session: sessionIndex,
                frequency: frequency,
            });

            if (sessionIndex > 0) {
                const prevNode = nodes.find(node => node.id === `${word}-${sessionIndex - 1}`);
                if (prevNode) {
                    links.push({
                        source: prevNode.id,
                        target: `${word}-${sessionIndex}`,
                        value: frequency,
                    });
                }
            }
        });
    });

    // Add special nodes for infrequently used and not used words
    sessionsData.forEach((_, sessionIndex) => {
        nodes.push({ id: `infrequent-${sessionIndex}`, name: 'Infrequently used', session: sessionIndex });
        nodes.push({ id: `notused-${sessionIndex}`, name: 'Not Used', session: sessionIndex });
    });

    return { nodes, links };
};
