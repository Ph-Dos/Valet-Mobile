import { storage, db } from "@/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

export interface UploadInfo {
    isUploading: boolean;
    total: number;
    sent: number;
}

// You can use general names when the import gives the interface context.

export interface ObjectData {
    phoneNumber?: string;
    vehicleDetails?: {
        plate?: string,
        brand?: string,
        model?: string,
        bodyStyle?: number,
        color?: string
    };
    locationDetails?: {
        lot?: string,
        floor?: number,
        space?: number,
    };
    URLs?: string[];
}

export class AdmisObj {
    data: ObjectData;
    private uploadInfo: UploadInfo = { isUploading: false, total: 0, sent: 0 };
    private setuploadInfo = () => { };


    constructor(phoneNumber?: string) {
        if (phoneNumber) {
            this.data = { phoneNumber: phoneNumber, vehicleDetails: {}, locationDetails: {} };
        } else {
            this.data = {};
        }
    }

    /**
     * Firebase methods
     */
    public async upload<T extends UploadInfo>(uploadInfo?: T, setUploadInfo?: () => void, URIs?: string[],) {
        try {
            if (uploadInfo && setUploadInfo && URIs) {
                this.uploadInfo = uploadInfo;
                this.setuploadInfo = setUploadInfo;
                this.data.URLs = await this.uploadURIs(URIs);
            }
            this.saveRecord();
            if (uploadInfo && setUploadInfo && URIs) {
                this.uploadInfo.isUploading = false;
                this.setuploadInfo();
            }
            return true;
        } catch (e) {
            console.log(e);
        }
    }

    private async saveRecord() {
        try {
            if (this.data.phoneNumber) {
                const docRef = await addDoc(collection(db, "admissionObjects"), this.data)
                console.log(`Saved doc: ${docRef.id}`);
            }
        } catch (e) {
            console.log(e);
        }
    }

    private async uploadURIs(URIs: string[]) {
        this.uploadInfo.isUploading = true;
        this.setuploadInfo();
        const downloadPromises = URIs.map(async (URI: string, index: number) => {
            return this.uploadIndividual(URI, index);
        });
        return Promise.all(downloadPromises);
    }

    private async uploadIndividual(URI: string, index: number) {
        this.uploadInfo.total += 1;
        this.setuploadInfo();
        const response = await fetch(URI);
        const blob = await response.blob();
        const storageRef = ref(storage, "Test/" + new Date().getTime() + index);
        const uploadTask = uploadBytesResumable(storageRef, blob);
        await uploadTask;
        this.uploadInfo.sent += 1;
        this.setuploadInfo();
        return await getDownloadURL(uploadTask.snapshot.ref);
    }

    /**
     * vehicleDetails methods
     */
    public setPlate(plate: string | undefined) {
        if (this.data.vehicleDetails) {
            this.data.vehicleDetails.plate = plate;
        }
    }
    public setBrand(brand: string | undefined) {
        if (this.data.vehicleDetails) {
            this.data.vehicleDetails.brand = brand;
        }
    }
    public setModel(model: string | undefined) {
        if (this.data.vehicleDetails) {
            this.data.vehicleDetails.model = model;
        }
    }
    public setColor(color: string | undefined) {
        if (this.data.vehicleDetails) {
            this.data.vehicleDetails.color = color;
        }
    }

    /**
     * locationDetails methods
     */
    public setLot(lot: string | undefined) {
        if (this.data.locationDetails) {
            this.data.locationDetails.lot = lot;
        }
    }

}
