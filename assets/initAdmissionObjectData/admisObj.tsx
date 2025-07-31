import { getInfoAsync, readDirectoryAsync } from "expo-file-system";
import { storage, db } from "@/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { PathPair } from "@/components/initImageSet";

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
    public async upload(imageDir: string, images: Array<PathPair>) {
        const dir = await getInfoAsync(imageDir);
        if (!dir.exists) {
            throw Error("Null image directory.");
        }
        const dirInfo = await readDirectoryAsync(imageDir);
        if (dirInfo.length !== images.length) {
            throw Error("file count does not match current image count.");
        }

        images.forEach(async (uri: PathPair, index: number) => {
            const response = await fetch(uri[0]);
            const blob = await response.blob();
            const storageRef = ref(storage, "Test/" + uri[1].split(/images\/|.jpg/).at(-2));
            const uploadTask = uploadBytesResumable(storageRef, blob);

            // Show state
            uploadTask.on(
                "state_changed",
                ((snapshot) => {
                    const prog = (snapshot.bytesTransferred / snapshot.totalBytes * 100);
                    console.log(`Image ${index + 1} of ${images.length}: ${prog.toPrecision(4)}% done.`);
                }),
                ((error) => {
                    console.log(error);
                }),
                (() => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
                        console.log(`File saved at: ${downloadUrl}`);
                    })
                })
            )
        });
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
