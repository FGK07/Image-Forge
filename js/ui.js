/* ==========================================================
    ImageForge
    ui.js
========================================================== */

class UIManager {

    constructor() {

        this.dropZone = document.getElementById("dropZone");

        this.imageContainer =
            document.getElementById("imageContainer");

    }

    showEmptyState() {

        if (

            this.imageContainer.children.length === 0

        ) {

            this.imageContainer.innerHTML = `

                <div class="empty-state">

                    <i class="fa-regular fa-image"></i>

                    <h3>

                        No Image Selected

                    </h3>

                    <p>

                        Upload PNG images to begin conversion.

                    </p>

                </div>

            `;

        }

    }

    removeEmptyState() {

        const state =

            this.imageContainer.querySelector(

                ".empty-state"

            );

        if (state) {

            state.remove();

        }

    }

}

window.uiManager = new UIManager();

document.addEventListener(

    "DOMContentLoaded",

    () => {

        window.uiManager.showEmptyState();

    }

);