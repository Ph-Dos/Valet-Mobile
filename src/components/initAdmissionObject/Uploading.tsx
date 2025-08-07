import { Modal } from "react-native";
import { ProgBar } from "./ProgressBar";

interface Props {
    onDismiss: () => void;
    visible: boolean;
    prog: number;
}

export function Uploading({ onDismiss, visible, prog }: Props) {
    return (
        <>
            <Modal
                onDismiss={onDismiss}
                visible={visible}
                transparent={true}
                animationType="fade"
            >
                <ProgBar
                    barWidth={250}
                    prog={prog}
                />
            </Modal>
        </>
    );
}
