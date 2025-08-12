import { AdmisObj } from "@/src/components/initAdmissionObject/AdmissionObject";
import { InitAdmisObjModal } from "@/src/components/initAdmissionObject/InitAdmissionObjectModal";
import { useState } from "react";
import { View, Pressable, Text, TextInput, Keyboard } from "react-native";
import { SimpleButton } from "@/src/components/common/SimpleButton";
import { ImageURIContext, URIsContext } from "../components/context/ImageURIContext";

export function Receive() {

    const [textValue, setTextValue] = useState<undefined | string>(undefined);
    const [modalVisible, setModalVisible] = useState(false);
    const [admisObj, setAdmisObj] = useState(new AdmisObj());

    // This is to test the ability to collect the string in the phone number box.
    const handleTextValue = (): void => {
        setAdmisObj(new AdmisObj(textValue));
        Keyboard.dismiss();
        setModalVisible(true);
        setTextValue(undefined);
    };

    return (
        <Pressable
            onPress={Keyboard.dismiss}
            className="dev-view flex-1 gap-10 "
        >
            <ImageURIContext>
                <InitAdmisObjModal
                    admisObj={admisObj}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    testID={"InitAdmisObjModal"}
                />
            </ImageURIContext>
            <View className="justify-center items-center gap-2">
                <TextInput
                    value={textValue}
                    onChangeText={setTextValue}
                    keyboardType="number-pad"
                    className="bg-[#181818] rounded-xl text-white text-center text-xl"
                    style={{ width: 300, height: 40 }}
                    placeholder="123-456-7890"
                />
                <Text className="text-[#8D949D]">{!textValue ? "Enter guest's mobile number." : ""}</Text>
            </View>
            <SimpleButton
                onPress={() => { textValue && handleTextValue(); }}
                isDisabled={!textValue ? true : false}
                title={"Park"}
                testID={"ParkButton"}
            />
        </Pressable>
    );
}
