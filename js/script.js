document.addEventListener('DOMContentLoaded', () => {
    // Set dynamic current year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Interactive Toast trigger (optional utility for copying text)
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    function showToast(message) {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // Add optional copy on right click/long press for email/whatsapp
    const emailBtn = document.getElementById('email-btn');
    if (emailBtn) {
        emailBtn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText('thanzero@gmail.com').then(() => {
                showToast('Email copied to clipboard!');
            });
        });
    }

    const phoneBtn = document.getElementById('phone-btn');
    if (phoneBtn) {
        phoneBtn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText('085198197271').then(() => {
                showToast('Phone number copied to clipboard!');
            });
        });
    }
});
