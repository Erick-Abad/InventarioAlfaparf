document.addEventListener('DOMContentLoaded', function() {
    const addProductBtn = document.getElementById('add-product-btn');
    const productModal = document.getElementById('product-modal');
    const productForm = document.getElementById('product-form');
    const tableBody = document.getElementById('inventory-body');
    const locationInfo = document.getElementById('location-info');
    const assignLocationBtn = document.getElementById('assign-location-btn');
    const locationSection = document.getElementById('location-section');
    const inventoryLink = document.getElementById('inventory-link');
    const locationLink = document.getElementById('location-link');
    const inventorySection = document.getElementById('inventory-section');
    const dashboardLink = document.getElementById('dashboard-link');
    const dashboardSection = document.getElementById('dashboard-section');
    const saveInventoryBtn = document.getElementById('save-inventory-btn');
    const inventoryChartElement = document.getElementById('inventory-chart');
    const productsLink = document.getElementById('products-link');
    const productsSection = document.getElementById('products-section');
    const productsBody = document.getElementById('products-body');
    const fileUpload = document.getElementById('file-upload');
    const saveProductsBtn = document.getElementById('save-products-btn');
    const categoryLink = document.getElementById('categories-link');
    const categorySection = document.getElementById('categories-section');

    // Unificar el almacenamiento en una sola variable
    let locationA1 = localStorage.getItem('locationA1') || null;
    let productos = JSON.parse(localStorage.getItem('productos')) || [];

    // Función para aplicar el color según el estado del producto
    function getEstadoClass(estado) {
        if (estado === 'AGOTADO') {
            return 'estado-agotado';
        } else if (estado === 'POR AGOTAR') {
            return 'estado-por-agotar';
        } else {
            return 'estado-disponible';
        }
    }

    // Renderizar productos en la tabla
    function renderProducts() {
        productsBody.innerHTML = ''; // Limpiar contenido previo
        productos.forEach((producto, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${producto['HAIR/MMK']}</td>
                <td>${producto['LINEA']}</td>
                <td>${producto['PF-PP']}</td>
                <td>${producto['MATERIAL']}</td>
                <td>${producto['DESCRIPCIÓN']}</td>
                <td>${producto['TOTAL']}</td>
                <td class="${getEstadoClass(producto['ESTADO'])}">${producto['ESTADO']}</td>
            `;
            productsBody.appendChild(row);
        });
    }

    // Leer archivo Excel y añadir los datos a la tabla
    fileUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const excelData = XLSX.utils.sheet_to_json(firstSheet);

            // Variable para contar las nuevas descripciones únicas agregadas
            let uniqueDescriptionsCount = 0;

            // Obtener las descripciones actuales para evitar duplicados
            const currentDescriptions = productos.map(producto => producto['DESCRIPCIÓN']);

            // Agregar los datos del Excel a la lista de productos, solo si la descripción no está repetida
            excelData.forEach(item => {
                const total = item['TOTAL'];
                let estado = 'DISPONIBLE';
                if (total === 0) {
                    estado = 'AGOTADO';
                } else if (total <= 10) {
                    estado = 'POR AGOTAR';
                }

                // Verificar si la descripción ya existe
                if (!currentDescriptions.includes(item['DESCRIPCIÓN'])) {
                    productos.push({
                        'HAIR/MMK': item['HAIR/MMK'],
                        'LINEA': item['LINEA'],
                        'PF-PP': item['PF-PP'],
                        'MATERIAL': item['MATERIAL'],
                        'DESCRIPCIÓN': item['DESCRIPCIÓN'],
                        'TOTAL': total,
                        'ESTADO': estado
                    });
                    uniqueDescriptionsCount++; // Incrementar contador de descripciones únicas
                }
            });

            // Renderizar los productos después de añadir los nuevos
            renderProducts();

            // Mostrar mensaje de cuántas descripciones únicas se agregaron
            alert(`Se agregaron ${uniqueDescriptionsCount} nuevas descripciones que no estaban repetidas.`);
        };

        reader.readAsArrayBuffer(file);
    });

    // Guardar los productos en localStorage
    saveProductsBtn.addEventListener('click', function() {
        localStorage.setItem('productos', JSON.stringify(productos));
        alert('Productos guardados correctamente.');
    });

    // Renderizar productos al cargar la sección de productos
    productsLink.addEventListener('click', function() {
        productsSection.style.display = 'block';
        inventorySection.style.display = 'none';
        dashboardSection.style.display = 'none';
        locationSection.style.display = 'none';
        categorySection.style.display = 'none';
        renderProducts();
    });

    // Renderizar inventario en la tabla de inventario (usamos los mismos datos de productos)
    function renderInventory() {
        tableBody.innerHTML = '';
        productos.forEach((producto, index) => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${index + 1}</td>
                <td>${producto['HAIR/MMK']}</td>
                <td>${producto['LINEA']}</td>
                <td>${producto['PF-PP']}</td>
                <td>${producto['MATERIAL']}</td>
                <td>${producto['DESCRIPCIÓN']}</td>
                <td>${producto['TOTAL']}</td>
                <td>
                    <button class="edit-btn">Editar</button>
                    <button class="delete-btn">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(newRow);
        });
    }

    // Guardar inventario (se guarda como productos en localStorage)
    function saveInventory() {
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    // Manejar la edición y eliminación de productos en el inventario
    tableBody.addEventListener('click', function(e) {
        const row = e.target.closest('tr');
        const rowIndex = Array.from(tableBody.children).indexOf(row);

        if (e.target.classList.contains('delete-btn')) {
            productos.splice(rowIndex, 1);
            saveInventory();
            renderInventory();
        } else if (e.target.classList.contains('edit-btn')) {
            const cells = row.querySelectorAll('td');
            cells[1].setAttribute('contenteditable', 'true');
            cells[2].setAttribute('contenteditable', 'true');
            cells[3].setAttribute('contenteditable', 'true');
            e.target.textContent = 'Guardando...';
        } else if (e.target.classList.contains('save-btn')) {
            const cells = row.querySelectorAll('td');
            productos[rowIndex].name = cells[1].textContent;
            productos[rowIndex].category = cells[2].textContent;
            productos[rowIndex].quantity = cells[3].textContent;
            saveInventory();
            cells[1].setAttribute('contenteditable', 'false');
            cells[2].setAttribute('contenteditable', 'false');
            cells[3].setAttribute('contenteditable', 'false');
            e.target.textContent = 'Guardar';
            renderInventory();
        }
    });

    // Asignar producto a la ubicación A1
    assignLocationBtn.addEventListener('click', function() {
        if (!locationA1) {
            const productOptions = productos.map(producto => producto['DESCRIPCIÓN']);

            if (productOptions.length > 0) {
                locationA1 = productOptions[0]; // Selecciona el primer producto disponible por defecto
                localStorage.setItem('locationA1', locationA1);
                locationInfo.textContent = `Ubicación A1: ${locationA1}`;
            } else {
                alert('No hay productos disponibles en el inventario.');
            }
        } else {
            alert(`Ubicación A1 ya está asignada a: ${locationA1}`);
        }
    });

    // Actualizar el dashboard con estadísticas y gráfico
    function updateDashboard() {
        const totalProducts = productos.length;
        const outOfStockProducts = productos.filter(producto => producto['TOTAL'] == 0).length;
        const totalCategories = new Set(productos.map(producto => producto['LINEA'])).size;

        document.getElementById('total-products').textContent = totalProducts;
        document.getElementById('out-of-stock').textContent = outOfStockProducts;
        document.getElementById('total-categories').textContent = totalCategories;

        if (window.inventoryChart) {
            window.inventoryChart.destroy(); // Destruir el gráfico anterior si existe
       
        }

        const ctx = inventoryChartElement.getContext('2d');
        window.inventoryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: productos.map(producto => producto['DESCRIPCIÓN']),
                datasets: [{
                    label: 'Cantidad de productos',
                    data: productos.map(producto => producto['TOTAL']),
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

    // Navegación entre secciones
    inventoryLink.addEventListener('click', function() {
        inventorySection.style.display = 'block';
        dashboardSection.style.display = 'none';
        locationSection.style.display = 'none';
        productsSection.style.display = 'none';
        categorySection.style.display = 'none';
        renderInventory();
    });

    dashboardLink.addEventListener('click', function() {
        dashboardSection.style.display = 'block';
        inventorySection.style.display = 'none';
        locationSection.style.display = 'none';
        productsSection.style.display = 'none';
        categorySection.style.display = 'none';
        updateDashboard();
    });

    locationLink.addEventListener('click', function() {
        locationSection.style.display = 'block';
        inventorySection.style.display = 'none';
        dashboardSection.style.display = 'none';
        productsSection.style.display = 'none';
        categorySection.style.display = 'none';
    });

    categoryLink.addEventListener('click', function() {
        categorySection.style.display = 'block';
        inventorySection.style.display = 'none';
        dashboardSection.style.display = 'none';
        locationSection.style.display = 'none';
        productsSection.style.display = 'none';
    });

    // Guardar inventario manualmente
    saveInventoryBtn.addEventListener('click', function() {
        saveInventory();
        alert('Inventario guardado correctamente.');
    });

    // Cargar ubicación A1 al iniciar
    if (locationA1) {
        locationInfo.textContent = `Ubicación A1: ${locationA1}`;
    }

    // Cerrar el modal de agregar productos
    window.addEventListener('click', function(e) {
        if (e.target == productModal) {
            productModal.style.display = 'none';
        }
    });
});