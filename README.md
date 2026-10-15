Unit Converter

Veda Technology Web Development Internship — Level 1, Day 15 (Task 15)

A simple web app that converts between units of length, weight, temperature and volume. The result updates live as you type.

Features
Dropdown to choose the unit type (Length, Weight, Temperature, Volume)
Dropdowns to choose the "From" and "To" units
Live conversion as the user types, with no button needed
Swap button to flip the two units
Results rounded to a reasonable number of decimals
Input validation (invalid numbers and temperatures below absolute zero)
Supported units
Type	Units
Length	Meters, Kilometers, Centimeters, Millimeters, Miles, Yards, Feet, Inches
Weight	Kilograms, Grams, Milligrams, Metric tonnes, Pounds, Ounces
Temperature	Celsius, Fahrenheit, Kelvin
Volume	Liters, Milliliters, US gallons, US cups, US fluid ounces
Tools used
HTML5
CSS3
JavaScript
Project structure
unit-converter/
├── index.html   # Page structure
├── style.css    # Styling
├── script.js    # Conversion logic
└── README.md
How to run
Put index.html, style.css and script.js in the same folder.
Open index.html in a browser, or right-click it in VS Code and choose Open with Live Server.
How it works

Each unit category has a base unit (meters for length, kilograms for weight, Celsius for temperature, liters for volume). Every unit stores how to convert to and from that base unit. A conversion always goes:

input value  →  base unit  →  target unit

This means a category with n units needs only n conversion definitions, instead of a separate function for every pair of units.

Temperature uses custom formulas instead of a simple multiplication, because the scales have different zero points.

Results are rounded with toFixed(6), then parseFloat removes trailing zeros. Very large or very small numbers are shown in exponential notation.

Adding a new unit

Add one line to the right category in script.js. For example, to add nautical miles to Length:

javascript
nmi: linear("Nautical miles", "nmi", 1852),

The first value is the display name, the second is the symbol, and the third is how many base units (meters here) equal one of the new unit. The dropdowns and conversion update automatically.

Interview notes
How would you structure conversion factors? One factor per unit relative to a base unit, stored in an object per category.
What does toFixed do? It rounds a number to a set number of decimal places and returns a string.
How would you add a new unit? Add one entry to the category's units object (see above).
Author

Anna Makgabo Thantsh# unit-converter
