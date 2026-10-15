// ---------- Conversion data ----------
// Each unit stores how to convert TO and FROM a base unit of its category.
// Linear units use a single factor; temperature uses custom functions.
// To add a new unit, just add one line to the right category.
const linear = (name, symbol, factor) => ({
  name, symbol,
  toBase: v => v * factor,
  fromBase: v => v / factor
});

const categories = {
  length: {            // base: meters
    label: "Length",
    units: {
      m:  linear("Meters", "m", 1),
      km: linear("Kilometers", "km", 1000),
      cm: linear("Centimeters", "cm", 0.01),
      mm: linear("Millimeters", "mm", 0.001),
      mi: linear("Miles", "mi", 1609.344),
      yd: linear("Yards", "yd", 0.9144),
      ft: linear("Feet", "ft", 0.3048),
      in: linear("Inches", "in", 0.0254)
    }
  },
  weight: {            // base: kilograms
    label: "Weight",
    units: {
      kg: linear("Kilograms", "kg", 1),
      g:  linear("Grams", "g", 0.001),
      mg: linear("Milligrams", "mg", 0.000001),
      t:  linear("Metric tonnes", "t", 1000),
      lb: linear("Pounds", "lb", 0.45359237),
      oz: linear("Ounces", "oz", 0.028349523125)
    }
  },
  temperature: {       // base: Celsius
    label: "Temperature",
    units: {
      c: { name: "Celsius", symbol: "°C", toBase: v => v, fromBase: v => v },
      f: { name: "Fahrenheit", symbol: "°F", toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      k: { name: "Kelvin", symbol: "K", toBase: v => v - 273.15, fromBase: v => v + 273.15 }
    }
  },
  volume: {            // base: liters
    label: "Volume",
    units: {
      l:    linear("Liters", "L", 1),
      ml:   linear("Milliliters", "mL", 0.001),
      gal:  linear("US gallons", "gal", 3.785411784),
      cup:  linear("US cups", "cup", 0.2365882365),
      floz: linear("US fluid ounces", "fl oz", 0.0295735295625)
    }
  }
};

// ---------- Elements ----------
const categoryEl = document.getElementById("category");
const inputEl = document.getElementById("inputValue");
const fromEl = document.getElementById("fromUnit");
const toEl = document.getElementById("toUnit");
const resultEl = document.getElementById("result");
const messageEl = document.getElementById("message");
const summaryEl = document.getElementById("summary");
const swapBtn = document.getElementById("swapBtn");

// ---------- Functions ----------
function fillSelect(select, options, selected) {
  select.innerHTML = "";
  for (const [key, text] of options) {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = text;
    select.appendChild(opt);
  }
  if (selected) select.value = selected;
}

function loadUnits() {
  const units = categories[categoryEl.value].units;
  const options = Object.entries(units).map(([key, u]) => [key, `${u.name} (${u.symbol})`]);
  const keys = Object.keys(units);
  fillSelect(fromEl, options, keys[0]);
  fillSelect(toEl, options, keys[1] || keys[0]);
  convert();
}

// Round to a reasonable number of decimals and drop trailing zeros.
function formatNumber(n) {
  if (n !== 0 && (Math.abs(n) >= 1e12 || Math.abs(n) < 1e-6)) {
    return n.toExponential(4);
  }
  return parseFloat(n.toFixed(6)).toString();
}

function convert() {
  const raw = inputEl.value.trim();
  const units = categories[categoryEl.value].units;
  const from = units[fromEl.value];
  const to = units[toEl.value];

  messageEl.textContent = "";

  if (raw === "") {
    resultEl.value = "";
    summaryEl.textContent = "";
    return;
  }

  const value = Number(raw);
  if (!Number.isFinite(value)) {
    resultEl.value = "";
    summaryEl.textContent = "";
    messageEl.textContent = "Please enter a valid number.";
    return;
  }

  // Guard against values below absolute zero for temperature.
  if (categoryEl.value === "temperature" && from.toBase(value) < -273.15) {
    resultEl.value = "";
    summaryEl.textContent = "";
    messageEl.textContent = "That is below absolute zero.";
    return;
  }

  const result = to.fromBase(from.toBase(value));
  const formatted = formatNumber(result);
  resultEl.value = formatted;
  summaryEl.innerHTML =
    `${formatNumber(value)} ${from.symbol} = <strong>${formatted} ${to.symbol}</strong>`;
}

function swapUnits() {
  const temp = fromEl.value;
  fromEl.value = toEl.value;
  toEl.value = temp;
  convert();
}

// ---------- Events ----------
fillSelect(categoryEl, Object.entries(categories).map(([k, c]) => [k, c.label]), "length");
categoryEl.addEventListener("change", loadUnits);
inputEl.addEventListener("input", convert);   // live conversion as the user types
fromEl.addEventListener("change", convert);
toEl.addEventListener("change", convert);
swapBtn.addEventListener("click", swapUnits);

loadUnits();