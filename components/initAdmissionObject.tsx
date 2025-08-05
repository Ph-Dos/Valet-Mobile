import { Modal, View, SafeAreaView, Pressable, Text, TextInput } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { InitAdmisObjTB } from "@/components/initAdmissionObjectTextBox";
import { basicTBData } from "@/assets/initAdmissionObjectData/initAdmisObjTBData";
import { Brands } from "@/assets/initAdmissionObjectData/carBrands.json";
import { Lots } from "@/assets/initAdmissionObjectData/devLotData.json";
import { AdmisObj, UploadInfo } from "@/assets/initAdmissionObjectData/admisObj";
import { InitImageSet } from "@/components/initImageSet";
import { cacheDirectory } from "expo-file-system";
import { useState } from "react";
import { Uploading } from "./uploading";

interface Props {
    admisObj: AdmisObj;
    modalVisible: boolean;
    setModalVisible: (state: boolean) => void;
}
const imageDir = cacheDirectory + 'images/';

export function InitAdmisObjModal({ admisObj, modalVisible, setModalVisible }: Props) {

    const [activeId, setActiveId] = useState(0);
    const [imageURIs, setImageURIs] = useState<Array<string>>([]);
    const [uploadInfo, setUploadInfo] = useState<UploadInfo>({ isUploading: false, total: 0, sent: 0 });

    // NO GENERALIZING YOU TARD, MAKE IT WORK FIRST.

    async function handleUpload() {
        try {
            await admisObj.upload(
                uploadInfo,
                (() => {
                    setUploadInfo({
                        isUploading: uploadInfo.isUploading,
                        total: uploadInfo.total,
                        sent: uploadInfo.sent
                    });
                }),
                imageDir,
                imageURIs
            );
        } catch (e) {
            console.log(e);
        }
        setUploadInfo({ isUploading: false, total: 0, sent: 0 });
        if (modalVisible) {
            setModalVisible(false);
        }
    }

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
                <View className="flex-1 bg-[#2A2A2A] rounded-t-2xl" >
                    <Pressable
                        onPress={() => { setModalVisible(false); }}
                        className="items-end p-3 pr-5 self-end"
                        style={{ height: 50, width: 70 }}
                    >
                        <MaterialCommunityIcons name="window-close" size={30} color="white" />
                    </Pressable>
                    <View className="flex-1 pl-5 gap-5">
                        <Uploading
                            onDismiss={() => { setModalVisible(false); }}
                            visible={uploadInfo.isUploading}
                            prog={uploadInfo.total ? uploadInfo.sent / uploadInfo.total * 100 : 0}
                        />
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
                            setData={(brand) => { admisObj.setBrand(brand); }}
                            activeId={activeId}
                            placeholder="Brand"
                        />
                        <Text className="font-bold text-[#8D949D] text-2xl ">Location Details</Text>
                        <InitAdmisObjTB<basicTBData>
                            data={Lots}
                            id={2}
                            setActiveId={setActiveId}
                            setData={(lot) => { admisObj.setLot(lot); }}
                            activeId={activeId}
                            placeholder="Lot"
                        />
                        <InitImageSet
                            modalVisible={modalVisible}
                            imageDir={imageDir}
                            imageURIs={imageURIs}
                            setImageURIs={(updatedURIs: Array<string>) => { setImageURIs(updatedURIs); }}
                        />
                        <Pressable
                            onPress={() => { handleUpload(); }}
                            className="pt-10"
                        >
                            <View
                                className="bg-blue-400 rounded-2xl justify-center items-center"
                                style={{ width: 360, height: 50 }}
                            >
                                <Text className="font-semibold text-xl text-[#1F1F1F]">Done</Text>
                            </View>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
