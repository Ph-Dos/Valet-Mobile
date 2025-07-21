export interface AdmisObj {
    phoneNumber: string
    vehicleDetails: {
        plate?: string,
        brand?: string,
        bodyStyle?: number,
        color?: string
    };
    locationDetails: {
        lot?: string,
        floor?: number
    };
}
