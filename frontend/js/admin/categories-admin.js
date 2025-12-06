// Category Management for Admin Portal
let allCategories = [];
let editingCategoryId = null;

// Load all categories data
async function fetchCategoriesData() {
    try {
        console.log('Fetching categories data...');
        showLoading();
        const response = await fetch('https://krishna-enterprises-9oup.onrender.com/api/categories/all', {
            credentials: 'include'
        });
        
        console.log('Response status:', response.status);
        
        // Check if response is ok (not 403 Forbidden)
        if (response.status === 403) {
            console.error('403 Forbidden - Not authenticated');
            showError('Access denied. Please login as admin.');
            hideLoading();
            return;
        }
        
        const result = await response.json();
        console.log('Categories result:', result);
        
        if (result.success) {
            allCategories = result.data || result.categories || [];
            console.log('Categories loaded:', allCategories.length);
            displayCategories();
        } else {
            console.error('Failed to load categories:', result.message);
            showError(result.message || 'Failed to load categories');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        showError('Error loading categories: ' + error.message);
    } finally {
        hideLoading();
    }
}

// Display categories in table
function displayCategories() {
    const tbody = document.getElementById('categoriesTableBody');
    
    if (!tbody) {
        console.error('Categories table body not found!');
        return;
    }
    
    if (!allCategories || allCategories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-500">No categories found</td></tr>';
        return;
    }
    
    tbody.innerHTML = allCategories.map(category => `
        <tr class="border-b hover:bg-gray-50">
            <td class="px-4 py-3">
                <i class="fas ${category.icon || 'fa-folder'} text-yellow-600 mr-2"></i>
                ${category.name}
            </td>
            <td class="px-4 py-3 text-gray-600">${category.description || '-'}</td>
            <td class="px-4 py-3 text-center">${category.displayOrder || 0}</td>
            <td class="px-4 py-3 text-center">
                <span class="px-2 py-1 rounded text-xs ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                    ${category.isActive ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td class="px-4 py-3 text-gray-500 text-sm">${new Date(category.createdAt).toLocaleDateString()}</td>
            <td class="px-4 py-3 text-center">
                <button onclick="editCategory('${category._id}')" class="text-blue-600 hover:text-blue-800 mr-3">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteCategory('${category._id}')" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Show category form
function showCategoryForm() {
    document.getElementById('categoryFormTitle').textContent = 'Add New Category';
    document.getElementById('categoryForm').reset();
    editingCategoryId = null;
    document.getElementById('categoryFormModal').classList.remove('hidden');
}

// Hide category form
function hideCategoryForm() {
    document.getElementById('categoryFormModal').classList.add('hidden');
    document.getElementById('categoryForm').reset();
    editingCategoryId = null;
}

// Edit category
function editCategory(categoryId) {
    const category = allCategories.find(c => c._id === categoryId);
    if (!category) return;
    
    editingCategoryId = categoryId;
    document.getElementById('categoryFormTitle').textContent = 'Edit Category';
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryDescription').value = category.description || '';
    document.getElementById('categoryIcon').value = category.icon || 'fa-folder';
    document.getElementById('categoryDisplayOrder').value = category.displayOrder || 0;
    document.getElementById('categoryActive').checked = category.isActive;
    document.getElementById('categoryFormModal').classList.remove('hidden');
}

// Save category
async function saveCategory(event) {
    event.preventDefault();
    
    const name = document.getElementById('categoryName').value.trim();
    const description = document.getElementById('categoryDescription').value.trim();
    const icon = document.getElementById('categoryIcon').value.trim();
    const displayOrder = parseInt(document.getElementById('categoryDisplayOrder').value) || 0;
    const isActive = document.getElementById('categoryActive').checked;
    
    if (!name) {
        showError('Please enter category name');
        return;
    }
    
    try {
        showLoading();
        
        const categoryData = {
            name,
            description,
            icon,
            displayOrder,
            isActive
        };
        
        const url = editingCategoryId 
            ? `https://krishna-enterprises-9oup.onrender.com/api/categories/${editingCategoryId}`
            : 'https://krishna-enterprises-9oup.onrender.com/api/categories';
        
        const method = editingCategoryId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(categoryData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess(editingCategoryId ? 'Category updated successfully!' : 'Category added successfully!');
            hideCategoryForm();
            await fetchCategoriesData();
        } else {
            showError(result.message || 'Failed to save category');
        }
    } catch (error) {
        console.error('Error saving category:', error);
        showError('Error saving category');
    } finally {
        hideLoading();
    }
}

// Delete category
async function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to delete this category?')) {
        return;
    }
    
    try {
        showLoading();
        
        const response = await fetch(`https://krishna-enterprises-9oup.onrender.com/api/categories/${categoryId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess('Category deleted successfully!');
            await fetchCategoriesData();
        } else {
            showError(result.message || 'Failed to delete category');
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        showError('Error deleting category');
    } finally {
        hideLoading();
    }
}

// Show loading
function showLoading() {
    const loadingDiv = document.getElementById('loadingIndicator');
    if (loadingDiv) {
        loadingDiv.classList.remove('hidden');
    }
}

// Hide loading
function hideLoading() {
    const loadingDiv = document.getElementById('loadingIndicator');
    if (loadingDiv) {
        loadingDiv.classList.add('hidden');
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${message}`;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successDiv.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${message}`;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Initialize categories page
window.initCategoriesAdmin = function() {
    fetchCategoriesData();
};
