import { createContext, ReactNode, useState } from "react";
import { AdmisObj } from "../initAdmissionObject/AdmissionObject";

interface Props {
    children: ReactNode;
}

export const ObjectContext = createContext<ContextValues | undefined>(undefined);
interface ContextValues {
    admisObj: AdmisObj;
    setAdmisObj: React.Dispatch<React.SetStateAction<AdmisObj>>;
}

export function AdmissionObjectContext({ children }: Props) {
    const [admisObj, setAdmisObj] = useState<AdmisObj>(new AdmisObj());

    return <ObjectContext value={{ admisObj, setAdmisObj }}>{children}</ObjectContext>
}
