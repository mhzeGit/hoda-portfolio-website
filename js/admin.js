/**
 * Admin Panel Main Script
 * Fully automatic - no manual file management needed
 */

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
});

// =============================================
// State
// =============================================
let portfolioItems = [];
let currentEditId = null;
let deleteItemId = null;

const STORAGE_KEY = 'portfolio_data_live';

// =============================================
// Authentication
// =============================================
function initAuth() {
    const loginScreen = document.getElementById('loginScreen');
    const adminPanel = document.getElementById('adminPanel');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');
    const togglePassword = document.querySelector('.toggle-password');

    // Check existing session
    if (AdminAuth.validateSession()) {
        showAdminPanel();
    }

    // Login form submit
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const result = await AdminAuth.validateCredentials(username, password);
        
        if (result.success) {
            AdminAuth.createSession();
            showAdminPanel();
            loginForm.reset();
            loginError.classList.remove('show');
        } else {
            loginError.textContent = result.message;
            loginError.classList.add('show');
            
            if (result.locked) {
                document.querySelector('.btn-primary').disabled = true;
                setTimeout(() => {
                    document.querySelector('.btn-primary').disabled = false;
                }, 60000);
            }
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        AdminAuth.destroySession();
        location.reload();
    });

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const passwordInput = document.getElementById('password');
        const icon = togglePassword.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
}

function showAdminPanel() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    initAdminPanel();
}

// =============================================
// Admin Panel Initialization
// =============================================
function initAdminPanel() {
    loadData();
    renderPortfolioList();
    initModals();
    initEventListeners();
    initImageUploads();
    createToastContainer();
}

function initEventListeners() {
    // New item button
    document.getElementById('newItemBtn').addEventListener('click', () => {
        openEditModal();
    });

    // Publish button
    document.getElementById('publishBtn').addEventListener('click', downloadForPublishing);

    // Form submit
    document.getElementById('itemForm').addEventListener('submit', handleFormSubmit);

    // Cancel button
    document.getElementById('cancelBtn').addEventListener('click', () => {
        closeModal('editModal');
    });

    // Delete confirmation buttons
    document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
        closeModal('deleteModal');
    });

    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
}

// =============================================
// Image Upload Handling
// =============================================
function initImageUploads() {
    const imageTypes = ['Final', 'Basecolor', 'Normal', 'Wireframe', 'Nocolor'];
    
    imageTypes.forEach(type => {
        const input = document.getElementById(`imgUpload${type}`);
        const preview = document.getElementById(`preview${type}`);
        const clearBtn = document.getElementById(`clear${type}`);
        
        // File input change
        input.addEventListener('change', (e) => {
            handleImageUpload(e, type);
        });
        
        // Clear button
        clearBtn.addEventListener('click', () => {
            clearImage(type);
        });
        
        // Click on preview to trigger file input
        preview.addEventListener('click', () => {
            input.click();
        });
        
        // Drag and drop
        preview.addEventListener('dragover', (e) => {
            e.preventDefault();
            preview.classList.add('dragover');
        });
        
        preview.addEventListener('dragleave', () => {
            preview.classList.remove('dragover');
        });
        
        preview.addEventListener('drop', (e) => {
            e.preventDefault();
            preview.classList.remove('dragover');
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                processImageFile(file, type);
            }
        });
    });
}

function handleImageUpload(e, type) {
    const file = e.target.files[0];
    if (file) {
        processImageFile(file, type);
    }
}

function processImageFile(file, type) {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image too large. Maximum size is 5MB.', 'error');
        return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file.', 'error');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const base64Data = e.target.result;
        
        // Compress if needed
        compressImage(base64Data, (compressedData) => {
            // Store in hidden input
            document.getElementById(`imgData${type}`).value = compressedData;
            
            // Update preview
            updatePreview(type, compressedData);
            
            // Show clear button
            document.getElementById(`clear${type}`).classList.remove('hidden');
            
            showToast(`${type} image uploaded!`, 'success');
        });
    };
    
    reader.readAsDataURL(file);
}

function compressImage(base64Data, callback) {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Max dimensions
        const maxWidth = 1200;
        const maxHeight = 900;
        
        let { width, height } = img;
        
        // Calculate new dimensions
        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to JPEG with 80% quality for smaller size
        const compressedData = canvas.toDataURL('image/jpeg', 0.8);
        callback(compressedData);
    };
    img.src = base64Data;
}

function updatePreview(type, imageData) {
    const preview = document.getElementById(`preview${type}`);
    const placeholder = preview.querySelector('.upload-placeholder');
    let img = preview.querySelector('img');
    
    if (!img) {
        img = document.createElement('img');
        preview.appendChild(img);
    }
    
    img.src = imageData;
    img.alt = `${type} preview`;
    
    if (placeholder) {
        placeholder.style.display = 'none';
    }
}

function clearImage(type) {
    document.getElementById(`imgData${type}`).value = '';
    document.getElementById(`imgUpload${type}`).value = '';
    
    const preview = document.getElementById(`preview${type}`);
    const img = preview.querySelector('img');
    const placeholder = preview.querySelector('.upload-placeholder');
    
    if (img) {
        img.remove();
    }
    if (placeholder) {
        placeholder.style.display = 'flex';
    }
    
    document.getElementById(`clear${type}`).classList.add('hidden');
}

// =============================================
// Data Management
// =============================================
function loadData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        try {
            portfolioItems = JSON.parse(savedData);
        } catch {
            portfolioItems = [];
        }
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolioItems));
    showToast('Changes saved and published!', 'success');
}

function getNextId() {
    if (portfolioItems.length === 0) return 1;
    return Math.max(...portfolioItems.map(item => item.id)) + 1;
}

// =============================================
// Portfolio List Rendering
// =============================================
function renderPortfolioList() {
    const listContainer = document.getElementById('portfolioList');
    const itemCount = document.getElementById('itemCount');
    
    itemCount.textContent = `${portfolioItems.length} item${portfolioItems.length !== 1 ? 's' : ''}`;
    
    if (portfolioItems.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h3>No portfolio items yet</h3>
                <p>Click "New Portfolio Item" to add your first work</p>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = portfolioItems.map(item => `
        <div class="portfolio-list-item" data-id="${item.id}">
            <div class="list-item-image">
                ${item.images && item.images.final 
                    ? `<img src="${item.images.final}" alt="${item.title}">`
                    : `<i class="fas fa-cube"></i>`
                }
            </div>
            <div class="list-item-content">
                <p class="list-item-category">${item.category}</p>
                <h3 class="list-item-title">${item.title}</h3>
                <p class="list-item-description">${item.description}</p>
                <div class="list-item-actions">
                    <button class="btn btn-secondary btn-sm edit-btn" data-id="${item.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners to edit/delete buttons
    listContainer.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            openEditModal(id);
        });
    });

    listContainer.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            openDeleteModal(id);
        });
    });
}

// =============================================
// Modal Management
// =============================================
function initModals() {
    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            const modal = overlay.closest('.modal');
            closeModal(modal.id);
        });
    });

    // Close modals on X button click
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal.id);
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = '';
}

// =============================================
// Edit Modal
// =============================================
function openEditModal(id = null) {
    currentEditId = id;
    const form = document.getElementById('itemForm');
    const modalTitle = document.getElementById('modalTitle');
    
    // Reset form
    form.reset();
    clearAllImages();
    
    if (id) {
        // Edit existing item
        modalTitle.textContent = 'Edit Portfolio Item';
        const item = portfolioItems.find(i => i.id === id);
        
        if (item) {
            document.getElementById('itemTitle').value = item.title || '';
            document.getElementById('itemCategory').value = item.category || '';
            document.getElementById('itemDescription').value = item.description || '';
            document.getElementById('itemSoftware').value = item.software || '';
            document.getElementById('itemDate').value = item.date || '';
            document.getElementById('itemPolygons').value = item.polygons || '';
            document.getElementById('itemTags').value = (item.tags || []).join(', ');
            
            // Load existing images
            if (item.images) {
                const imageTypes = ['final', 'basecolor', 'normal', 'wireframe', 'nocolor'];
                imageTypes.forEach(type => {
                    const capitalType = type.charAt(0).toUpperCase() + type.slice(1);
                    if (item.images[type]) {
                        document.getElementById(`imgData${capitalType}`).value = item.images[type];
                        updatePreview(capitalType, item.images[type]);
                        document.getElementById(`clear${capitalType}`).classList.remove('hidden');
                    }
                });
            }
        }
    } else {
        // New item
        modalTitle.textContent = 'New Portfolio Item';
    }
    
    openModal('editModal');
}

function clearAllImages() {
    const imageTypes = ['Final', 'Basecolor', 'Normal', 'Wireframe', 'Nocolor'];
    imageTypes.forEach(type => {
        document.getElementById(`imgData${type}`).value = '';
        document.getElementById(`imgUpload${type}`).value = '';
        document.getElementById(`clear${type}`).classList.add('hidden');
        
        const preview = document.getElementById(`preview${type}`);
        const img = preview.querySelector('img');
        const placeholder = preview.querySelector('.upload-placeholder');
        
        if (img) img.remove();
        if (placeholder) placeholder.style.display = 'flex';
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        id: currentEditId || getNextId(),
        title: document.getElementById('itemTitle').value.trim(),
        category: document.getElementById('itemCategory').value.trim(),
        description: document.getElementById('itemDescription').value.trim(),
        software: document.getElementById('itemSoftware').value.trim(),
        date: document.getElementById('itemDate').value.trim(),
        polygons: document.getElementById('itemPolygons').value.trim(),
        tags: document.getElementById('itemTags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag),
        images: {
            final: document.getElementById('imgDataFinal').value,
            basecolor: document.getElementById('imgDataBasecolor').value,
            normal: document.getElementById('imgDataNormal').value,
            wireframe: document.getElementById('imgDataWireframe').value,
            nocolor: document.getElementById('imgDataNocolor').value
        }
    };
    
    // Validate at least final image
    if (!formData.images.final) {
        showToast('Please upload at least the Final Render image', 'error');
        return;
    }
    
    if (currentEditId) {
        // Update existing
        const index = portfolioItems.findIndex(i => i.id === currentEditId);
        if (index !== -1) {
            portfolioItems[index] = formData;
        }
    } else {
        // Add new
        portfolioItems.push(formData);
    }
    
    saveData();
    renderPortfolioList();
    closeModal('editModal');
}

// =============================================
// Delete Modal
// =============================================
function openDeleteModal(id) {
    deleteItemId = id;
    const item = portfolioItems.find(i => i.id === id);
    
    if (item) {
        document.getElementById('deleteItemName').textContent = item.title;
        openModal('deleteModal');
    }
}

function confirmDelete() {
    if (deleteItemId) {
        portfolioItems = portfolioItems.filter(i => i.id !== deleteItemId);
        saveData();
        renderPortfolioList();
    }
    
    deleteItemId = null;
    closeModal('deleteModal');
}

// =============================================
// Toast Notifications
// =============================================
function createToastContainer() {
    if (!document.querySelector('.toast-container')) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

function showToast(message, type = 'info') {
    const container = document.querySelector('.toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// =============================================
// Publishing / Export
// =============================================
function downloadForPublishing() {
    if (portfolioItems.length === 0) {
        showToast('No portfolio items to publish. Create some items first!', 'error');
        return;
    }
    
    const dataString = JSON.stringify(portfolioItems, null, 4);
    const fileContent = `// Portfolio Data
// Auto-generated by Admin Panel on ${new Date().toLocaleString()}
// Place this file at: js/portfolio-data.js

const portfolioData = ${dataString};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = portfolioData;
}
`;
    
    const blob = new Blob([fileContent], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-data.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('File downloaded! Replace js/portfolio-data.js and commit to Git.', 'success');
}
