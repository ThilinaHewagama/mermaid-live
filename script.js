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
    mermaid.init(undefined, '.mermaid');
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