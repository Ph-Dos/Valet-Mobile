import { Text } from 'react-native';
import { db } from '@/firebaseConfig';
import { collection, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { ObjectData } from '../initAdmissionObject/AdmissionObject';

const DB_PATH = "/admissionObjects";

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
            console.log("Mounting...");
            mountDBListener();
        } else if (unsubscriber.current) {
            console.log("Demounting Inventory listener...");
            unsubscriber.current();
            unsubscriber.current = undefined;
        }
    }, [focused]);

    return (
        <Text className="font-bold text-white">Hello</Text>
    );
}
