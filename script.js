
let tripData = {
    totalPrice: 0,
    itemCount: 0,
    selectedItems: []
};

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    initRegistration();
    initBlogNavigation();
    initPriceCalculator();
    initConfirmationPage();
}

window.navigateTo = (pageId) => {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        if (pageId === 'page-4') {
            updateConfirmationPage();
        }
    }
};


function initRegistration() {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error-input');
            const errorElement = document.getElementById(this.id + 'Error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        validateAndSubmitForm();
    });
}

function validateAndSubmitForm() {
    let isValid = true;
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const pin = document.getElementById('pin').value.trim();
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const pinInput = document.getElementById('pin');
    
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const pinError = document.getElementById('pinError');
    
    [nameError, emailError, phoneError, pinError].forEach(error => {
        error.style.display = 'none';
    });
    
    [nameInput, emailInput, phoneInput, pinInput].forEach(input => {
        input.classList.remove('error-input');
    });
    
    if (name === '') {
        nameError.style.display = 'flex';
        nameInput.classList.add('error-input');
        isValid = false;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        emailError.style.display = 'flex';
        emailInput.classList.add('error-input');
        isValid = false;
    }
    
    if (!/^\d{10}$/.test(phone)) {
        phoneError.style.display = 'flex';
        phoneInput.classList.add('error-input');
        isValid = false;
    }
    
    if (!/^\d{6}$/.test(pin)) {
        pinError.style.display = 'flex';
        pinInput.classList.add('error-input');
        isValid = false;
    }
    
    if (isValid) {
        showSuccessModal();
        
        setTimeout(() => {
            hideSuccessModal();
            navigateTo('page-2');
        }, 2000);
    }
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'flex';
}

function hideSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
}

function initBlogNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    window.addEventListener('scroll', highlightActiveNavLink);
}

function highlightActiveNavLink() {
    const sections = document.querySelectorAll('.destination-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.background = '';
        link.style.color = '';
        
        if (link.getAttribute('href') === '#' + currentSection) {
            link.style.background = '#F1F5F9';
            link.style.color = '#007BFF';
        }
    });
}

function initPriceCalculator() {
    const allCheckboxes = document.querySelectorAll('.price-checkbox');
    const confirmBtn = document.getElementById('confirmBtn');
    const mobileConfirmBtn = document.getElementById('mobileConfirmBtn');
    const modalNextBtn = document.getElementById('modalNextBtn');
    const confirmationModal = document.getElementById('confirmationModal');

    allCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                const category = this.dataset.category;
                
                allCheckboxes.forEach(otherCheckbox => {
                    if (otherCheckbox !== this && otherCheckbox.dataset.category === category) {
                        otherCheckbox.checked = false;
                    }
                });
            }
            
            calculateTotalPrice();
        });
    });
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', showConfirmationModal);
    }
    
    if (mobileConfirmBtn) {
        mobileConfirmBtn.addEventListener('click', showConfirmationModal);
    }
    
    if (modalNextBtn) {
        modalNextBtn.addEventListener('click', () => {
            hideConfirmationModal();
            navigateTo('page-4');
        });
    }
    
    if (confirmationModal) {
        confirmationModal.addEventListener('click', (e) => {
            if (e.target === confirmationModal) {
                hideConfirmationModal();
            }
        });
    }
    
    calculateTotalPrice();
}

function calculateTotalPrice() {
    const allCheckboxes = document.querySelectorAll('.price-checkbox');
    let total = 0;
    let count = 0;
    const selectedItems = [];
    
    allCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const price = parseFloat(checkbox.dataset.price);
            total += price;
            count++;
            
            const optionCard = checkbox.closest('.option-card');
            const title = optionCard.querySelector('.option-title').textContent;
            selectedItems.push({ title, price });
        }
    });
    

    tripData.totalPrice = total;
    tripData.itemCount = count;
    tripData.selectedItems = selectedItems;
    
    const formattedPrice = `$${total.toFixed(2)}`;
    
    const totalPriceElement = document.getElementById('totalPrice');
    const mobileTotalPriceElement = document.getElementById('mobileTotalPrice');
    const itemCountElement = document.getElementById('itemCount');
    
    if (totalPriceElement) totalPriceElement.textContent = formattedPrice;
    if (mobileTotalPriceElement) mobileTotalPriceElement.textContent = formattedPrice;
    if (itemCountElement) itemCountElement.textContent = count;
}

function showConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    const modalFinalPrice = document.getElementById('modalFinalPrice');
    
    if (modal && modalFinalPrice) {
        modalFinalPrice.textContent = `$${tripData.totalPrice.toFixed(2)}`;
        modal.style.display = 'flex';
    }
}

function hideConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.style.display = 'none';
    }
}


function initConfirmationPage() {
    generateBookingReference();
}

function updateConfirmationPage() {

    const finalTotalPrice = document.getElementById('finalTotalPrice');
    if (finalTotalPrice) {
        finalTotalPrice.textContent = `$${tripData.totalPrice.toFixed(2)}`;
    }
    
    const finalItemCount = document.getElementById('finalItemCount');
    if (finalItemCount) {
        finalItemCount.textContent = `${tripData.itemCount} item${tripData.itemCount !== 1 ? 's' : ''}`;
    }
    
    const bookingDate = document.getElementById('bookingDate');
    if (bookingDate) {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        bookingDate.textContent = formattedDate;
    }
 
    generateBookingReference();
}

function generateBookingReference() {
    const bookingRef = document.getElementById('bookingRef');
    if (bookingRef) {
        const ref = 'VF-' + 
                    Math.random().toString(36).substring(2, 6).toUpperCase() + '-' +
                    Math.random().toString(36).substring(2, 6).toUpperCase();
        bookingRef.textContent = ref;
    }
}


document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        const activeForm = document.querySelector('.page.active form');
        if (activeForm && e.target.form === activeForm) {
            e.preventDefault();
            const submitButton = activeForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.click();
            }
        }
    }
});


window.addEventListener('beforeunload', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
});


console.log('%cVoyageFlow 🌍', 'font-size: 24px; font-weight: bold; color: #667eea;');
console.log('%cInteractive Travel Experience Simulator', 'font-size: 14px; color: #64748B;');
console.log('%cBuilt with HTML, CSS, and JavaScript', 'font-size: 12px; color: #94A3B8;');

