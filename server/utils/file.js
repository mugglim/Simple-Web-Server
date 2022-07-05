const fs = require('fs').promises;

const readFile = async filePath => {
    try {
        const content = await fs.readFile(filePath);
        return { content };
    } catch (error) {
        return { error };
    }
};

module.exports = {
    readFile,
};
