document.addEventListener('DOMContentLoaded', function() {
    const categorySelect = document.getElementById('category-select');
    const categoryProductsBody = document.getElementById('category-products-body');
    let productos = JSON.parse(localStorage.getItem('productos')) || [];

    // Obtener las categorías únicas de los productos
    function getUniqueCategories() {
        const categorias = [...new Set(productos.map(producto => producto['LINEA']))];
        return categorias;
    }

    // Renderizar las opciones de categorías en el select
    function renderCategories() {
        const categorias = getUniqueCategories();
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            categorySelect.appendChild(option);
        });
    }

    // Filtrar y renderizar los productos según la categoría seleccionada
    function renderCategoryProducts(categoriaSeleccionada) {
        categoryProductsBody.innerHTML = ''; // Limpiar la tabla

        const filteredProducts = productos.filter(producto => producto['LINEA'] === categoriaSeleccionada);

        filteredProducts.forEach((producto, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${producto['HAIR/MMK']}</td>
                <td>${producto['LINEA']}</td>
                <td>${producto['PF-PP']}</td>
                <td>${producto['MATERIAL']}</td>
                <td>${producto['DESCRIPCIÓN']}</td>
                <td>${producto['TOTAL']}</td>
                <td>${producto['ESTADO']}</td>
            `;
            categoryProductsBody.appendChild(row);
        });
    }

    // Manejar el cambio de categoría seleccionada
    categorySelect.addEventListener('change', function() {
        const categoriaSeleccionada = categorySelect.value;
        renderCategoryProducts(categoriaSeleccionada);
    });

    // Inicializar la página con las categorías y renderizar la tabla de la primera categoría
    renderCategories();
});
