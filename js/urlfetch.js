/* ==========================================================
    ImageForge
    URL Fetch Manager — CORS-Safe with Proxy Fallbacks
========================================================== */

class URLFetchManager {

    constructor() {

        this.urlInput = document.getElementById("imageUrl");

        this.fetchBtn = document.getElementById("fetchImageBtn");

        this.statusEl = document.getElementById("urlStatus");

        // CORS proxy list (tried in order)
        this.corsProxies = [
            (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
            (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
            (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
        ];

        this.init();

    }

    init() {

        if (!this.fetchBtn || !this.urlInput) return;

        this.fetchBtn.addEventListener("click", () => {

            this.fetchImage();

        });

        this.urlInput.addEventListener("keydown", (e) => {

            if (e.key === "Enter") {

                e.preventDefault();

                this.fetchImage();

            }

        });

    }

    /* ==========================================
        VALIDATE URL
    ========================================== */

    isValidUrl(string) {

        try {

            const url = new URL(string);

            return url.protocol === "http:" ||
                   url.protocol === "https:";

        } catch {

            return false;

        }

    }

    /* ==========================================
        DETECT IF URL LOOKS LIKE AN IMAGE
    ========================================== */

    looksLikeImageUrl(url) {

        const imageExtensions = /\.(png|jpe?g|gif|webp|bmp|tiff?|avif|ico|svg)(\?.*)?$/i;

        return imageExtensions.test(url);

    }

    /* ==========================================
        EXTRACT FILENAME FROM URL
    ========================================== */

    getFilenameFromUrl(url) {

        try {

            const pathname = new URL(url).pathname;

            const segments = pathname.split("/");

            const lastSegment = segments[segments.length - 1];

            if (lastSegment && /\.(png|jpe?g|gif|webp|bmp|tiff?|avif|ico|svg)$/i.test(lastSegment)) {

                return decodeURIComponent(lastSegment);

            }

            // Generate a name based on format
            return "image-from-url.png";

        } catch {

            return "image-from-url.png";

        }

    }

    /* ==========================================
        SET STATUS
    ========================================== */

    setStatus(message, type = "") {

        this.statusEl.className = "url-status " + type;

        this.statusEl.innerHTML = message;

    }

    clearStatus() {

        this.statusEl.className = "url-status";

        this.statusEl.innerHTML = "";

    }

    /* ==========================================
        SET LOADING STATE
    ========================================== */

    setLoading(loading) {

        if (loading) {

            this.fetchBtn.classList.add("loading");

            this.fetchBtn.querySelector("i").className =
                "fa-solid fa-spinner";

            this.fetchBtn.querySelector("span").textContent =
                "Fetching...";

            this.urlInput.disabled = true;

        } else {

            this.fetchBtn.classList.remove("loading");

            this.fetchBtn.querySelector("i").className =
                "fa-solid fa-download";

            this.fetchBtn.querySelector("span").textContent =
                "Fetch";

            this.urlInput.disabled = false;

        }

    }

    /* ==========================================
        VALIDATE BLOB IS IMAGE
    ========================================== */

    validateAsImage(blob) {

        return new Promise((resolve) => {

            const url = URL.createObjectURL(blob);

            const img = new Image();

            img.onload = () => {

                URL.revokeObjectURL(url);

                resolve(true);

            };

            img.onerror = () => {

                URL.revokeObjectURL(url);

                resolve(false);

            };

            img.src = url;

        });

    }

    /* ==========================================
        MAIN FETCH IMAGE
    ========================================== */

    async fetchImage() {

        const url = this.urlInput.value.trim();

        // Validation
        if (!url) {

            this.setStatus(
                '<i class="fa-solid fa-circle-exclamation"></i> Masukkan URL gambar.',
                "error"
            );

            return;

        }

        if (!this.isValidUrl(url)) {

            this.setStatus(
                '<i class="fa-solid fa-circle-exclamation"></i> URL tidak valid. Gunakan http:// atau https://',
                "error"
            );

            return;

        }

        // Warn if URL doesn't look like an image
        if (!this.looksLikeImageUrl(url)) {

            this.setStatus(
                '<i class="fa-solid fa-circle-info"></i> Mencoba mengambil gambar...',
                ""
            );

        }

        this.setLoading(true);

        this.setStatus(
            '<i class="fa-solid fa-spinner fa-spin"></i> Mengunduh gambar...',
            ""
        );

        // Strategy 1: Direct fetch (works for same-origin & CORS-enabled servers)
        let blob = await this.tryDirectFetch(url);

        // Strategy 2: Try CORS proxies
        if (!blob) {

            for (let i = 0; i < this.corsProxies.length; i++) {

                this.setStatus(
                    `<i class="fa-solid fa-spinner fa-spin"></i> Mencoba proxy ${i + 1}/${this.corsProxies.length}...`,
                    ""
                );

                const proxyUrl = this.corsProxies[i](url);

                blob = await this.tryDirectFetch(proxyUrl);

                if (blob) break;

            }

        }

        // Strategy 3: Image element fallback (for images that allow cross-origin)
        if (!blob) {

            this.setStatus(
                '<i class="fa-solid fa-spinner fa-spin"></i> Mencoba metode alternatif...',
                ""
            );

            blob = await this.tryImageFallback(url);

        }

        // All strategies failed
        if (!blob) {

            this.setLoading(false);

            this.setStatus(
                '<i class="fa-solid fa-circle-xmark"></i> Gagal mengambil gambar. Pastikan URL mengarah ke file gambar yang valid.',
                "error"
            );

            return;

        }

        // Validate the blob is actually an image
        const isImage = await this.validateAsImage(blob);

        if (!isImage) {

            this.setLoading(false);

            this.setStatus(
                '<i class="fa-solid fa-circle-xmark"></i> URL tersebut bukan gambar yang valid.',
                "error"
            );

            return;

        }

        // Success — create File and send to converter
        const filename = this.getFilenameFromUrl(url);

        const mimeType = blob.type && blob.type.startsWith("image/")
            ? blob.type
            : "image/png";

        const file = new File(
            [blob],
            filename,
            { type: mimeType }
        );

        if (typeof window.handleSelectedImages === "function") {

            await window.handleSelectedImages([file]);

        }

        this.setLoading(false);

        this.setStatus(
            '<i class="fa-solid fa-circle-check"></i> Gambar berhasil diimpor!',
            "success"
        );

        this.urlInput.value = "";

        setTimeout(() => {

            this.clearStatus();

        }, 3000);

    }

    /* ==========================================
        STRATEGY 1: DIRECT FETCH
    ========================================== */

    async tryDirectFetch(url) {

        try {

            const controller = new AbortController();

            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(url, {

                signal: controller.signal,

                headers: {
                    "Accept": "image/*,*/*"
                }

            });

            clearTimeout(timeoutId);

            if (!response.ok) return null;

            const blob = await response.blob();

            // Check if we got something useful (not an HTML error page)
            if (blob.size < 100 && blob.type.includes("text")) {

                return null;

            }

            return blob;

        } catch {

            return null;

        }

    }

    /* ==========================================
        STRATEGY 3: IMAGE ELEMENT FALLBACK
    ========================================== */

    tryImageFallback(url) {

        return new Promise((resolve) => {

            const img = new Image();

            img.crossOrigin = "anonymous";

            const timeout = setTimeout(() => {

                img.src = "";

                resolve(null);

            }, 10000);

            img.onload = () => {

                clearTimeout(timeout);

                const canvas = document.createElement("canvas");

                canvas.width = img.naturalWidth;

                canvas.height = img.naturalHeight;

                const ctx = canvas.getContext("2d");

                ctx.drawImage(img, 0, 0);

                try {

                    canvas.toBlob((blob) => {

                        resolve(blob || null);

                    }, "image/png");

                } catch {

                    resolve(null);

                }

            };

            img.onerror = () => {

                clearTimeout(timeout);

                resolve(null);

            };

            img.src = url;

        });

    }

}

/* ==========================================================
    INITIALIZE
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    window.urlFetchManager = new URLFetchManager();

});
