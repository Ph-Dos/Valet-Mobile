import { Modal, View, SafeAreaView, Pressable, Text, TextInput } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { InitAdmisObjTB } from "./initAdmissionObjectTextBox";
import { useState } from "react";
import { basicTBData } from "@/assets/initAdmissionObjectData/initAdmisObjTBData";
import { Brands } from "@/assets/initAdmissionObjectData/carBrands.json";
import { Lots } from "@/assets/initAdmissionObjectData/devLotData.json";

interface Props {
    modalVisible: boolean;
    setModalVisible: (state: boolean) => void;
}

/**
*
 */

export function InitAdmisObjModal({ modalVisible, setModalVisible }: Props) {

    const [activeId, setActiveId] = useState(0);

    return (
        <SafeAreaView>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}

            >
                <Pressable
                    onPress={() => { setModalVisible(false); }}
                    style={{ height: 100 }}
                />
                <View className="flex-1 bg-[#2A2A2A]" >
                    <Pressable
                        onPress={() => { setModalVisible(false); }}
                        className="items-end p-3 pr-5 self-end"
                        style={{ height: 50, width: 70 }}
                    >
                        <MaterialCommunityIcons name="window-close" size={30} color="white" />
                    </Pressable>
                    <View className="flex-1 pl-5 gap-5">
                        <Text className="font-bold text-[#8D949D] text-2xl ">Vehicle Details</Text>
                        <TextInput
                            onPress={() => { setActiveId(0); }}
                            autoCapitalize="characters"
                            className="bg-[#181818] rounded-xl text-white text-xl pl-4"
                            style={{ width: 370, height: 40 }}
                            returnKeyType="done"
                            placeholder="License plate"
                        />
                        <InitAdmisObjTB<basicTBData>
                            data={Brands}
                            id={1}
                            setActiveId={setActiveId}
                            activeId={activeId}
                            placeholder="Brand"
                        />
                        <Text className="font-bold text-[#8D949D] text-2xl ">Location Details</Text>
                        <InitAdmisObjTB<basicTBData>
                            data={Lots}
                            id={2}
                            setActiveId={setActiveId}
                            activeId={activeId}
                            placeholder="Lot"
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
