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
    "plumeria": "Pride Radiance",
    "prideweave": "Pride Woven",
    "lilypad": "Pride Threads",
    "com.apple.parameciumface": "Pride Celebration",
    "ultracube": "Portraits",
    "snowglobe": "Playtime",
    "parmesan": "Photos",
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
    "bundle": "Stripes",
    "chronograph": "Legacy Chronograph",
    "color": "Legacy Color",
    "explorer": "Legacy Explorer",
    "fire-water": "Legacy Fire and Water",
    "metallic": "Legacy Liquid Metal",
    "Mickey Mouse": "Legacy Mickey Mouse",
    "modular": "Legacy Modular",
    "photos": "Legacy Photos",
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
                const output = document.getElementById('jsonOutput');
                incorrectFileType();
            }
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
        let customizationData = {};

        if (faceJsonFile) {
            faceJsonText = await faceJsonFile.async('text');
            faceJson = JSON.parse(faceJsonText);
            bundleId = faceJson['bundle id'] || '';
            analyticsId = faceJson['analytics id'] || '';
            faceType = faceJson['face type'] || '';
            if (faceJson.customization) {
                colorData = faceJson.customization.color || null;
                customizationData = {
                    style: faceJson.customization.style || null,
                    detail: faceJson.customization.detail || null,
                    content: faceJson.customization.content || null,
                    position: faceJson.customization.position || null
                };
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
        }
        if (faceType) {
            outputText += `Face Type: ${faceType}\n`;
        }

        if (colorData && colorData['slots']) {
            outputText += '\nColors:\n';
            const slots = colorData['slots'];
            Object.keys(slots).sort((a, b) => a - b).forEach(slot => {
                outputText += `Stripe ${parseInt(slot) + 1}: ${capitalize(slots[slot])}\n`;
            });
        }

        const formattedCustomizationData = formatCustomizationData(customizationData);
        if (formattedCustomizationData) {
            outputText += `\n${formattedCustomizationData}\n`;
        }

        if (Object.keys(complications).length > 0) {
            outputText += '\nComplications:\n';
            const sortedKeys = Object.keys(complications).sort();
            for (const key of sortedKeys) {
                const formattedKey = formatComplicationKey(key);
                outputText += `${formattedKey}: ${complications[key]}\n`;
            }
        } else {
            outputText += '\nComplications Unsupported';
        }

        output.textContent = outputText;

        window.faceJson = faceJson;
        window.zip = zip;

        if (faceJson.customization) {
            const customizationText = JSON.stringify(faceJson.customization);
            if (customizationText.includes('circular') || customizationText.includes('dial') || customizationText.includes('fullscreen') || customizationText.includes('analog') || customizationText.includes('digital')) {
                toolboxElement.style.display = 'block';
            } else {
                toolboxElement.style.display = 'none';
            }
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
        'fullscreen': 'circular',
        'analog': 'digital',
        'digital': 'analog',
        'on': 'off',
        'off': 'on'
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
    const words = key.replace(/(\d+)/g, ' $1')
                     .split('-')
                     .map(word => capitalize(word));
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

function formatCustomization(context) {
    const formattedContext = context.replace(/(\d{4})/, ' $1')
                                    .replace(/-/g, ' ')
                                    .replace(/\b\w+/g, (word, index) => {
                                        if (index === 0 && context.split('.').length > 1) {
                                            return word.length > 1 ? word.charAt(0).toUpperCase() + word.slice(1) : word.toLowerCase();
                                        } else {
                                            return word.charAt(0).toUpperCase() + word.slice(1);
                                        }
                                    });
    return formattedContext;
}

function formatCustomizationData(customizationData) {
    const formattedData = [];
    const keys = ['style', 'detail', 'content', 'position'];

    const detailMappings = {
        'minimal': 'Minimal (I)',
        'simple': 'Simple (II)',
        'medium': 'Medium (III)',
        'detailed': 'Detailed (IV)',
        '1': '1 Stripe',
        '2': '2 Stripes',
        '3': '3 Stripes',
        '4': '4 Stripes',
        '5': '5 Stripes',
        '6': '6 Stripes',
        '7': '7 Stripes',
        '8': '8 Stripes',
        '9': '9 Stripes'
    };

    keys.forEach(key => {
        if (customizationData[key]) {
            let value = customizationData[key];
            if (key === 'detail') {
                value = detailMappings[value] || value;
            }
            if (key === 'position' && !isNaN(value)) {
                value = `${value}°`;
            }
            formattedData.push(`${capitalize(key)}: ${formatCustomization(value)}`);
        }
    });

    return formattedData.join('\n');
}