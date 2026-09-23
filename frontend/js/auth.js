/**
 * NyBasket – Authentication Controller (Login & Register)
 */

document.addEventListener('DOMContentLoaded', () => {
    initLoginForm();
    initRegisterForm();
    initDemoCredentials();
});

function initLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            showToast('Please enter both email and password.', 'warning');
            return;
        }

        const submitBtn = document.getElementById('login-submit-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Authenticating...`;
        }

        try {
            const res = await API.post('/api/auth/login', { email, password });
            if (res.success && res.user) {
                localStorage.setItem('nybasket_user', JSON.stringify(res.user));
                showToast(`Welcome, ${res.user.name}!`, 'success');

                setTimeout(() => {
                    if (res.user.role === 'admin') {
                        window.location.href = 'dashboard.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 700);
            }
        } catch (error) {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `Sign In`;
            }
        }
    });
}

function initRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        if (!name || !email || !password) {
            showToast('All fields are required.', 'warning');
            return;
        }

        if (password !== confirmPassword) {
            showToast('Passwords do not match.', 'error');
            return;
        }

        if (password.length < 6) {
            showToast('Password must be at least 6 characters.', 'warning');
            return;
        }

        const submitBtn = document.getElementById('register-submit-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Creating Account...`;
        }

        try {
            const res = await API.post('/api/auth/register', {
                name,
                email,
                password,
                confirm_password: confirmPassword
            });

            if (res.success && res.user) {
                localStorage.setItem('nybasket_user', JSON.stringify(res.user));
                showToast('Registration successful! Redirecting...', 'success');
                setTimeout(() => window.location.href = 'index.html', 800);
            }
        } catch (error) {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `Create Account`;
            }
        }
    });
}

function initDemoCredentials() {
    const adminBtn = document.getElementById('fill-admin-btn');
    const customerBtn = document.getElementById('fill-customer-btn');

    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            const email = document.getElementById('login-email');
            const pass = document.getElementById('login-password');
            if (email && pass) {
                email.value = 'admin@nybasket.com';
                pass.value = 'admin123';
                showToast('Filled Admin credentials', 'info');
            }
        });
    }

    if (customerBtn) {
        customerBtn.addEventListener('click', () => {
            const email = document.getElementById('login-email');
            const pass = document.getElementById('login-password');
            if (email && pass) {
                email.value = 'demo@nybasket.com';
                pass.value = 'customer123';
                showToast('Filled Customer credentials', 'info');
            }
        });
    }
}
