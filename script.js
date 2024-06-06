// This is the faceDB list, which I also have mirrored as a Gist on my GitHub!
const faceDB = {
    "xlarge-r": "X-Large",
    "globetrotter": "World Time",
    "smoke-r": "Vapor",
    "utility-r": "Utility",
    "renegade": "Unity",
    "coltan": "Unity Lights",
    "extragalactic": "Unity Mosaic",
    "com.apple.rhizomeface": "Unity Bloom",
    "greyhound": "Typograph",
    "infinity": "Toy Story",
    "timelapse": "Timelapse",
    "margarita": "Stripes",
    "gladius": "Solar Analog",
    "sidereal": "Solar Dial",
    "solar": "Solar Graph",
    "esterbrook": "Snoopy",
    "up-next-r": "Siri",
    "simple-r": "Simple",
    "pride": "Pride Digital",
    "prideweave": "Pride Woven",
    "lilypad": "Pride Threads",
    "com.apple.parameciumface": "Pride Celebration",
    "ultracube": "Portraits",
    "snowglobe": "Playtime",
    "photos": "Photos",
    "crosswind": "Palette",
    "big-numerals-analog": "Numerals Mono",
    "big-numerals-digital": "Numerals Duo",
    "numerals-r": "Numerals",
    "olympus": "Nike Hybrid",
    "vivaldi": "Nike Globe",
    "victory-digital-r": "Nike Digital",
    "shiba": "Nike Compact",
    "magma": "Nike Bounce",
    "victory-analog-r": "Nike Analog",
    "motion": "Motion",
    "cloudraker": "Modular Duo",
    "whistler-subdials": "Modular Compact",
    "whistler-digital": "Modular",
    "mickey-r": "Mickey Mouse",
    "kuiper": "Metropolitan",
    "blackcomb": "Meridian",
    "collie": "Memoji",
    "seltzer": "Lunar",
    "metallic-r": "Liquid Metal",
    "kaleidoscope-r": "Kaleidoscope",
    "whistler-analog": "Infograph",
    "Hermès": "Hermès",
    "spectrum-analog": "Gradient",
    "salmon": "GMT",
    "fire-water-r": "Fire and Water",
    "explorer-r": "Explorer",
    "trout": "Count Up",
    "proteus": "Contour",
    "color-r": "Color",
    "shark": "Chronograph Pro",
    "chronograph-r": "Chronograph",
    "california": "California",
    "breathe-r": "Breathe",
    "aegir": "Astronomy",
    "akita": "Artist",
    "activity-digital-r": "Activity Digital",
    "activity-analog-r": "Activity Analog",
    "activity analog": "Legacy Activity Analog",
    "activity digital": "Legacy Activity Digital",
    "astronomy": "Legacy Astronomy",
    "breathe": "Legacy Breathe",
    "bundle": "Legacy Stripes",
    "chronograph": "Legacy Chronograph",
    "color": "Legacy Color",
    "explorer": "Legacy Explorer",
    "fire-water": "Legacy Fire and Water",
    "metallic": "Legacy Liquid Metal",
    "Mickey Mouse": "Legacy Mickey Mouse",
    "modular": "Legacy Modular",
    "victory analog": "Legacy Nike Analog",
    "victory digital": "Legacy Nike Digital",
    "numerals": "Legacy Numerals",
    "simple": "Legacy Simple",
    "up next": "Legacy Siri",
    "utility": "Legacy Utility",
    "smoke": "Legacy Vapor",
    "x-large": "Legacy X-Large"
};

// I do not understand JavaScript.
async function fetchFaceNames(id, isFaceType) {
    const faceName = faceDB[id];
    return faceName ? faceName : null;
}

document.getElementById('customButton').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    handleFile(file);
});

document.addEventListener('dragover', (event) => {
    event.preventDefault();
    document.body.classList.add('drag-over');
});

document.addEventListener('dragleave', () => {
    document.body.classList.remove('drag-over');
});

document.addEventListener('drop', (event) => {
    event.preventDefault();
    document.body.classList.remove('drag-over');
    const file = event.dataTransfer.files[0];
    handleFile(file);
});

document.addEventListener('paste', async (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (const item of items) {
        if (item.kind === 'file') {
            const file = item.getAsFile();
            if (file.name.endsWith('.watchface')) {
                handleFile(file);
                return;
            } else {
                incorrectFileType();
            }
        } else if (item.kind === 'string' && item.type.includes('url')) {
            const url = item.getAsString(async (url) => {
                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        const fileBlob = await response.blob();
                        const file = new File([fileBlob], 'downloaded.watchface', { type: 'application/watchface' });
                        handleFile(file);
                    } else {
                        console.error('Failed to fetch .watchface file from URL');
                    }
                } catch (error) {
                    console.error('Error occurred while fetching .watchface file:', error);
                }
            });
        }
    }
});

function incorrectFileType() {
    const output = document.getElementById('jsonOutput');
    const snapshotImageElement = document.getElementById('snapshotImage');
    const toolboxElement = document.getElementById('toolbox');
    snapshotImageElement.style.display = 'none';
    snapshotImageElement.src = '';
    toolboxElement.style.display = 'none';
    output.textContent = 'Unsupported file, only .watchface files can be processed.';
}

async function handleFile(file) {
    const output = document.getElementById('jsonOutput');
    const snapshotImageElement = document.getElementById('snapshotImage');
    const toolboxElement = document.getElementById('toolbox');

    if (!file || !file.name.endsWith('.watchface')) {
        incorrectFileType();
        return;
    }

    const zip = new JSZip();
    let faceJson = null;
    let faceJsonText = '';

    try {
        const zipData = await zip.loadAsync(file);
        const faceJsonFile = zipData.file('face.json');
        const metadataJsonFile = zipData.file('metadata.json');
        const snapshotImageFile = zipData.file('snapshot.png');

        let bundleId = '';
        let analyticsId = '';
        let faceType = '';
        let colorData = null;
        let complications = {};

        if (faceJsonFile) {
            faceJsonText = await faceJsonFile.async('text');
            faceJson = JSON.parse(faceJsonText);
            bundleId = faceJson['bundle id'] || '';
            analyticsId = faceJson['analytics id'] || '';
            faceType = faceJson['face type'] || '';
            if (faceJson.customization) {
                colorData = faceJson.customization.color || null;
            }
        }

        if (metadataJsonFile) {
            const metadataJsonText = await metadataJsonFile.async('text');
            const metadataJson = JSON.parse(metadataJsonText);
            complications = metadataJson.complications_names || {};
        }

        if (snapshotImageFile) {
            const snapshotImageBlob = await snapshotImageFile.async('blob');
            const snapshotImageUrl = URL.createObjectURL(snapshotImageBlob);
            snapshotImageElement.src = snapshotImageUrl;
            snapshotImageElement.style.display = 'block';
        } else {
            snapshotImageElement.style.display = 'none';
            snapshotImageElement.src = '';
        }

        const idToUse = analyticsId || faceType;
        const faceName = await fetchFaceNames(idToUse, !analyticsId);

        let outputText = '';
        if (faceName) {
            outputText += `Name: ${faceName}\n`;
        }

        if (colorData) {
            if (typeof colorData === 'string') {
                const colorDescription = parseColorData(colorData);
                outputText += colorDescription + '\n';
            }
        }

        if (bundleId) {
            outputText += `Bundle ID: ${bundleId}\n`;
        }
        if (analyticsId) {
            outputText += `Analytics ID: ${analyticsId}\n`;
        } else if (faceType) {
            outputText += `Face Type: ${faceType}\n`;
        }

        if (colorData && colorData['slots']) {
            outputText += '\nColors:\n';
            const slots = colorData['slots'];
            Object.keys(slots).sort((a, b) => a - b).forEach(slot => {
                outputText += `Stripe ${parseInt(slot) + 1}: ${capitalize(slots[slot])}\n`;
            });
        }

        outputText += `\n`;

        if (Object.keys(complications).length > 0) {
            outputText += 'Complications:\n';
            const sortedKeys = Object.keys(complications).sort();
            for (const key of sortedKeys) {
                const formattedKey = formatComplicationKey(key);
                outputText += `${formattedKey}: ${complications[key]}\n`;
            }
        } else {
            outputText += 'Complications Unsupported';
        }

        output.textContent = outputText;

        // Store the faceJson for the invert button functionality
        window.faceJson = faceJson;
        window.zip = zip;

        // Check if the watch face is modifiable
        if (faceJsonText.includes('circular') || faceJsonText.includes('dial') || faceJsonText.includes('fullscreen')) {
            toolboxElement.style.display = 'block';
        } else {
            toolboxElement.style.display = 'none';
        }
    } catch (err) {
        snapshotImageElement.style.display = 'none';
        snapshotImageElement.src = '';
        output.textContent = `Error: ${err.message}`;
    }
}

document.getElementById('invert').addEventListener('click', () => {
    if (window.faceJson) {
        if (!window.faceJson.isInverted) {
            invertFaceJson(window.faceJson);
            window.faceJson.isInverted = true;
        }
        downloadModifiedWatchface(window.zip, window.faceJson);
    }
});

function invertFaceJson(faceJson) {
    const invertMappings = {
        'circular': 'fullscreen',
        'dial': 'fullscreen',
        'fullscreen': 'circular'
    };

    const invertKey = (key) => {
        return invertMappings[key] || key;
    };

    for (const key in faceJson) {
        if (typeof faceJson[key] === 'string') {
            faceJson[key] = faceJson[key].split(' ').map(invertKey).join(' ');
        } else if (typeof faceJson[key] === 'object') {
            invertFaceJson(faceJson[key]);
        }
    }
}

async function downloadModifiedWatchface(zip, faceJson) {
    zip.file('face.json', JSON.stringify(faceJson, null, 2));

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(new Blob([content], { type: 'application/vnd.apple.watchface' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Inverted.watchface';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function formatComplicationKey(key) {
    const words = key.split('-').map(word => capitalize(word));
    return words.join(' ');
}

function capitalize(word) {
    return word.replace(/([a-z])([A-Z])/g, '$1 $2')
               .replace(/-/g, ' ')
               .replace(/\b\w/g, char => char.toUpperCase());
}

function parseColorData(colorData) {
    if (colorData.includes('&')) {
        const colors = colorData.split('&').map(color => capitalize(color.trim().replace(/\./g, ' ')));
        return `Colors: ${colors.join(', ')}`;
    }

    if (colorData.includes(':')) {
        const baseColorData = colorData.split(':')[0];
        const parts = baseColorData.split('.');
        if (parts.length === 2) {
            const [context, color] = parts;
            const formattedContext = formatContext(context);
            return `${formattedContext ? `Season: ${formattedContext}, ` : ''}Color: ${capitalize(color.replace(/([a-zA-Z])([0-9])/g, '$1 $2'))}`;
        }
    }

    const parts = colorData.split('.');
    if (parts.length === 3) {
        const [, context, color] = parts;
        const formattedContext = formatContext(context);
        return `${formattedContext ? `Season: ${formattedContext}, ` : ''}Color: ${capitalize(color.replace(/([a-zA-Z])([0-9])/g, '$1 $2'))}`;
    } else if (parts.length === 2) {
        const [context, color] = parts;
        const formattedContext = formatContext(context);
        return `${formattedContext ? `Season: ${formattedContext}, ` : ''}Color: ${capitalize(color.replace(/([a-zA-Z])([0-9])/g, '$1 $2'))}`;
    } else {
        return `Color: ${capitalize(colorData)}`;
    }
}

function formatContext(context) {
    const formattedContext = context.replace(/(\d{4})/, ' $1')
                                    .replace(/-/g, ' ')
                                    .replace(/\b\w/g, char => char.toUpperCase());
    return formattedContext.split(' ').length > 1 ? formattedContext : '';
}
