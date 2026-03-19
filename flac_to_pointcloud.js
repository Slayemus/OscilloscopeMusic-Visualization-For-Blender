const fs = require("fs").promises;
const path = require("path");
const audioDecodeModule = require("audio-decode");
const audioDecode = audioDecodeModule.default || audioDecodeModule;

const inputFile = "./blender/ASIION-I_MESS_UP_MY_LIFE.flac";
const outputFile = "./blender/ASIION-I_MESS_UP_MY_LIFE.csv";

async function processFlacToPointCloud(useCircularNormalization = true) {
    try {
        const inputPath = path.resolve(inputFile);
        const outputPath = path.resolve(outputFile);
        const flacBuffer = await fs.readFile(inputPath);
        const audioBuffer = await audioDecode(flacBuffer);

        if (audioBuffer.numberOfChannels === 0 || audioBuffer.length === 0) {
            throw new Error("encoded audio buffer is empty.");
        }

        const left = audioBuffer.getChannelData(0);
        const right = (audioBuffer.numberOfChannels === 1) ? left : audioBuffer.getChannelData(1);
        const length = left.length;

        const normalizedLeft = new Float32Array(length);
        const normalizedRight = new Float32Array(length);

        if (useCircularNormalization) {
            let maxMagnitude = 0;
            for (let i = 0; i < length; i++) {
                let magnitude = Math.sqrt(left[i] * left[i] + right[i] * right[i]);
                if (magnitude > maxMagnitude) maxMagnitude = magnitude;
            }
            const divisor = maxMagnitude === 0 ? 1 : maxMagnitude;
            for (let i = 0; i < length; i++) {
                normalizedLeft[i] = left[i] / divisor;
                normalizedRight[i] = right[i] / divisor;
            }
        } else {
            let maxAbs = 0;
            for (let i = 0; i < length; i++) {
                maxAbs = Math.max(maxAbs, Math.abs(left[i]), Math.abs(right[i]));
            }
            const divisor = maxAbs === 0 ? 1 : maxAbs;
            for (let i = 0; i < length; i++) {
                normalizedLeft[i] = left[i] / divisor;
                normalizedRight[i] = right[i] / divisor;
            }
        }

        let csvData = "x,y\n";
        for (let i = 0; i < length; i++) {
            csvData += `${normalizedLeft[i]},${normalizedRight[i]}\n`;
        }

        await fs.writeFile(outputPath, csvData);
        console.log(`generated: ${outputPath}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

processFlacToPointCloud(true);