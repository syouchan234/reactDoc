export const initializeLocalStorage = () => {
    const initialCompanyInfo = {
        name: '',
        postcode: '',
        address: '',
        building: '',
        tel: '',
        fax: '',
        email: ''
    };
    
    const initialCustomerInfo = {
        name: '',
        postcode: '',
        address: '',
        department: '',
        manager: '',
        tel: '',
        fax: '',
        email: ''
    };

    // companyInfoが未設定の場合は初期値を設定
    if (!localStorage.getItem('companyInfo')) {
        localStorage.setItem('companyInfo', JSON.stringify(initialCompanyInfo));
    }

    // customerInfoが未設定の場合は初期値を設定
    if (!localStorage.getItem('customerInfo')) {
        localStorage.setItem('customerInfo', JSON.stringify(initialCustomerInfo));
    }
}; 