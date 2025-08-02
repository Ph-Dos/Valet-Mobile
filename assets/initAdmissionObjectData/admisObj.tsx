import { getInfoAsync, readDirectoryAsync } from "expo-file-system";
import { storage, db } from "@/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, onSnapshot } from "firebase/firestore";

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
    public async upload(dirName?: string, URIs?: Array<string>) {
        try {
            if (dirName && URIs) {
                await this.uploadUnstructData(dirName, URIs);
            }
            return true;
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    private async uploadUnstructData(dirName: string, URIs: Array<string>) {
        const dir = await getInfoAsync(dirName);
        if (!dir.exists) {
            throw Error("Null image directory.");
        }
        const dirInfo = await readDirectoryAsync(dirName);
        if (dirInfo.length !== URIs.length) {
            throw Error("file count does not match current image count.");
        }
        const downloadPromises = URIs.map(async (URI: string) => {
            return this.uploadIndividual(URI);
        });
        const downloadUrls = await Promise.all(downloadPromises);
        console.log(downloadUrls);
    }

    private async uploadIndividual(URI: string) {
        const response = await fetch(URI);
        const blob = await response.blob();
        const storageRef = ref(storage, "Test/" + new Date().getTime());
        const uploadTask = uploadBytesResumable(storageRef, blob);

        // Show state
        // uploadTask.on(
        //     "state_changed",
        //     ((error) => {
        //         console.log(error);
        //     }),
        //     (() => {
        //         getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
        //             return downloadUrl;
        //         })
        //     })
        // )
        await uploadTask;
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
