import { getInfoAsync, readDirectoryAsync } from "expo-file-system";

export class AdmisObj {
    initTime: string;
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
        this.initTime = new Date().getTime().toString();
        this.phoneNumber = phoneNumber;
        this.vehicleDetails = {};
        this.locationDetails = {};
    }

    /**
     * Firebase methods
     */
    public async upload(imageDir: string, imageCount: number) {
        const dir = await getInfoAsync(imageDir);
        if (!dir.exists) {
            throw Error("Null image directory.");
        }
        const dirInfo = await readDirectoryAsync(imageDir);
        if (dirInfo.length !== imageCount) {
            throw Error("file count does not match current image count.");
        }
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
