// Initialize mermaid
mermaid.initialize({ 
    startOnLoad: true,
    theme: 'default'
});

// Get elements
const codeInput = document.getElementById('mermaidCode');
const outputDiv = document.getElementById('mermaidOutput');
const themeButtons = document.querySelectorAll('.theme-btn');
const downloadBtn = document.getElementById('downloadBtn');

// Function to update the diagram
function updateDiagram() {
    // Clear the output div
    outputDiv.innerHTML = '';
    
    // Create a new div for mermaid
    const mermaidDiv = document.createElement('div');
    mermaidDiv.className = 'mermaid';
    mermaidDiv.textContent = codeInput.value;
    
    // Add the div to output
    outputDiv.appendChild(mermaidDiv);
    
    // Render the diagram
    mermaid.init(undefined, '.mermaid').then(() => {
        initZoomPan();
    });
}

// Function to change theme
function changeTheme(themeName) {
    // Update mermaid configuration
    mermaid.initialize({ 
        startOnLoad: true,
        theme: themeName
    });
    
    // Update active button state
    themeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === themeName);
    });
    
    // Re-render the diagram
    updateDiagram();
}

// Add event listener for input changes
codeInput.addEventListener('input', updateDiagram);

// Add event listeners for theme buttons
themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        changeTheme(button.dataset.theme);
    });
});

// Set default theme button as active
document.querySelector('[data-theme="default"]').classList.add('active');

// Initial render
updateDiagram();

// Add this new function for downloading
function downloadDiagram() {
    // Find the SVG element
    const svgElement = document.querySelector('#mermaidOutput svg');
    
    if (!svgElement) {
        alert('No diagram to download!');
        return;
    }

    // Create a clone of the SVG element
    const svgClone = svgElement.cloneNode(true);
    
    // Get the SVG source
    const svgData = new XMLSerializer().serializeToString(svgClone);
    
    // Create a Blob from the SVG data
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
    
    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.download = 'mermaid-diagram.svg';
    downloadLink.href = URL.createObjectURL(svgBlob);
    
    // Trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Clean up the URL object
    URL.revokeObjectURL(downloadLink.href);
}

// Add event listener for download button
downloadBtn.addEventListener('click', downloadDiagram);

// Fullscreen functionality
const fullscreenBtn = document.getElementById('fullscreenBtn');
const previewPanel = document.querySelector('.preview-panel');

fullscreenBtn.addEventListener('click', () => {
    previewPanel.classList.toggle('fullscreen');
    const isFullscreen = previewPanel.classList.contains('fullscreen');
    fullscreenBtn.innerHTML = isFullscreen ? 
        '<i class="fas fa-compress"></i> Exit Fullscreen' : 
        '<i class="fas fa-expand"></i> Fullscreen';
    // Trigger a re-render of the diagram to adjust to new size
    updatePreview();
});

// Zoom and Pan functionality
let currentScale = 1;
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;

function updateTransform(svgElement) {
    if (!svgElement) return;
    svgElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
}

function initZoomPan() {
    const svgElement = document.querySelector('#mermaidOutput svg');
    if (!svgElement) return;

    // Reset transform
    currentScale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform(svgElement);

    // Pan functionality
    svgElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        svgElement.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform(svgElement);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        if (svgElement) {
            svgElement.style.cursor = 'grab';
        }
    });

    // Zoom buttons functionality
    document.getElementById('zoomInBtn').addEventListener('click', () => {
        currentScale = Math.min(currentScale * 1.2, 5);
        updateTransform(svgElement);
    });

    document.getElementById('zoomOutBtn').addEventListener('click', () => {
        currentScale = Math.max(currentScale / 1.2, 0.2);
        updateTransform(svgElement);
    });

    document.getElementById('resetZoomBtn').addEventListener('click', () => {
        currentScale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform(svgElement);
    });

    // Mouse wheel zoom
    svgElement.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = currentScale * delta;
        
        if (newScale >= 0.2 && newScale <= 5) {
            // Get the SVG container's bounding box
            const rect = svgElement.getBoundingClientRect();
            
            // Calculate the position of the cursor relative to the SVG's center
            const svgCenterX = rect.left + rect.width / 2;
            const svgCenterY = rect.top + rect.height / 2;
            
            // Calculate the cursor's distance from the center
            const distanceX = e.clientX - svgCenterX;
            const distanceY = e.clientY - svgCenterY;
            
            // Calculate the new position maintaining the cursor's relative position
            const scaleFactor = 1 - delta;
            translateX += distanceX * scaleFactor;
            translateY += distanceY * scaleFactor;
            
            currentScale = newScale;
            updateTransform(svgElement);
        }
    });
} 