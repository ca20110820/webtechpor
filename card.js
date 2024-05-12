customElements.define(
    "custom-card",
    class CustomCard extends HTMLElement {
        constructor() {
            super();

            // As HTML Attributes
            let phase = this.getAttribute('phase');

            /* Note:
            * We can create custom html tags with custom attributes, but
            * it's easier to manipulate them in index.js but this class must
            * be parameterized `constructor(phase)`.
            *
            * My Knowledge is limited for now.
            * */

            // const phase = this.getAttribute('phase');
            fetch('./card.html')
                .then(async response => await response.text())
                .then(htmlString => {
                    // Parse HTML string into a DOM
                    const parser = new DOMParser();
                    const dom = parser.parseFromString(htmlString, 'text/html');
                    const templateContent = dom.querySelector('#card-template').content;

                    // Manipulate the template content
                    const cardHeader = templateContent.querySelector('#card-header');
                    cardHeader.textContent = `Phase ${phase}`;

                    const anchorHref = templateContent.querySelector('#anchor-href');
                    anchorHref.href = `phase-${phase}`;

                    const iframe1 = templateContent.querySelector('#iframe-1');
                    iframe1.src = `phase-${phase}`;

                    const iframe2 = templateContent.querySelector('#iframe-2');
                    iframe2.src = `phase-${phase}`;

                    const shadowRoot = this.attachShadow({mode: "open"});
                    shadowRoot.appendChild(templateContent.cloneNode(true));

                    // Add event listeners within the shadow DOM
                    const imagePopup = shadowRoot.querySelector('.image-popup');
                    const popupOverlay = shadowRoot.querySelector('.popup-overlay');

                    imagePopup.addEventListener('click', () => {
                        this.expandImage();
                    });

                    popupOverlay.addEventListener('click', () => {
                        this.closeImage();
                    });
                });
        }

        expandImage() {
            const popupOverlay = this.shadowRoot.querySelector('.popup-overlay');
            const popupContainer = this.shadowRoot.querySelector('.popup-container');
            popupOverlay.style.display = 'block';
            popupContainer.style.display = 'block';
        }

        closeImage() {
            const popupOverlay = this.shadowRoot.querySelector('.popup-overlay');
            const popupContainer = this.shadowRoot.querySelector('.popup-container');
            popupOverlay.style.display = 'none';
            popupContainer.style.display = 'none';
        }
    }
);
