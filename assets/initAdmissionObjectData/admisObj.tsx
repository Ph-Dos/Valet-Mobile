import { getInfoAsync, readDirectoryAsync } from "expo-file-system";
import { storage, db } from "@/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, onSnapshot } from "firebase/firestore";

export interface UploadInfo {
    isUploading: boolean;
    total: number;
    sent: number;
}
export type SetUploadInfo = <T extends UploadInfo>(x: T) => void;

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
    private uploadInfo: UploadInfo = { isUploading: false, total: 0, sent: 0 };
    private setuploadInfo: SetUploadInfo = ((x: UploadInfo) => { return; })


    constructor(phoneNumber?: string) {
        this.initTime = new Date().getTime().toString();
        this.phoneNumber = phoneNumber;
        this.vehicleDetails = {};
        this.locationDetails = {};
    }

    /**
     * Firebase methods
     */
    public async upload<T extends UploadInfo>(uploadInfo: T, setUploadInfo: SetUploadInfo, dirName?: string, URIs?: Array<string>,) {
        this.uploadInfo = uploadInfo;
        this.setuploadInfo = setUploadInfo;
        try {
            if (dirName && URIs) {
                await this.uploadURIs(dirName, URIs);
            }
            return true;
        } catch (e) {
            console.log(e);
        } finally {
            this.uploadInfo.isUploading = false;
            this.setuploadInfo(this.uploadInfo);
        }
    }

    private async uploadURIs(dirName: string, URIs: Array<string>) {
        const dir = await getInfoAsync(dirName);
        if (!dir.exists) {
            throw Error("Null image directory.");
        }
        const dirInfo = await readDirectoryAsync(dirName);
        if (dirInfo.length !== URIs.length) {
            throw Error("file count does not match current URI count.");
        }
        this.uploadInfo.isUploading = true;
        this.setuploadInfo(this.uploadInfo);
        const downloadPromises = URIs.map(async (URI: string, index: number) => {
            return this.uploadIndividual(URI, index);
        });
        const downloadURLs = await Promise.all(downloadPromises);
        console.log(downloadURLs);
    }

    private async uploadIndividual(URI: string, index: number) {
        this.uploadInfo.total += 1;
        this.setuploadInfo(this.uploadInfo);
        const response = await fetch(URI);
        const blob = await response.blob();
        const storageRef = ref(storage, "Test/" + new Date().getTime() + index);
        const uploadTask = uploadBytesResumable(storageRef, blob);
        await uploadTask;
        this.uploadInfo.sent += 1;
        this.setuploadInfo(this.uploadInfo);
        return await getDownloadURL(uploadTask.snapshot.ref);
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
