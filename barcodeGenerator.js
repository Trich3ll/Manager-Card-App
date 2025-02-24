<meta name='viewport' content='width=device-width, initial-scale=1'/><script>// barcodeGenerator.js

// Function to calculate EAN13 check digit
function calculateEAN13CheckDigit(digits) {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        const digit = parseInt(digits[i]);
        sum += (i % 2 === 0) ? digit * 3 : digit; // Odd positions (1-based) × 3, even × 1
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit;
}

// Initialize the barcode generator when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get form and badge elements
    const form = document.getElementById('barcodeForm');
    const badge = document.getElementById('badge');
    const barcodeSvg = document.getElementById('barcode');
    const managerText = document.getElementById('managerText');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get and clean form inputs
            const storeNumberInput = document.getElementById('storeNumber').value;
            const managerNumberInput = document.getElementById('managerNumber').value;
            const managerName = document.getElementById('managerName').value;
            
            // Clean inputs by removing all non-digit characters
            const storeNumber = storeNumberInput.replace(/\D/g, '');
            const managerNumber = managerNumberInput.replace(/\D/g, '');
            
            // Log raw and cleaned inputs for debugging
            console.log('Store Number (raw):', storeNumberInput, 'Cleaned:', storeNumber);
            console.log('Manager Number (raw):', managerNumberInput, 'Cleaned:', managerNumber);
            
            // Validate inputs
            if (storeNumber.length !== 4 || managerNumber.length !== 4) {
                alert('Invalid barcode format. Ensure inputs are exactly 4 digits each.');
                return;
            }
            
            // Construct the 12-digit base for EAN13
            const baseBarcode = '8888' + storeNumber + '0' + managerNumber;
            
            // Ensure baseBarcode is exactly 12 digits and numeric
            if (baseBarcode.length !== 12 || isNaN(baseBarcode)) {
                alert('Invalid barcode format. Ensure all digits are numeric.');
                return;
            }
            
            // Calculate the check digit
            const checkDigit = calculateEAN13CheckDigit(baseBarcode);
            
            // Construct the full 13-digit EAN13 barcode
            const barcodeValue = baseBarcode + checkDigit;
            
            // Generate the EAN13 barcode
            JsBarcode(barcodeSvg, barcodeValue, {
                format: "EAN13",
                width: 2,
                height: 100,
                displayValue: true
            });
            
            // Display the badge details
            managerText.innerText = `Manager: ${managerName}\nStore: ${storeNumber}\nManager ID: ${managerNumber}`;
            badge.style.display = 'block';
        });
    }

    // Print function
    window.printBadge = function() {
        window.print();
    };

    // Download as PDF function
    window.downloadPDF = function() {
        const element = document.getElementById('badge');
        html2pdf().from(element).save('manager_badge.pdf');
    };
});</script>