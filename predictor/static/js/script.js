// DOM Elements
const predictionForm = document.getElementById('predictionForm');
const predictionResult = document.getElementById('predictionResult');
const predictedPrice = document.getElementById('predictedPrice');
const navbar = document.querySelector('.navbar');

// Navigation smooth scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class to listing cards
    document.querySelectorAll('.listing-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Add fade-in class to feature items
    document.querySelectorAll('.feature-item').forEach((item, index) => {
        item.classList.add('fade-in');
        item.style.animationDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
});

// Form validation
function validateForm(formData) {
    const errors = [];
    
    // House age validation
    const houseAge = parseFloat(formData.houseAge);
    if (isNaN(houseAge) || houseAge < 0 || houseAge > 100) {
        errors.push('House age must be between 0 and 100 years');
    }
    
    // Distance to MRT validation
    const distanceToMRT = parseFloat(formData.distanceToMRT);
    if (isNaN(distanceToMRT) || distanceToMRT < 0 || distanceToMRT > 50) {
        errors.push('Distance to MRT must be between 0 and 50 km');
    }
    
    // Number of stores validation
    const numberOfStores = parseInt(formData.numberOfStores);
    if (isNaN(numberOfStores) || numberOfStores < 0 || numberOfStores > 20) {
        errors.push('Number of stores must be between 0 and 20');
    }
    
    // Latitude validation
    const latitude = parseFloat(formData.latitude);
    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
        errors.push('Latitude must be between -90 and 90');
    }
    
    // Longitude validation
    const longitude = parseFloat(formData.longitude);
    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
        errors.push('Longitude must be between -180 and 180');
    }
    
    // Transaction year validation
    const transactionYear = parseInt(formData.transactionYear);
    const currentYear = new Date().getFullYear();
    if (isNaN(transactionYear) || transactionYear < 2000 || transactionYear > currentYear) {
        errors.push(`Transaction year must be between 2000 and ${currentYear}`);
    }
    
    // Transaction month validation
    const transactionMonth = parseInt(formData.transactionMonth);
    if (isNaN(transactionMonth) || transactionMonth < 1 || transactionMonth > 12) {
        errors.push('Please select a valid transaction month');
    }
    
    return errors;
}

// Show notification
function showNotification(message, type = 'error') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    `;
    
    if (type === 'error') {
        notification.style.background = '#ef4444';
    } else if (type === 'success') {
        notification.style.background = '#10b981';
    } else {
        notification.style.background = '#3b82f6';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Animate number counting
function animateNumber(element, start, end, duration = 1000) {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (difference * easeOutQuart);
        
        element.textContent = formatNumber(Math.floor(current));
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Handle form submission
predictionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(predictionForm);
    const data = Object.fromEntries(formData.entries());
    
    // Validate form
    const errors = validateForm(data);
    if (errors.length > 0) {
        showNotification(errors.join('. '), 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = predictionForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    
    // Hide previous results
    predictionResult.style.display = 'none';
    
    try {
        // Prepare data for API
        const apiData = {
            house_age: parseFloat(data.houseAge),
            distance_to_mrt: parseFloat(data.distanceToMRT),
            number_of_stores: parseInt(data.numberOfStores),
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            transaction_year: parseInt(data.transactionYear),
            transaction_month: parseInt(data.transactionMonth)
        };
        
        // Make API request
        const response = await fetch('http://127.0.0.1:8000/predict/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Display result
        const price = Math.round(result.predicted_price || result.price || 0);
        predictionResult.style.display = 'block';
        
        // Animate the price number
        animateNumber(predictedPrice, 0, price, 1500);
        
        // Scroll to result
        setTimeout(() => {
            predictionResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        
        showNotification('Price prediction generated successfully!', 'success');
        
    } catch (error) {
        console.error('Error:', error);
        
        // Show error message
        let errorMessage = 'Failed to get price prediction. ';
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage += 'Please ensure the prediction server is running on http://127.0.0.1:8000/';
        } else if (error.message.includes('HTTP error')) {
            errorMessage += 'Server returned an error. Please check your input data.';
        } else {
            errorMessage += 'Please try again later.';
        }
        
        showNotification(errorMessage, 'error');
        
        // For demo purposes, show a mock result if API is not available
        setTimeout(() => {
            const mockPrice = Math.floor(Math.random() * 500000) + 300000;
            predictionResult.style.display = 'block';
            animateNumber(predictedPrice, 0, mockPrice, 1500);
            
            // Add demo notice
            const resultContent = predictionResult.querySelector('.result-content');
            let demoNotice = resultContent.querySelector('.demo-notice');
            if (!demoNotice) {
                demoNotice = document.createElement('p');
                demoNotice.className = 'demo-notice';
                demoNotice.style.cssText = `
                    background: rgba(255, 255, 255, 0.1);
                    padding: 0.75rem;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    margin-top: 1rem;
                `;
                demoNotice.textContent = 'Demo Mode: This is a simulated prediction. Connect to the actual API for real predictions.';
                resultContent.appendChild(demoNotice);
            }
            
            predictionResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 2000);
        
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
});

// Add some sample data for quick testing
function fillSampleData() {
    const sampleData = {
        houseAge: 5,
        distanceToMRT: 0.8,
        numberOfStores: 7,
        latitude: 25.0330,
        longitude: 121.5654,
        transactionYear: 2023,
        transactionMonth: 6
    };
    
    Object.keys(sampleData).forEach(key => {
        const input = document.getElementById(key);
        if (input) {
            input.value = sampleData[key];
        }
    });
}

// Add sample data button (for development/demo purposes)
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('predictionForm');
    const sampleButton = document.createElement('button');
    sampleButton.type = 'button';
    sampleButton.textContent = 'Fill Sample Data';
    sampleButton.className = 'btn btn-secondary';
    sampleButton.style.marginRight = '1rem';
    sampleButton.onclick = fillSampleData;
    
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.parentNode.insertBefore(sampleButton, submitButton);
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to listing cards
    document.querySelectorAll('.listing-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Add click effects to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Console welcome message
console.log('%c🏠 EstatePredict', 'font-size: 20px; color: #2563eb; font-weight: bold;');
console.log('%cWelcome to EstatePredict! This demo showcases AI-powered real estate predictions.', 'font-size: 14px; color: #666;');
console.log('%cFor the prediction feature to work, ensure your backend server is running on http://127.0.0.1:8000/', 'font-size: 12px; color: #999;');