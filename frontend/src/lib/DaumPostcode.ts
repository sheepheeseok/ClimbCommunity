declare global {
    interface Window {
        daum: any;
    }
}

export function DaumPostcode(callback: (address: string) => void) {
    new window.daum.Postcode({
        oncomplete: function (data: any) {
            const fullAddress = data.address;
            callback(fullAddress);
        },
    }).open();
}
