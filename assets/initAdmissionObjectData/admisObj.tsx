export class AdmisObj {
    phoneNumber?: string;
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

    constructor(phoneNumber?: string) {
        this.phoneNumber = phoneNumber;
        this.vehicleDetails = {};
        this.locationDetails = {};
    }

    /**
     * vehicleDetails methods
     */
    public setPlate(plate: string) {
        this.vehicleDetails.plate = plate;
    }
    public setBrand(brand: string) {
        this.vehicleDetails.brand = brand;
    }

    /**
     * locationDetails methods
     */
    public setLot(lot: string) {
        this.vehicleDetails.brand = lot;
    }

}
