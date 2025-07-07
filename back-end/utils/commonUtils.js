const normalizePhone = (phone) => {
    phone = String(phone);
    phone = phone.replace(/\D/g, ''); // Remove non-digit characters
    if (phone.length === 10) {
        return '91' + phone;
    }
    if (phone.startsWith('91') && phone.length === 12) {
        return phone;
    }
    throw new Error('Invalid phone number');
}

module.exports = normalizePhone;