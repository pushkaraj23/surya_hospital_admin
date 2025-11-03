const environment = {
    serverBaseUrl: 'https://api.your-cms-backend.com/v1/', 
};

// Simulate the static class structure using a JavaScript object literal
export const API_CONSTANTS = {
    ProductsConstants: {
        API_END_POINTS: {
            // Doctors Module Endpoints (used by DoctorService)
            Doctors: { 
                getDoctors: `${environment.serverBaseUrl}api/doctors`, 
                createDoctor: `${environment.serverBaseUrl}api/doctors`,
                updateDoctor: `${environment.serverBaseUrl}api/doctors/update/{id}`,
                deleteDoctor: `${environment.serverBaseUrl}api/doctors/{id}`,
            },
            
            // Core Product Management Endpoints
            Products: {
                createProducts: `${environment.serverBaseUrl}api/products`,
                getProducts: `${environment.serverBaseUrl}api/products`,
                updateProducts: `${environment.serverBaseUrl}api/products/update/{id}`,
                deleteProducts: `${environment.serverBaseUrl}api/products/{id}`,
                getProduct: `${environment.serverBaseUrl}api/products/{id}`,
                updateOnlyProduct: `${environment.serverBaseUrl}api/products/update/only/product/{id}`,
            },
            
            productVariant: {
                deleteProductVariant: `${environment.serverBaseUrl}api/productvariants/{variantId}`,
            },
            
            Categories: {
                createCategories: `${environment.serverBaseUrl}api/categories`,
                getCategories: `${environment.serverBaseUrl}api/categories`,
                updateCategories: `${environment.serverBaseUrl}api/categories/update/{id}`,
                deleteCategories: `${environment.serverBaseUrl}api/categories/{id}`,
                getCategoryById: `${environment.serverBaseUrl}api/categories/{id}`,
                getSubCategoriesByParentCategorie: `${environment.serverBaseUrl}api/categories/parent/{parentid}`,
            },
            
            Stocks: {
                updateStock: `${environment.serverBaseUrl}api/products/update-stock`,
            }
        }
    }
};