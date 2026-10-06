const getItemAsync = async (key) => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
};

const setItemAsync = async (key, value) => {
    if (typeof window === 'undefined') {
        throw new Error('Secure storage is only available in the browser.');
    }
    window.localStorage.setItem(key, value);
};

const deleteItemAsync = async (key) => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
};

module.exports = { getItemAsync, setItemAsync, deleteItemAsync };
