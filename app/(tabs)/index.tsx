import { AdmissionObjectContext } from "@/src/components/context/AdmissionObjectContext";
import { Receive } from "@/src/screens/Receive";

export default function ReceiveRoute() {
    return (
        <AdmissionObjectContext>
            <Receive />
        </AdmissionObjectContext>
    );
}
