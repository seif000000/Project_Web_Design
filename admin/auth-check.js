// API base URL - detect automatically based on current page
function getApiBaseUrl() {
    if (window.location.port === '5502' || window.location.hostname === '127.0.0.1') {
        return 'http://127.0.0.1:5000/api';
    }
    return 'http://localhost:5000/api';
}

window.API_BASE_URL = window.API_BASE_URL || getApiBaseUrl();
window.API_BASE_URL_FALLBACK = window.API_BASE_URL_FALLBACK || (window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000/api' 
    : 'http://127.0.0.1:5000/api');

// Helper function to fetch with fallback
async function fetchWithFallback(url, fallbackUrl, options) {
    try {
        const response = await fetch(url, options);
        if (response.ok || response.status === 401) {
            return response;
        }
        throw new Error('Primary URL failed');
    } catch (error) {
        console.log('Trying fallback URL...');
        try {
            return await fetch(fallbackUrl, options);
        } catch (fallbackError) {
            throw new Error('Both URLs failed');
        }
    }
}

// Check if user is authenticated and is admin
async function checkAdminAuth() {
    try {
        const fetchOptions = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        let response, result;
        
        // Try primary URL first, then fallback
        try {
            response = await fetch(`${window.API_BASE_URL}/me`, fetchOptions);
            result = await response.json();
        } catch (error) {
            console.log('Primary URL failed, trying fallback...');
            try {
                response = await fetch(`${window.API_BASE_URL_FALLBACK}/me`, fetchOptions);
                result = await response.json();
            } catch (fallbackError) {
                console.error('Both URLs failed:', fallbackError);
                // Don't redirect, just show error
                alert('حدث خطأ في الاتصال بالخادم. تأكد من تشغيل الخادم على http://localhost:5000');
                window.location.href = '../index.html';
                return false;
            }
        }
        
        if (response.ok && result.success && result.authenticated) {
            // Update sessionStorage
            sessionStorage.setItem('authenticated', 'true');
            sessionStorage.setItem('role', result.user.role);
            sessionStorage.setItem('user_id', result.user.id);
            sessionStorage.setItem('username', result.user.username);
            
            if (result.user.role === 'admin') {
                console.log('✅ Admin authenticated successfully');
                return true;
            } else {
                alert('ليس لديك صلاحية للوصول إلى هذه الصفحة');
                window.location.href = '../index.html';
                return false;
            }
        }
        
        // Not authenticated (401)
        console.log('❌ Not authenticated - redirecting to login');
        sessionStorage.removeItem('authenticated');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('username');
        
        alert('يجب تسجيل الدخول أولاً كمسؤول للوصول إلى لوحة التحكم');
        window.location.href = '../personal/login.html';
        return false;
        
    } catch (error) {
        console.error('Error checking authentication:', error);
        alert('حدث خطأ في الاتصال بالخادم');
        window.location.href = '../index.html';
        return false;
    }
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', async function() {
    // Small delay to ensure page is fully loaded
    setTimeout(async () => {
        console.log('🔍 Checking admin authentication...');
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) {
            console.log('⛔ Access denied');
        } else {
            console.log('✅ Access granted');
        }
    }, 100);
});