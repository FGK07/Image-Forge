/* ==========================================================
    ImageForge
    stats.js
========================================================== */

class StatsManager {

    constructor() {

        this.totalImages =
            document.getElementById("totalImages");

        this.originalSize =
            document.getElementById("originalSize");

        this.convertedSize =
            document.getElementById("convertedSize");

        this.savedPercent =
            document.getElementById("savedPercent");

        this.reset();

    }

    /* ==========================================
        UPDATE
    ========================================== */

    update(images) {

        if (!images.length) {

            this.reset();

            return;

        }

        const totalOriginal = images.reduce(

            (sum, image) =>

                sum + image.originalSize,

            0

        );

        const totalConverted = images.reduce(

            (sum, image) =>

                sum + image.convertedSize,

            0

        );

        const averageSaving = images.reduce(

            (sum, image) =>

                sum + image.saving,

            0

        ) / images.length;

        this.totalImages.textContent =
            images.length;

        this.originalSize.textContent =
            this.formatSize(totalOriginal);

        this.convertedSize.textContent =
            this.formatSize(totalConverted);

        this.savedPercent.textContent =
            averageSaving.toFixed(1) + "%";

    }

    /* ==========================================
        RESET
    ========================================== */

    reset() {

        this.totalImages.textContent = "0";

        this.originalSize.textContent = "0 KB";

        this.convertedSize.textContent = "0 KB";

        this.savedPercent.textContent = "0%";

    }

    /* ==========================================
        FORMAT SIZE
    ========================================== */

    formatSize(bytes) {

        if (bytes < 1024) {

            return bytes + " B";

        }

        if (bytes < 1024 * 1024) {

            return (bytes / 1024).toFixed(1) + " KB";

        }

        return (bytes / 1024 / 1024).toFixed(2) + " MB";

    }

}

/* ==========================================================
    INITIALIZE
========================================================== */

window.statsManager = new StatsManager();