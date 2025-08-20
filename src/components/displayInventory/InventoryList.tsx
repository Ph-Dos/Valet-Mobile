import { SafeAreaView, Text } from 'react-native';
import { db } from '@/firebaseConfig';
import { collection, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { ObjectData } from '../initAdmissionObject/AdmissionObject';
import { FlatList } from "react-native";
import { AdmisObjView } from '../common/AdmissionObjectView';

const DB_PATH = "/admissionObjects";

const DEV_DATA: ObjectData[] = [{
    phoneNumber: "7707707770",
    vehicleDetails: {
        plate: "6Z47DJ1",
        bodyStyle: 0,
        brand: "Honda",
        color: "Red",
    },
    locationDetails: {
        lot: "Some Lot",
        floor: 1,
        space: 35,
    },
}];

export function InventoryList() {

    const [admissionObjects, setAdmissionObjects] = useState<ObjectData[]>([]);
    const focused = useIsFocused();
    const unsubscriber = useRef<Unsubscribe | undefined>(undefined);

    // TODO: Create a proccess that listens to Firestore and pulls all current data.

    function mountDBListener() {
        const collectionRef = collection(db, DB_PATH);
        const callBack = onSnapshot(collectionRef, (snapshot) => {
            if (snapshot.empty) {
                console.log("Nothing to fetch gang.");
                return;
            }
            const fetchedAdmissionObjects = snapshot.docs.map(doc => {
                const object = doc.data() as ObjectData;
                console.log(object.phoneNumber);
                return object;
            });
            setAdmissionObjects(fetchedAdmissionObjects);
        });
        unsubscriber.current = callBack;
    }

    useEffect(() => {
        if (focused && !unsubscriber.current) {
            console.log("Mounting listener...");
            mountDBListener();
        } else if (unsubscriber.current) {
            console.log("Demounting listener...");
            unsubscriber.current();
            unsubscriber.current = undefined;
        }
    }, [focused]);

    return (
        <SafeAreaView>
            <FlatList
                data={admissionObjects}
                renderItem={(({ item }) =>
                    <AdmisObjView object={item} />
                )}
                className="pt-10"
                contentContainerClassName="gap-5"
            />
        </SafeAreaView>
    );
}
