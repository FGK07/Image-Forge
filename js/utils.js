/* ==========================================================
    ImageForge
    utils.js
========================================================== */

class Utils {

    /* ==========================================
        FORMAT SIZE
    ========================================== */

    static formatSize(bytes) {

        if (bytes < 1024) {

            return bytes + " B";

        }

        if (bytes < 1024 * 1024) {

            return (bytes / 1024).toFixed(1) + " KB";

        }

        return (bytes / 1024 / 1024).toFixed(2) + " MB";

    }

    /* ==========================================
        FORMAT PERCENT
    ========================================== */

    static formatPercent(number) {

        return Number(number).toFixed(1) + "%";

    }

    /* ==========================================
        RANDOM ID
    ========================================== */

    static randomId() {

        return crypto.randomUUID();

    }

    /* ==========================================
        CREATE ELEMENT
    ========================================== */

    static create(tag, className = "") {

        const element = document.createElement(tag);

        if (className) {

            element.className = className;

        }

        return element;

    }

    /* ==========================================
        DOWNLOAD FILE
    ========================================== */

    static download(url, filename) {

        const link = document.createElement("a");

        link.href = url;

        link.download = filename;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

    }

}

window.Utils = Utils;