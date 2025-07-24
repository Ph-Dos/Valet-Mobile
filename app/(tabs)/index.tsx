import { AdmisObj } from "@/assets/initAdmissionObjectData/admisObj";
import { InitAdmisObjModal } from "@/components/initAdmissionObject";
import { useState } from "react";
import { View, Pressable, Text, TextInput, Keyboard } from "react-native";

export default function Receive() {

    const [textValue, setTextValue] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [admisObj, setAdmisObj] = useState(new AdmisObj());

    // This is to test the ability to collect the string in the phone number box.
    const handleTextValue = (): void => {
        setAdmisObj(new AdmisObj(textValue))
        Keyboard.dismiss()
        setModalVisible(true)
        setTextValue('')
    };

    return (
        <Pressable
            onPress={Keyboard.dismiss}
            className="dev-view flex-1 gap-10 "
        >
            <InitAdmisObjModal
                admisObj={admisObj}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
            <View className="justify-center items-center gap-2">
                <TextInput
                    value={textValue}
                    onChangeText={setTextValue}
                    keyboardType="number-pad"
                    className="bg-[#181818] rounded-md text-white text-center text-xl"
                    style={{ width: 340, height: 45 }}
                    placeholder="123-456-7890"
                />
                <Text className="text-[#8D949D]">Guest's mobile number</Text>
            </View>
            <Pressable onPress={handleTextValue}>
                <View
                    className="bg-blue-400 rounded-2xl justify-center items-center"
                    style={{ width: 360, height: 50 }}
                >
                    <Text className="font-semibold text-xl text-[#1F1F1F]">Park</Text>
                </View>
            </Pressable>
        </Pressable>
    );
}
