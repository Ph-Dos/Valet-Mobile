import { createContext, ReactNode, useState } from "react";

interface Props {
    children: ReactNode;
}

export const URIsContext = createContext<ContextValues | undefined>(undefined);
interface ContextValues {
    imageURIs: Array<string>;
    setImageURIs: React.Dispatch<React.SetStateAction<string[]>>;
}

export function ImageURIContext({ children }: Props) {
    const [imageURIs, setImageURIs] = useState<string[]>([]);

    return <URIsContext value={{ imageURIs, setImageURIs }}>{children}</URIsContext>
}
