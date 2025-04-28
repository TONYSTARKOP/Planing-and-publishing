const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const tabButtons = document.querySelectorAll('.tab-btn');
const logoutBtn = document.getElementById('logout-btn');
const googleLoginBtn = document.querySelector('.btn-google');

if (loginForm) loginForm.addEventListener('submit', handleLogin);
if (signupForm) signupForm.addEventListener('submit', handleSignup);
if (tabButtons) tabButtons.forEach(btn => btn.addEventListener('click', handleTabChange));
if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
if (googleLoginBtn) googleLoginBtn.addEventListener('click', handleGoogleLogin);

function handleTabChange(event) {
    const tab = event.currentTarget.getAttribute('data-tab');
    
    tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });
    
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.toggle('active', form.id === `${tab}-form`);
    });
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        showLoading();
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        currentUser = data.user;
        showApp();
        loadNotes();
        
        showToast('Welcome back!', 'success');
    } catch (error) {
        console.error('Error logging in:', error);
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    try {
        showLoading();
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name
                }
            }
        });
        
        if (error) throw error;
        
        showToast('Account created successfully! Please check your email for verification.', 'success');
        
        document.querySelector('.tab-btn[data-tab="login"]').click();
        document.getElementById('login-email').value = email;
        
    } catch (error) {
        console.error('Error signing up:', error);
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function handleGoogleLogin() {
    try {
        showLoading();
        
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        
        if (error) throw error;
        
    } catch (error) {
        console.error('Error with Google login:', error);
        showToast(error.message, 'error');
        hideLoading();
    }
}

async function handleLogout() {
    try {
        showLoading();
        
        const { error } = await supabase.auth.signOut();
        
        if (error) throw error;
        
        currentUser = null;
        showAuth();
        
        showToast('Logged out successfully', 'success');
    } catch (error) {
        console.error('Error logging out:', error);
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}