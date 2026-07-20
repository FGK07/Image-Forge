/* ==========================================================
    ImageForge
    Drag & Drop Manager
========================================================== */

class DragDropManager {

    constructor() {

        this.dropZone = document.getElementById("dropZone");
        this.fileInput = document.getElementById("imageInput");

        this.supportedTypes = [
            "image/png"
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

        [
            "dragenter",
            "dragover"
        ].forEach(eventName => {

            this.dropZone.addEventListener(eventName, (event) => {

                event.preventDefault();

                event.stopPropagation();

                this.dropZone.classList.add("dragover");

            });

        });

        [
            "dragleave",
            "drop"
        ].forEach(eventName => {

            this.dropZone.addEventListener(eventName, (event) => {

                event.preventDefault();

                event.stopPropagation();

                this.dropZone.classList.remove("dragover");

            });

        });

        this.dropZone.addEventListener("drop", (event) => {

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

            alert("Only PNG images are supported.");

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