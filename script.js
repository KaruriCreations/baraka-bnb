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
                    messageDiv.className = 'form-message success';
                    form.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            messageDiv.textContent = data.errors.map(error => error.message).join(', ');
                        } else {
                            messageDiv.textContent = 'Oops! There was a problem submitting your form.';
                        }
                        messageDiv.className = 'form-message error';
                    }).catch(() => {
                        messageDiv.textContent = 'Oops! There was a problem submitting your form.';
                        messageDiv.className = 'form-message error';
                    });
                }

                setTimeout(() => {
                    messageDiv.className = 'form-message hidden';
                }, 5000);
            }).catch(error => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                messageDiv.textContent = 'Oops! There was a problem submitting your form.';
                messageDiv.className = 'form-message error';
                
                setTimeout(() => {
                    messageDiv.className = 'form-message hidden';
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
    const galleries = document.querySelectorAll('.property-gallery');
    
    galleries.forEach((gallery, index) => {
        const images = gallery.querySelectorAll('.property-gallery-img');
        if (images.length === 0) return;
        
        // Stagger the start times slightly so they don't all flip at the exact same millisecond
        setTimeout(() => {
            let stateIndex = 0; // 0 = showing description, 1..N = showing images
            const totalStates = images.length + 1;
            
            setInterval(() => {
                stateIndex = (stateIndex + 1) % totalStates;
                
                if (stateIndex === 0) {
                    // Show description (hide gallery)
                    gallery.classList.remove('showing');
                } else {
                    // Show gallery and specific image
                    gallery.classList.add('showing');
                    const imageIndex = stateIndex - 1;
                    
                    images.forEach((img, idx) => {
                        if (idx === imageIndex) {
                            img.classList.add('active');
                        } else {
                            img.classList.remove('active');
                        }
                    });
                }
            }, 2500); // Change state every 2.5 seconds
        }, index * 500); 
    });

    // Reviews Carousel Logic
    const reviewCards = document.querySelectorAll('.review-card');
    const prevReviewBtn = document.getElementById('prev-review');
    const nextReviewBtn = document.getElementById('next-review');
    let currentReviewIndex = 0;

    if (reviewCards.length > 0 && prevReviewBtn && nextReviewBtn) {
        
        function showReview(index) {
            reviewCards.forEach((card, idx) => {
                if (idx === index) {
                    // Quick hack to restart animation: remove and re-add class
                    card.classList.remove('active');
                    void card.offsetWidth; // trigger reflow
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
        }

        nextReviewBtn.addEventListener('click', () => {
            currentReviewIndex = (currentReviewIndex + 1) % reviewCards.length;
            showReview(currentReviewIndex);
        });

        prevReviewBtn.addEventListener('click', () => {
            currentReviewIndex = (currentReviewIndex - 1 + reviewCards.length) % reviewCards.length;
            showReview(currentReviewIndex);
        });
    }

});
