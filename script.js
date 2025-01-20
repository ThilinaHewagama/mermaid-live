// Initialize mermaid
mermaid.initialize({
    startOnLoad: true,
    theme: 'default'
});

let tabCounter = 1;
const defaultDiagram = `flowchart TD
    A[Start] --> B{Decision?}
    B -- Yes --> C[Proceed]
    B -- No --> D[Stop]
    C --> E[Finish]`;

// Tab Management
function createNewTab() {
    tabCounter++;
    
    // Create editor tab
    const editorTab = document.createElement('div');
    editorTab.className = 'tab';
    editorTab.dataset.tab = tabCounter;
    editorTab.innerHTML = `
        <span>Tab ${tabCounter}</span>
        <button class="close-tab"><i class="fas fa-times"></i></button>
    `;
    
    const addTabBtn = document.getElementById('addEditorTab');
    addTabBtn.parentNode.insertBefore(editorTab, addTabBtn);

    // Create editor content
    const editorContent = document.createElement('div');
    editorContent.className = 'tab-pane';
    editorContent.dataset.tab = tabCounter;
    editorContent.innerHTML = `
        <h2>Mermaid Code</h2>
        <textarea class="mermaid-code" placeholder="Enter your mermaid code here...">${defaultDiagram}</textarea>
    `;
    document.getElementById('editorTabContent').appendChild(editorContent);

    // Create preview tab
    const previewTab = document.createElement('div');
    previewTab.className = 'tab';
    previewTab.dataset.tab = tabCounter;
    previewTab.innerHTML = `<span>Preview ${tabCounter}</span>`;
    document.getElementById('previewTabBar').appendChild(previewTab);

    // Create preview content
    const previewContent = document.createElement('div');
    previewContent.className = 'tab-pane';
    previewContent.dataset.tab = tabCounter;
    previewContent.innerHTML = `
        <h2>Preview</h2>
        <div class="theme-buttons">
            <button class="theme-btn" data-theme="default">Default</button>
            <button class="theme-btn" data-theme="dark">Dark</button>
            <button class="theme-btn" data-theme="forest">Forest</button>
            <button class="theme-btn" data-theme="neutral">Neutral</button>
            <button class="theme-btn" data-theme="base">Base</button>
            <button class="theme-btn" data-theme="night">Night</button>
        </div>
        <div class="mermaid-output"></div>
        <div class="bottom-container">
            <div class="zoom-controls">
                <button class="zoom-btn zoom-in" title="Zoom In"><i class="fas fa-search-plus"></i></button>
                <button class="zoom-btn zoom-out" title="Zoom Out"><i class="fas fa-search-minus"></i></button>
                <button class="zoom-btn reset-zoom" title="Reset Zoom"><i class="fas fa-sync-alt"></i></button>
            </div>
            <div class="right-controls">
                <button class="fullscreen-btn"><i class="fas fa-expand"></i> Fullscreen</button>
                <button class="download-btn"><i class="fas fa-download"></i> Download</button>
            </div>
        </div>
    `;
    document.getElementById('previewTabContent').appendChild(previewContent);

    // Activate the new tab
    activateTab(tabCounter);
    
    // Initialize the new preview
    updatePreview(editorContent.querySelector('.mermaid-code'));
}

function activateTab(tabId) {
    // Deactivate all tabs
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

    // Activate selected tabs
    document.querySelectorAll(`.tab[data-tab="${tabId}"]`).forEach(tab => tab.classList.add('active'));
    document.querySelectorAll(`.tab-pane[data-tab="${tabId}"]`).forEach(pane => pane.classList.add('active'));
}

function closeTab(tabId) {
    // Only prevent closing if it's the last remaining tab
    if (document.querySelectorAll('.editor-panel .tab:not(.add-tab)').length <= 1) return;

    document.querySelectorAll(`[data-tab="${tabId}"]`).forEach(el => el.remove());
    
    // Activate the previous tab
    const remainingTabs = document.querySelectorAll('.editor-panel .tab:not(.add-tab)');
    if (remainingTabs.length > 0) {
        const lastTab = remainingTabs[remainingTabs.length - 1];
        activateTab(lastTab.dataset.tab);
    }
}

// Live Preview
function updatePreview(textarea) {
    const tabId = textarea.closest('.tab-pane').dataset.tab;
    const previewDiv = document.querySelector(`.preview-panel .tab-pane[data-tab="${tabId}"] .mermaid-output`);
    
    try {
        // Create a div with class mermaid and set the content
        previewDiv.innerHTML = `<div class="mermaid">${textarea.value}</div>`;
        // Initialize mermaid
        mermaid.init(undefined, previewDiv.querySelector('.mermaid'));
    } catch (error) {
        previewDiv.innerHTML = `<div class="error">Syntax Error: ${error.message}</div>`;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add tab button
    document.getElementById('addEditorTab').addEventListener('click', createNewTab);

    // Tab selection and closing
    document.addEventListener('click', function(e) {
        // Tab selection
        if (e.target.closest('.tab:not(.add-tab)')) {
            const tab = e.target.closest('.tab');
            activateTab(tab.dataset.tab);
        }

        // Close tab
        if (e.target.closest('.close-tab')) {
            e.stopPropagation();
            const tab = e.target.closest('.tab');
            closeTab(tab.dataset.tab);
        }

        // Theme switching
        if (e.target.classList.contains('theme-btn')) {
            const theme = e.target.dataset.theme;
            const tabId = e.target.closest('.tab-pane').dataset.tab;
            const textarea = document.querySelector(`.editor-panel .tab-pane[data-tab="${tabId}"] .mermaid-code`);
            
            mermaid.initialize({
                startOnLoad: true,
                theme: theme
            });
            
            updatePreview(textarea);
        }

        // Zoom controls
        if (e.target.closest('.zoom-btn')) {
            const btn = e.target.closest('.zoom-btn');
            const tabId = btn.closest('.tab-pane').dataset.tab;
            const preview = document.querySelector(`.preview-panel .tab-pane[data-tab="${tabId}"] .mermaid-output`);
            const svg = preview.querySelector('svg');
            
            if (!svg) return;
            
            const currentScale = svg.style.transform ? parseFloat(svg.style.transform.replace('scale(', '')) : 1;
            
            if (btn.classList.contains('zoom-in')) {
                svg.style.transform = `scale(${currentScale * 1.2})`;
            } else if (btn.classList.contains('zoom-out')) {
                svg.style.transform = `scale(${currentScale / 1.2})`;
            } else if (btn.classList.contains('reset-zoom')) {
                svg.style.transform = 'scale(1)';
            }
        }

        // Fullscreen toggle
        if (e.target.closest('.fullscreen-btn')) {
            const tabId = e.target.closest('.tab-pane').dataset.tab;
            const preview = document.querySelector(`.preview-panel .tab-pane[data-tab="${tabId}"] .mermaid-output`);
            
            if (!document.fullscreenElement) {
                preview.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }

        // Download functionality
        if (e.target.closest('.download-btn')) {
            const tabId = e.target.closest('.tab-pane').dataset.tab;
            const preview = document.querySelector(`.preview-panel .tab-pane[data-tab="${tabId}"] .mermaid-output`);
            const svg = preview.querySelector('svg');
            
            if (!svg) return;
            
            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
            const url = URL.createObjectURL(svgBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `mermaid-diagram-${tabId}.svg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    });

    // Monitor changes in all textareas
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('mermaid-code')) {
            updatePreview(e.target);
        }
    });

    // Initialize the first preview
    const firstTextarea = document.querySelector('.mermaid-code');
    updatePreview(firstTextarea);
}); 