document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('booking-form');
    const messageDiv = document.getElementById('form-message');

    // Simple scroll effect for navbar
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Loading state
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Send data to Formspree
            fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                
                if (response.ok) {
                    messageDiv.textContent = 'Booking request received! We will contact you shortly.';
                    messageDiv.className = 'mt-4 text-center text-sm font-bold p-3 rounded-lg bg-green-100 text-green-800 border border-green-200';
                    form.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            messageDiv.textContent = data.errors.map(error => error.message).join(', ');
                        } else {
                            messageDiv.textContent = 'Oops! There was a problem submitting your form.';
                        }
                        messageDiv.className = 'mt-4 text-center text-sm font-bold p-3 rounded-lg bg-red-100 text-red-800 border border-red-200';
                    }).catch(() => {
                        messageDiv.textContent = 'Oops! There was a problem submitting your form.';
                        messageDiv.className = 'mt-4 text-center text-sm font-bold p-3 rounded-lg bg-red-100 text-red-800 border border-red-200';
                    });
                }

                setTimeout(() => {
                    messageDiv.className = 'hidden';
                }, 5000);
            }).catch(error => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                messageDiv.textContent = 'Oops! There was a problem submitting your form.';
                messageDiv.className = 'mt-4 text-center text-sm font-bold p-3 rounded-lg bg-red-100 text-red-800 border border-red-200';
                
                setTimeout(() => {
                    messageDiv.className = 'hidden';
                }, 5000);
            });
        });
    }

    // Set minimum date for checkin to today
    const today = new Date().toISOString().split('T')[0];
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (checkinInput && checkoutInput) {
        checkinInput.min = today;
        
        checkinInput.addEventListener('change', (e) => {
            checkoutInput.min = e.target.value;
            if (checkoutInput.value && checkoutInput.value < e.target.value) {
                checkoutInput.value = e.target.value;
            }
        });
    }

    // Property Gallery Auto-Scroll Image Cycling
    const galleries = document.querySelectorAll('.image-carousel');
    
    galleries.forEach((gallery, index) => {
        const images = gallery.querySelectorAll('.carousel-img');
        if (images.length <= 1) return;
        
        setTimeout(() => {
            let activeIdx = 0;
            setInterval(() => {
                images[activeIdx].classList.remove('opacity-100');
                images[activeIdx].classList.add('opacity-0');
                activeIdx = (activeIdx + 1) % images.length;
                images[activeIdx].classList.remove('opacity-0');
                images[activeIdx].classList.add('opacity-100');
            }, 3000);
        }, index * 500);
    });

    // Reviews Horizontal Scroll Logic
    const reviewsSlider = document.getElementById('reviews-slider');
    const scrollPrevBtn = document.getElementById('scroll-prev-btn');
    const scrollNextBtn = document.getElementById('scroll-next-btn');

    if (reviewsSlider && scrollPrevBtn && scrollNextBtn) {
        scrollNextBtn.addEventListener('click', () => {
            // Roughly width of one card + gap
            reviewsSlider.scrollBy({ left: 324, behavior: 'smooth' });
        });
        scrollPrevBtn.addEventListener('click', () => {
            reviewsSlider.scrollBy({ left: -324, behavior: 'smooth' });
        });
    }

    // Dark Mode Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        themeToggleBtn.addEventListener('click', function() {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
        });
    }

});
