const fs = require('fs');
const path = require('path');

const source = "C:\\Users\\ABHINAYA BEDGUM\\.gemini\\antigravity\\brain\\dcf8bc29-d311-4855-a468-c88312f0fe63\\placement_hub_header_banner_png_1778822904934.png";
const destination = "c:\\Users\\ABHINAYA BEDGUM\\Desktop\\ct 2.0\\portal\\public\\placement_hub_header_banner.png";

try {
    fs.copyFileSync(source, destination);
    console.log('Successfully copied image to ' + destination);
} catch (err) {
    console.error('Error copying file:', err);
}
