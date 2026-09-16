const canvas = document.getElementById("storyCanvas");
const ctx = canvas.getContext("2d");

const els = {
  propertyImage: document.getElementById("propertyImage"),
  logoImage: document.getElementById("logoImage"),
  city: document.getElementById("cityInput"),
  price: document.getElementById("priceInput"),
  incentive: document.getElementById("incentiveInput"),
  support: document.getElementById("supportInput"),
  button: document.getElementById("buttonInput"),
  agent: document.getElementById("agentInput"),
  phone: document.getElementById("phoneInput"),
  photoPosition: document.getElementById("photoPosition"),
  download: document.getElementById("downloadButton"),
};

let propertyImg = null;
let logoImg = null;

function loadImageFromFile(file, callback) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => callback(img);
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

els.propertyImage.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  loadImageFromFile(file, (img) => {
    propertyImg = img;
    draw();
  });
});

els.logoImage.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  loadImageFromFile(file, (img) => {
    logoImg = img;
    draw();
  });
});

[
  els.city, els.price, els.incentive, els.support,
  els.button, els.agent, els.phone, els.photoPosition
].forEach((el) => el.addEventListener("input", draw));

function drawCoverImage(img, x, y, w, h, positionY = 50) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;

  let sw, sh, sx, sy;

  if (imgRatio > boxRatio) {
    sh = img.height;
    sw = sh * boxRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / boxRatio;
    sx = 0;
    const maxSy = img.height - sh;
    sy = maxSy * (positionY / 100);
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function fitText(text, maxWidth, startSize, minSize, fontFamily, weight = 700) {
  let size = startSize;
  do {
    ctx.font = `${weight} ${size}px ${fontFamily}`;
    if (ctx.measureText(text).width <= maxWidth) return size;
    size -= 2;
  } while (size > minSize);
  return minSize;
}

function roundRect(x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawPlaceholder() {
  const sky = ctx.createLinearGradient(0, 0, 0, 1000);
  sky.addColorStop(0, "#b6cedf");
  sky.addColorStop(1, "#d7e0e5");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 1080, 1920);

  ctx.fillStyle = "#5f6f5c";
  ctx.fillRect(0, 890, 1080, 1030);

  ctx.fillStyle = "#cfc3ae";
  ctx.fillRect(165, 710, 750, 650);

  ctx.fillStyle = "#29333a";
  ctx.beginPath();
  ctx.moveTo(120, 735);
  ctx.lineTo(540, 390);
  ctx.lineTo(960, 735);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#263746";
  ctx.fillRect(285, 870, 180, 165);
  ctx.fillRect(615, 870, 180, 165);
  ctx.fillRect(455, 1040, 170, 320);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (propertyImg) {
    drawCoverImage(propertyImg, 0, 0, canvas.width, canvas.height, Number(els.photoPosition.value));
  } else {
    drawPlaceholder();
  }

  // Refined navy gradient intentionally used only on the creative itself.
  const gradient = ctx.createLinearGradient(0, 650, 0, 1920);
  gradient.addColorStop(0, "rgba(2, 21, 42, 0)");
  gradient.addColorStop(0.25, "rgba(2, 27, 56, 0.18)");
  gradient.addColorStop(0.52, "rgba(2, 28, 59, 0.74)");
  gradient.addColorStop(0.76, "rgba(2, 22, 47, 0.95)");
  gradient.addColorStop(1, "rgba(1, 16, 35, 0.99)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 580, 1080, 1340);

  const left = 86;
  const right = 994;
  const max = right - left;

  // City
  const city = (els.city.value || "AUSTIN").toUpperCase();
  let citySize = fitText(city, max, 44, 30, '"Manrope", Arial, sans-serif', 800);
  ctx.font = `800 ${citySize}px "Manrope", Arial, sans-serif`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(city, left, 1130);

  // Small line above price
  ctx.fillStyle = "rgba(255,255,255,.48)";
  ctx.fillRect(left, 1160, 92, 3);

  // Price
  const price = els.price.value || "$749,000";
  let priceSize = fitText(price, max, 130, 78, '"DM Serif Display", Georgia, serif', 400);
  ctx.font = `400 ${priceSize}px "DM Serif Display", Georgia, serif`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(price, left, 1298);

  // Incentive
  const incentive = (els.incentive.value || "+ 3% IN BUYER INCENTIVES").toUpperCase();
  let incentiveSize = fitText(incentive, max, 48, 30, '"Manrope", Arial, sans-serif', 800);
  ctx.font = `800 ${incentiveSize}px "Manrope", Arial, sans-serif`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(incentive, left, 1397);

  // Support line
  const support = (els.support.value || "LOW INTEREST RATE • CLOSING COSTS • AND MORE").toUpperCase();
  let supportSize = fitText(support, max, 26, 18, '"Manrope", Arial, sans-serif', 700);
  ctx.font = `700 ${supportSize}px "Manrope", Arial, sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,.82)";
  ctx.fillText(support, left, 1445);

  // CTA button
  const buttonText = (els.button.value || "LEARN MORE").toUpperCase();
  ctx.font = `800 24px "Manrope", Arial, sans-serif`;
  const buttonTextWidth = ctx.measureText(buttonText).width;
  const buttonW = Math.max(190, buttonTextWidth + 64);
  const buttonH = 70;
  const buttonY = 1504;

  ctx.strokeStyle = "rgba(255,255,255,.9)";
  ctx.lineWidth = 2;
  roundRect(left, buttonY, buttonW, buttonH, 8);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(buttonText, left + buttonW / 2, buttonY + buttonH / 2 + 1);

  // Brand divider
  const brandTop = 1643;
  ctx.fillStyle = "rgba(255,255,255,.22)";
  ctx.fillRect(left, brandTop, max, 2);

  // Logo if provided
  let textStartX = left;
  if (logoImg) {
    const boxW = 245;
    const boxH = 105;
    const ratio = logoImg.width / logoImg.height;
    let drawW = boxW;
    let drawH = drawW / ratio;
    if (drawH > boxH) {
      drawH = boxH;
      drawW = drawH * ratio;
    }
    ctx.drawImage(logoImg, left, 1687 + (boxH - drawH) / 2, drawW, drawH);
    textStartX = left + 290;
  } else {
    // Subtle placeholder when no exact logo is uploaded.
    ctx.font = `800 28px "Manrope", Arial, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,.46)";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("YOUR LOGO", left, 1744);
    textStartX = left + 225;
  }

  // Agent
  const agent = els.agent.value || "Michael Mechler, Broker Associate";
  let agentSize = fitText(agent, right - textStartX, 31, 21, '"Manrope", Arial, sans-serif', 700);
  ctx.font = `700 ${agentSize}px "Manrope", Arial, sans-serif`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(agent, textStartX, 1724);

  // Phone
  const phone = els.phone.value || "(512) YES-2-OWN";
  ctx.font = `600 24px "Manrope", Arial, sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,.75)";
  ctx.fillText(phone, textStartX, 1768);

  // Small safe-area note line (visual only)
  ctx.fillStyle = "rgba(255,255,255,.12)";
  ctx.fillRect(left, 1830, max, 1);
}

async function ensureFonts() {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
  draw();
}

els.download.addEventListener("click", () => {
  draw();
  const city = (els.city.value || "listing").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const link = document.createElement("a");
  link.download = `${city || "listing"}-story.png`;
  link.href = canvas.toDataURL("image/png", 1);
  link.click();
});

ensureFonts();
