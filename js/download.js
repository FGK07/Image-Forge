/* ==========================================================
    ImageForge
    download.js
========================================================== */

class DownloadManager {

    constructor() {

        this.converter = () => window.imageConverter;

    }

    /* ==========================================
        DOWNLOAD SINGLE IMAGE
    ========================================== */

    download(image) {

        if (!image) return;

        const link = document.createElement("a");

        link.href = image.convertedURL;

        link.download = image.name;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

    }

    /* ==========================================
        DOWNLOAD ALL
    ========================================== */

    downloadAll() {

        const images = this.converter().getImages();

        if (!images.length) {

            alert("No images to download.");

            return;

        }

        if (images.length === 1) {

            this.download(images[0]);

            return;

        }

        if (typeof window.downloadZip === "function") {

            window.zipManager.download(images);

            return;

        }

        alert("ZIP module is not loaded.");

    }

    /* ==========================================
        DOWNLOAD BY ID
    ========================================== */

    downloadById(id) {

        const image = this.converter()

            .getImages()

            .find(img => img.id === id);

        this.download(image);

    }

}

/* ==========================================================
    INITIALIZE
========================================================== */

window.downloadManager = new DownloadManager();

/* ==========================================================
    GLOBAL FUNCTION
========================================================== */

window.downloadAllImages = function () {

    window.downloadManager.downloadAll();

};