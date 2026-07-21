/* ==========================================================
    ImageForge
    converter.js
========================================================== */

class ImageConverter {

    constructor() {

        this.images = [];

        this.container = document.getElementById("imageContainer");

        this.qualitySlider = document.getElementById("quality");

        this.qualityValue = document.getElementById("qualityValue");

        this.bindEvents();

    }

    bindEvents() {

        if (this.qualitySlider) {

            this.qualityValue.textContent =
                this.qualitySlider.value + "%";

            this.qualitySlider.addEventListener("input", () => {

                this.qualityValue.textContent =
                    this.qualitySlider.value + "%";

            });

        }

    }

    getQuality() {

        return Number(this.qualitySlider.value) / 100;

    }

    async addImages(files) {

        for (const file of files) {

            if (!file.type.includes("png")) continue;

            await this.processImage(file);

        }

    }

    async processImage(file) {

        const image = await this.loadImage(file);

        const result = await this.convertToWebP(
            image,
            file
        );

        this.images.push(result);

        this.renderCard(result);

        if (window.statsManager) {

            window.statsManager.update(this.images);

        }

    }

    loadImage(file) {

        return new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = e => {

                const img = new Image();

                img.onload = () => resolve(img);

                img.onerror = reject;

                img.src = e.target.result;

            };

            reader.onerror = reject;

            reader.readAsDataURL(file);

        });

    }

    async convertToWebP(image, file) {

        const canvas = document.createElement("canvas");

        canvas.width = image.width;

        canvas.height = image.height;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(image, 0, 0);

        const blob = await new Promise(resolve => {

            canvas.toBlob(

                resolve,

                "image/webp",

                this.getQuality()

            );

        });

        return {

            id: crypto.randomUUID(),

            name: file.name.replace(/\.png$/i, ".webp"),

            originalFile: file,

            originalURL: URL.createObjectURL(file),

            originalSize: file.size,

            convertedBlob: blob,

            convertedURL: URL.createObjectURL(blob),

            convertedSize: blob.size,

            saving: this.calculateSaving(

                file.size,

                blob.size

            )

        };

    }

    calculateSaving(original, converted) {

        return Number(

            (

                ((original - converted) / original) * 100

            ).toFixed(1)

        );

    }

    formatSize(bytes) {

        if (bytes < 1024)

            return bytes + " B";

        if (bytes < 1024 * 1024)

            return (bytes / 1024).toFixed(1) + " KB";

        return (bytes / 1024 / 1024).toFixed(2) + " MB";

    }

    renderCard(image) {

        const card = document.createElement("div");

        card.className = "image-card fade-in";

        card.dataset.id = image.id;

        card.innerHTML = `

            <div class="image-header">

                <div class="image-name">
                    ${image.name}
                </div>

                <div class="image-status">

                    <i class="fa-solid fa-circle-check"></i>

                    Converted

                </div>

            </div>

            <div class="image-preview">

                <div class="preview-box">

                    <div class="preview-title">
                        PNG
                    </div>

                    <img
                        src="${image.originalURL}"
                        alt="Original Image"
                    >

                </div>

                <div class="preview-arrow">

                    <i class="fa-solid fa-arrow-right"></i>

                </div>

                <div class="preview-box">

                    <div class="preview-title">
                        WebP
                    </div>

                    <img
                        src="${image.convertedURL}"
                        alt="Converted Image"
                    >

                </div>

            </div>

            <div class="progress-wrapper">

                <div class="progress-bar">

                    <div
                        class="progress"
                        style="width:100%"
                    ></div>

                </div>

            </div>

            <div class="image-info">

                <div class="info-box">

                    <h4>Original</h4>

                    <span>
                        ${this.formatSize(image.originalSize)}
                    </span>

                </div>

                <div class="info-box">

                    <h4>WebP</h4>

                    <span>
                        ${this.formatSize(image.convertedSize)}
                    </span>

                </div>

                <div class="info-box">

                    <h4>Saved</h4>

                    <span>
                        ${image.saving}%
                    </span>

                </div>

            </div>

            <div class="image-footer">

                <button
                    class="download-btn"
                    data-id="${image.id}"
                >

                    <i class="fa-solid fa-download"></i>

                    Download

                </button>

                <button
                    class="delete-btn"
                    data-id="${image.id}"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        `;

        this.container.appendChild(card);

        this.bindCardEvents(card, image);

    }

    bindCardEvents(card, image) {

        const downloadButton =
            card.querySelector(".download-btn");

        const deleteButton =
            card.querySelector(".delete-btn");

        downloadButton.addEventListener("click", () => {

            this.downloadImage(image);

        });

        deleteButton.addEventListener("click", () => {

            this.removeImage(image.id);

        });

    }

        /* ==========================================
        DOWNLOAD IMAGE
    ========================================== */

    downloadImage(image) {

        const link = document.createElement("a");

        link.href = image.convertedURL;

        link.download = image.name;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

    }

    /* ==========================================
        REMOVE IMAGE
    ========================================== */

    removeImage(id) {

        this.images = this.images.filter(img => img.id !== id);

        const card = this.container.querySelector(

            `[data-id="${id}"]`

        );

        if (card) {

            card.remove();

        }

        if (window.statsManager) {

            window.statsManager.update(this.images);

        }

    }

    /* ==========================================
        GET IMAGES
    ========================================== */

    getImages() {

        return this.images;

    }

    /* ==========================================
        CLEAR ALL
    ========================================== */

    clearAll() {

        this.images = [];

        this.container.innerHTML = "";

        if (window.statsManager) {

            window.statsManager.update([]);

        }

    }

    /* ==========================================
        RECONVERT ALL
    ========================================== */

    async reconvertAll() {

        if (!this.images.length) return;

        const files = this.images.map(

            image => image.originalFile

        );

        this.clearAll();

        await this.addImages(files);

    }

    /* ==========================================
        TOTAL SIZE
    ========================================== */

    getTotalOriginalSize() {

        return this.images.reduce(

            (total, image) =>

                total + image.originalSize,

            0

        );

    }

    getTotalConvertedSize() {

        return this.images.reduce(

            (total, image) =>

                total + image.convertedSize,

            0

        );

    }

    getAverageSaving() {

        if (!this.images.length)

            return 0;

        const total = this.images.reduce(

            (sum, image) =>

                sum + image.saving,

            0

        );

        return Number(

            (

                total / this.images.length

            ).toFixed(1)

        );

    }

    } // ===== END CLASS =====

/* ==========================================================
    INITIALIZE
========================================================== */

window.imageConverter = new ImageConverter();

/* ==========================================================
    HANDLE FILES FROM DRAGDROP
========================================================== */

window.handleSelectedImages = async function (files) {

    await window.imageConverter.addImages(files);

};

/* ==========================================================
    QUALITY CHANGE
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const slider = document.getElementById("quality");

    if (!slider) return;

    let timeout;

    slider.addEventListener("input", () => {

        clearTimeout(timeout);

        timeout = setTimeout(async () => {

            if (window.imageConverter.getImages().length) {

                await window.imageConverter.reconvertAll();

            }

        }, 300);

    });

});

/* ==========================================================
    CLEAR ALL BUTTON
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const clearButton = document.getElementById("clearAll");

    if (!clearButton) return;

    clearButton.addEventListener("click", () => {

        if (!window.imageConverter.getImages().length)

            return;

        if (confirm("Remove all images?")) {

            window.imageConverter.clearAll();

        }

    });

});

/* ==========================================================
    DOWNLOAD ALL
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const button = document.getElementById("downloadAll");

    if (!button) return;

    button.addEventListener("click", () => {

        if (typeof window.downloadAllImages === "function") {

            window.downloadAllImages();

        } else {

            alert("ZIP module is not loaded.");

        }

    });

});