// API Configuration
// This file centralizes the API base URL configuration

// Try to detect the correct API URL
function getApiBaseUrl() {
    // Check if we're running on localhost or 127.0.0.1
    const hostname = window.location.hostname;
    
    // If accessing via file:// protocol, use localhost
    if (window.location.protocol === 'file:') {
        return 'http://localhost:5000/api';
    }
    
    // If accessing via http://, use the same hostname
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `http://${hostname}:5000/api`;
    }
    
    // Default to localhost
    return 'http://localhost:5000/api';
}

// Export the API base URL
const API_BASE_URL = getApiBaseUrl();

// Also try 127.0.0.1 as fallback
const API_BASE_URL_FALLBACK = 'http://127.0.0.1:5000/api';

