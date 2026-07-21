/* ==========================================================
    ImageForge
    zip.js
========================================================== */

class ZipManager {

    constructor() {

        this.fileName = "ImageForge-WebP.zip";

    }

    /* ==========================================
        DOWNLOAD ZIP
    ========================================== */

    async download(images) {

        if (!images.length) {

            alert("No images to download.");

            return;

        }

        const zip = new JSZip();

        for (const image of images) {

            zip.file(

                image.name,

                image.convertedBlob

            );

        }

        const content = await zip.generateAsync({

            type: "blob",

            compression: "DEFLATE",

            compressionOptions: {

                level: 9

            }

        });

        const url = URL.createObjectURL(content);

        const link = document.createElement("a");

        link.href = url;

        link.download = this.fileName;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    }

}

/* ==========================================================
    INITIALIZE
========================================================== */

window.zipManager = new ZipManager();

/* ==========================================================
    GLOBAL
========================================================== */

window.downloadZip = async function(images){

    await window.zipManager.download(images);

};