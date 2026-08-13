const fs = require('fs');
const path = require('path');

const getDataPath = (filename) => path.join(__dirname, '..', 'data', filename);

exports.readData = (filename) => {
    try {
        const dataPath = getDataPath(filename);
        if (!fs.existsSync(dataPath)) {
            return [];
        }
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading file:", err);
        return [];
    }
};

exports.writeData = (filename, data, res) => {
    return new Promise((resolve, reject) => {
        try {
            const dataPath = getDataPath(filename);
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
            resolve();
        } catch (err) {
            if (res) {
                res.status(500).json({ error: "Internal server error" });
            }
            reject(err);
        }
    });
};
