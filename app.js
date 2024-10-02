document.addEventListener('DOMContentLoaded', function() {
    const addProductBtn = document.getElementById('add-product-btn');
    const productModal = document.getElementById('product-modal');
    const productForm = document.getElementById('product-form');
    const tableBody = document.getElementById('inventory-body');
    const locationInfo = document.getElementById('location-info');
    const assignLocationBtn = document.getElementById('assign-location-btn');
    const locationSection = document.getElementById('location-section');
    const inventoryLink = document.getElementById('inventory-link');
    const locationLink = document.getElementById('location-link'); // Añadido para Ubicación
    const inventorySection = document.getElementById('inventory-section');
    const dashboardLink = document.getElementById('dashboard-link');
    const dashboardSection = document.getElementById('dashboard-section');
    const saveInventoryBtn = document.getElementById('save-inventory-btn');
    const inventoryChartElement = document.getElementById('inventory-chart');
    let locationA1 = localStorage.getItem('locationA1') || null;

    let products = JSON.parse(localStorage.getItem('products')) || [];
    let inventoryChart = null; // Variable para almacenar el gráfico actual

    // Función para mostrar productos en la tabla de inventario
    function renderInventory() {
        tableBody.innerHTML = '';
        products.forEach((product, index) => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.quantity}</td>
                <td>
                    <button class="edit-btn">Editar</button>
                    <button class="delete-btn">Eliminar</button>
                    <button class="save-btn">Guardar</button>
                </td>
            `;
            tableBody.appendChild(newRow);
        });
    }

    // Guardar inventario en localStorage
    function saveInventory() {
        localStorage.setItem('products', JSON.stringify(products));
    }

    // Inicializar inventario y ubicaciones
    renderInventory();
    if (locationA1) {
        locationInfo.textContent = `Ubicación A1: ${locationA1}`;
    }

    // Abrir modal para agregar producto
    addProductBtn.addEventListener('click', function() {
        productModal.style.display = 'block';
    });

    // Agregar producto al inventario
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const productId = document.getElementById('product-id').value;
        const productName = document.getElementById('product-name-input').value;
        const productCategory = document.getElementById('product-category').value;
        const productQuantity = document.getElementById('product-quantity').value;

        const newProduct = { id: productId, name: productName, category: productCategory, quantity: productQuantity };
        products.push(newProduct);
        saveInventory();
        renderInventory();
        productModal.style.display = 'none';
        productForm.reset();
    });

    // Función para eliminar, editar y guardar
    tableBody.addEventListener('click', function(e) {
        const row = e.target.closest('tr');
        const rowIndex = Array.from(tableBody.children).indexOf(row);

        if (e.target.classList.contains('delete-btn')) {
            products.splice(rowIndex, 1);
            saveInventory();
            renderInventory();
        } else if (e.target.classList.contains('edit-btn')) {
            const cells = row.querySelectorAll('td');
            cells[1].setAttribute('contenteditable', 'true');
            cells[2].setAttribute('contenteditable', 'true');
            cells[3].setAttribute('contenteditable', 'true');
            e.target.textContent = 'Editando...';
        } else if (e.target.classList.contains('save-btn')) {
            const cells = row.querySelectorAll('td');
            products[rowIndex].name = cells[1].textContent;
            products[rowIndex].category = cells[2].textContent;
            products[rowIndex].quantity = cells[3].textContent;
            saveInventory();
            cells[1].setAttribute('contenteditable', 'false');
            cells[2].setAttribute('contenteditable', 'false');
            cells[3].setAttribute('contenteditable', 'false');
            e.target.textContent = 'Guardar';
            renderInventory();
        }
    });

    // Navegar a la sección de inventario
    inventoryLink.addEventListener('click', function() {
        inventorySection.style.display = 'block';
        dashboardSection.style.display = 'none';
        locationSection.style.display = 'none';
    });

    // Navegar a la sección del dashboard
    dashboardLink.addEventListener('click', function() {
        dashboardSection.style.display = 'block';
        inventorySection.style.display = 'none';
        locationSection.style.display = 'none';
        updateDashboard();
    });

    // Navegar a la sección de ubicación
    locationLink.addEventListener('click', function() { // Ajuste para navegación a Ubicación
        locationSection.style.display = 'block';
        inventorySection.style.display = 'none';
        dashboardSection.style.display = 'none';
    });

    // Actualizar el dashboard con gráficos y estadísticas
    function updateDashboard() {
        const totalProducts = products.length;
        const outOfStockProducts = products.filter(p => p.quantity == 0).length;
        const totalCategories = new Set(products.map(p => p.category)).size;

        document.getElementById('total-products').textContent = totalProducts;
        document.getElementById('out-of-stock').textContent = outOfStockProducts;
        document.getElementById('total-categories').textContent = totalCategories;

        if (inventoryChart) {
            inventoryChart.destroy(); // Destruir el gráfico anterior si existe
        }

        const ctx = inventoryChartElement.getContext('2d');
        inventoryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: products.map(p => p.name),
                datasets: [{
                    label: 'Cantidad de productos',
                    data: products.map(p => p.quantity),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Asignar producto a ubicación A1
    assignLocationBtn.addEventListener('click', function() {
        if (!locationA1) {
            const productOptions = products.map(product => product.name);

            if (productOptions.length > 0) {
                locationA1 = productOptions[0]; // Selecciona el primer producto por defecto
                localStorage.setItem('locationA1', locationA1);
                locationInfo.textContent = `Ubicación A1: ${locationA1}`;
            } else {
                alert('No hay productos disponibles en el inventario.');
            }
        } else {
            alert(`Ubicación A1: ${locationA1}`);
        }
    });

    // Guardar inventario manualmente
    saveInventoryBtn.addEventListener('click', function() {
        saveInventory();
        alert('Inventario guardado correctamente.');
    });

    // Cerrar el modal de agregar productos
    window.addEventListener('click', function(e) {
        if (e.target == productModal) {
            productModal.style.display = 'none';
        }
    });
});
