export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validateUsername = (username) => {
    // Length min 3, alphanumeric + underscore
    const re = /^[a-zA-Z0-9_]+$/;
    return username.length >= 3 && re.test(username);
};

export const validatePassword = (password) => {
    return password.length >= 6;
};

export const validateFullName = (fullName) => {
    return fullName.length >= 2;
};

export const validatePhoneNumber = (phone) => {
    if (!phone) return true; // Optional
    const re = /^[0-9]{10,11}$/;
    return re.test(phone);
};

export const validateOtp = (otp) => {
    const re = /^[0-9]{6}$/;
    return re.test(otp);
};
