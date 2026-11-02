
const domainSelect = document.querySelector("#domain-select");
const domainMenu = document.querySelector("#domain-menu");

domainSelect.addEventListener("click", function () {
    if (domainMenu.style.display === "block") {
        domainMenu.style.display = "none";
    } else {
        domainMenu.style.display = "block";
    }
});
const shortenButton = document.getElementById("shorten-tab");
const qrButton = document.getElementById("qr-tab");

const shortenContent = document.querySelector(".url-shortener");
const qrContent = document.querySelector(".qr-code");

shortenButton.addEventListener("click", function () {
    shortenContent.style.display = "block";
    qrContent.style.display = "none";
    qrResult.style.display = "none";

    shortenButton.classList.add("active");
    qrButton.classList.remove("active");
});

qrButton.addEventListener("click", function () {
    shortenContent.style.display = "none";
    qrContent.style.display = "block";

    qrButton.classList.add("active");
    shortenButton.classList.remove("active");
});

shortenButton.classList.add("active");

const cards = document.querySelectorAll(".feature-card");
const mainImage = document.getElementById("main-image");

let currentIndex = 0;

function activateCard(index) {
    cards.forEach(function(card) {
        card.classList.remove("active");
    });

    cards[index].classList.add("active");

    mainImage.src = cards[index].dataset.image;

    currentIndex = index;
}

cards.forEach(function(card, index) {
    card.addEventListener("mouseenter", function() {
        activateCard(index);
    });
});

setInterval(function() {
    activateCard((currentIndex + 1) % cards.length);
}, 5000);

activateCard(0);
const questions = document.querySelectorAll(".faq-question");

questions.forEach(function(question) {

    question.addEventListener("click", function() {

        const faqItem = question.parentElement;
        const answer = faqItem.querySelector(".faq-answer");
        const arrow = question.querySelector(".arrow");

        faqItem.classList.toggle("active");

        if (faqItem.classList.contains("active")) {
            answer.style.display = "block";
            arrow.textContent = "⌃";
        } else {
            answer.style.display = "none";
            arrow.textContent = "⌄";
        }

    });

});
const longUrlInput = document.getElementById("long-url2");
const shortenLinkButton = document.querySelector(".url-shortener .shorten-link");

const urlShortener = document.querySelector(".url-shortener");
const shortenResult = document.querySelector(".shorten-result");

const originalUrlDisplay = document.getElementById("original-url");
const generatedUrlDisplay = document.getElementById("generated-short-url");
shortenLinkButton.addEventListener("click", async function(event) {

    event.preventDefault();

    const longUrl = longUrlInput.value.trim();

    if (longUrl === "") {
        alert("Please enter a URL.");
        return;
    }

    try {
    const response = await fetch(
        `https://da.gd/s?url=${encodeURIComponent(longUrl)}`
    );
    const result = await response.text();
    console.log("Status:", response.status);
    console.log("API response:", result);
    const shortUrl = result.trim();

if (!response.ok || !shortUrl.startsWith("http")) {
    throw new Error("Invalid response from API: " + shortUrl);
}
console.log("Original URL:", originalUrlDisplay);
console.log("Generated URL:", generatedUrlDisplay);
console.log("Results container:", shortenResult);

    originalUrlDisplay.textContent = longUrl;
    generatedUrlDisplay.value = shortUrl;
    createQRCode(shortUrl);
    qrOriginalUrl.textContent = longUrl;
qrGeneratedUrl.value = shortUrl;
    urlShortener.style.display = "none";
    shortenResult.style.display = "block";
} catch (error) {
    console.error("Full error:", error);
    alert(error.message);
}
});
const copyButton = document.getElementById("copy-short-url");

copyButton.addEventListener("click", async function() {
    try {
        await navigator.clipboard.writeText(generatedUrlDisplay.value);

        copyButton.textContent = "Copied!";

    } catch (error) {
        console.error("Copy failed:", error);
        alert("Unable to copy the link.");
    }
});
const visitButton = document.getElementById("visit-url");

visitButton.addEventListener("click", function() {
    window.open(generatedUrlDisplay.value, "_blank");
});
const shareButton = document.getElementById("share-url");

shareButton.addEventListener("click", async function() {
    const shortUrl = generatedUrlDisplay.value;

    if (navigator.share) {
        try {
            await navigator.share({
                title: "My shortened link",
                url: shortUrl
            });
        } catch (error) {
            console.log("Sharing cancelled or unavailable:", error);
        }
    } else {
        try {
            await navigator.clipboard.writeText(shortUrl);
            alert("Sharing isn't supported here. Link copied instead!");
        } catch (error) {
            alert("Unable to share or copy the link.");
        }
    }
});
const qrActionButton = document.getElementById("qr-action");
const qrLongUrlInput = document.getElementById("qr-long-url1");
qrActionButton.addEventListener("click", function() {
    shortenResult.style.display = "none";

    qrButton.click();

    qrContent.style.display = "none";
    qrResult.style.display = "block";
});
const shortenAnotherButton = document.getElementById("shorten-another");

shortenAnotherButton.addEventListener("click", function() {

    shortenResult.style.display = "none";
    urlShortener.style.display = "block";

    longUrlInput.value = "";
    generatedUrlDisplay.value = "";
    originalUrlDisplay.textContent = "";

    copyButton.textContent = "Copy";

    window.scrollTo({
        top: document.querySelector(".shortener").offsetTop,
        behavior: "smooth"
    });

});
const generateQRButton = document.querySelector(".qr-code .shorten-link");
const qrResult = document.querySelector(".qr-result");
const qrImage = document.getElementById("qr-image");
const qrOriginalUrl = document.getElementById("qr-original-url");
const qrGeneratedUrl = document.getElementById("qr-generated-url");
const generateAnotherButton = document.getElementById("generate-another");

generateAnotherButton.addEventListener("click", function() {

    qrResult.style.display = "none";
    qrContent.style.display = "block";

    qrLongUrlInput.value = "";
    qrImage.innerHTML = "";

});
generateQRButton.addEventListener("click", async function(event) {
    event.preventDefault();
    const destinationUrl = qrLongUrlInput.value.trim();
    if (destinationUrl === "") {
        alert("Please enter a URL.");
        return;
    }
    try {
        const response = await fetch(
            `https://da.gd/s?url=${encodeURIComponent(destinationUrl)}`
        );
        const result = await response.text();
        const shortUrl = result.trim();
        if (!response.ok || !shortUrl.startsWith("http")) {
            throw new Error("Unable to shorten this URL.");
        }
        qrOriginalUrl.textContent = destinationUrl;
        qrGeneratedUrl.value = shortUrl;
        createQRCode(shortUrl);
        qrContent.style.display = "none";
        qrResult.style.display = "block";
    } catch (error) {
        console.error("QR generation error:", error);
        alert(error.message);
    }

});
let currentQRCode;
function createQRCode(url) {
    qrImage.innerHTML = "";

    currentQRCode = new QRCode(qrImage, {
        text: url,
        width: 132,
        height: 132,
        correctLevel: QRCode.CorrectLevel.H
    });
}
const downloadPngButton = document.getElementById("download-png");

downloadPngButton.addEventListener("click", function() {

    const canvas = qrImage.querySelector("canvas");

    if (!canvas) {
        alert("Please generate a QR code first.");
        return;
    }

    const pngUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "my-qr-code.png";

    link.click();

});
const downloadSvgButton = document.getElementById("download-svg");

downloadSvgButton.addEventListener("click", function() {

    if (!currentQRCode) {
        alert("Please generate a QR code first.");
        return;
    }

    const qr = currentQRCode._oQRCode;
    const moduleCount = qr.getModuleCount();
    const margin = 4;
    const size = moduleCount + margin * 2;

    let path = "";

    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {

            if (qr.isDark(row, col)) {
                path += `M${col + margin},${row + margin}h1v1h-1z`;
            }

        }
    }

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 ${size} ${size}"
             width="${size * 10}"
             height="${size * 10}">
            <rect width="100%" height="100%" fill="#ffffff"/>
            <path d="${path}" fill="#000000"/>
        </svg>
    `;

    const blob = new Blob([svg], {
        type: "image/svg+xml"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "my-qr-code.svg";
    link.click();

    URL.revokeObjectURL(url);

});