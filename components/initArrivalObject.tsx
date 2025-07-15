import { Modal, View, SafeAreaView, Pressable, Text, TextInput } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { InitAObjTB } from "./initArrivalObjectTextBox";

interface Props {
    modalVisible: boolean;
    setModalVisible: (state: boolean) => void;
}

/**
 *
 * You need to add gesters to modal,
 *  1. Sliding down will clase the modal
 *
 */

export function InitAObjModal({ modalVisible, setModalVisible }: Props) {
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
                        style={{ height: 50, width: 70 }}
                        className="items-end p-3 pr-5 self-end"
                    >
                        <MaterialCommunityIcons name="window-close" size={30} color="white" />
                    </Pressable>
                    <View className="flex-1 pl-5 gap-6">
                        <Text className="font-bold text-[#8D949D] text-2xl ">Vehicle Details</Text>
                        <TextInput
                            style={{ width: 370, height: 40 }}
                            className="bg-[#181818] rounded-xl text-white text-xl pl-4"
                            autoCapitalize="characters"
                            returnKeyType="done"
                            placeholder="License plate"
                        />
                        <InitAObjTB placeHolder="Brand" />
                        <InitAObjTB placeHolder="Class" />
                        <InitAObjTB placeHolder="Color" />
                        <Text className="font-bold text-[#8D949D] text-2xl ">Location Details</Text>
                        <InitAObjTB placeHolder="Lot" />
                        <InitAObjTB placeHolder="Floor" />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
