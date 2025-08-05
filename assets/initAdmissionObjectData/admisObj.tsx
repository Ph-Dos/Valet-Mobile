import { getInfoAsync, readDirectoryAsync } from "expo-file-system";
import { storage, db } from "@/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

export interface UploadInfo {
    isUploading: boolean;
    total: number;
    sent: number;
}

interface Data {
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
    URLs?: Array<string>;
}

export class AdmisObj {
    data: Data;
    private uploadInfo: UploadInfo = { isUploading: false, total: 0, sent: 0 };
    private setuploadInfo = () => { return; };


    constructor(phoneNumber?: string) {
        this.data = { phoneNumber: phoneNumber, vehicleDetails: {}, locationDetails: {} }
    }

    /**
     * Firebase methods
     */
    public async upload<T extends UploadInfo>(uploadInfo: T, setUploadInfo: () => void, dirName?: string, URIs?: Array<string>,) {
        this.uploadInfo = uploadInfo;
        this.setuploadInfo = setUploadInfo;
        try {
            if (dirName && URIs) {
                this.data.URLs = await this.uploadURIs(dirName, URIs);
            }
            this.saveRecord();
            return true;
        } catch (e) {
            console.log(e);
        } finally {
            this.uploadInfo.isUploading = false;
            this.setuploadInfo();
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

    private async uploadURIs(dirName: string, URIs: Array<string>) {
        const dir = await getInfoAsync(dirName);
        if (!dir.exists) {
            return [];
        }
        const dirInfo = await readDirectoryAsync(dirName);
        if (dirInfo.length !== URIs.length) {
            throw Error("file count does not match current URI count.");
        }
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
    public setPlate(plate: string) {
        this.data.vehicleDetails.plate = plate;
    }
    public setBrand(brand: string) {
        this.data.vehicleDetails.brand = brand;
    }

    /**
     * locationDetails methods
     */
    public setLot(lot: string) {
        this.data.locationDetails.lot = lot;
    }

}
