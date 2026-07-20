/* ==========================================================
    ImageForge
    Theme Manager
========================================================== */

class ThemeManager {

    constructor() {

        this.toggleButton = document.getElementById("themeToggle");
        this.icon = this.toggleButton.querySelector("i");

        this.storageKey = "imageforge-theme";

        this.init();

    }

    init() {

        const savedTheme = localStorage.getItem(this.storageKey);

        if (savedTheme) {

            this.setTheme(savedTheme);

        } else {

            this.setSystemTheme();

        }

        this.toggleButton.addEventListener(
            "click",
            () => this.toggleTheme()
        );

    }

    setSystemTheme() {

        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        this.setTheme(
            prefersDark ? "dark" : "light"
        );

    }

    setTheme(theme) {

        document.documentElement.setAttribute(
            "data-theme",
            theme
        );

        localStorage.setItem(
            this.storageKey,
            theme
        );

        this.updateIcon(theme);

    }

    toggleTheme() {

        const currentTheme =
            document.documentElement.getAttribute(
                "data-theme"
            );

        const nextTheme =
            currentTheme === "dark"
                ? "light"
                : "dark";

        this.setTheme(nextTheme);

    }

    updateIcon(theme) {

        this.icon.className =
            theme === "dark"
                ? "fa-solid fa-sun"
                : "fa-solid fa-moon";

    }

}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        new ThemeManager();

    }
);