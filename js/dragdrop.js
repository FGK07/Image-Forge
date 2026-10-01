/* ==========================================================
    ImageForge
    Drag & Drop Manager
========================================================== */

class DragDropManager {

    constructor() {

        this.dropZone = document.getElementById("dropZone");
        this.fileInput = document.getElementById("imageInput");

        this.supportedTypes = [
            "image/png",
            "image/jpeg",
            "image/webp",
            "image/gif",
            "image/bmp",
            "image/tiff",
            "image/avif",
            "image/x-icon",
            "image/vnd.microsoft.icon",
            "image/svg+xml"
        ];

        this.init();

    }

    init() {

        this.registerClickUpload();

        this.registerDragEvents();

        this.registerFileInput();

    }

    /* ==========================================
        CLICK UPLOAD
    ========================================== */

    registerClickUpload() {

        this.dropZone.addEventListener("click", () => {

            this.fileInput.click();

        });

    }

    /* ==========================================
        INPUT CHANGE
    ========================================== */

    registerFileInput() {

        this.fileInput.addEventListener("change", (event) => {

            this.handleFiles(event.target.files);

        });

    }

    /* ==========================================
        DRAG EVENTS
    ========================================== */

    registerDragEvents() {

        let dragCounter = 0;

        [
            "dragenter",
            "dragover",
            "dragleave",
            "drop"
        ].forEach(eventName => {
            document.addEventListener(eventName, (event) => {
                event.preventDefault();
                event.stopPropagation();
            });
        });

        document.addEventListener("dragenter", (event) => {
            dragCounter++;
            this.dropZone.classList.add("dragover");
        });

        document.addEventListener("dragleave", (event) => {
            dragCounter--;
            if (dragCounter === 0) {
                this.dropZone.classList.remove("dragover");
            }
        });

        document.addEventListener("drop", (event) => {
            dragCounter = 0;
            this.dropZone.classList.remove("dragover");

            const files = event.dataTransfer.files;
            this.handleFiles(files);
        });

    }

    /* ==========================================
        HANDLE FILES
    ========================================== */

    handleFiles(fileList) {

        if (!fileList.length) return;

        const files = Array.from(fileList);

        const validFiles = [];

        files.forEach(file => {

            if (this.validateFile(file)) {

                validFiles.push(file);

            }

        });

        if (!validFiles.length) {

            alert("Unsupported file format. Please use PNG, JPEG, WebP, GIF, BMP, TIFF, AVIF, or SVG.");

            return;

        }

        this.onFilesSelected(validFiles);

    }

    /* ==========================================
        VALIDATE
    ========================================== */

    validateFile(file) {

        return this.supportedTypes.includes(file.type);

    }

    /* ==========================================
        CALLBACK
    ========================================== */

    onFilesSelected(files) {

        console.log("Selected Files");

        console.table(files);

        if (typeof window.handleSelectedImages === "function") {

            window.handleSelectedImages(files);

        }

    }

}

/* ==========================================================
    INITIALIZE
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    new DragDropManager();

});