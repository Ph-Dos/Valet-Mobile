import { Modal, View, SafeAreaView, Pressable, Text, TextInput } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { cacheDirectory } from "expo-file-system";
import { useState } from "react";
import { Uploading } from "./Uploading";
import { AdmisObj, UploadInfo } from "./AdmissionObject";
import { InitImageSet } from "./InitImageSet";
import { Brands } from "./staticData/carBrands.json"
import { Lots } from "./staticData/devLotData.json"
import { InitAdmisObjTB, basicTBData } from "./AdmissionObjectTextBox";
import { SimpleButton } from "../common/SimpleButton";

interface Props {
    admisObj: AdmisObj;
    modalVisible: boolean;
    setModalVisible: (state: boolean) => void;
    testID?: string;
}
const imageDir = cacheDirectory + 'images/';

export function InitAdmisObjModal({
    admisObj,
    modalVisible,
    setModalVisible,
    testID,
}: Props) {

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
                    console.log(uploadInfo.isUploading);
                }),
                imageDir,
                imageURIs
            );
        } catch (e) {
            console.log(e);
        }
        // If no images where sent then it was just a record log and don't need to wait for
        // image download animation to finish playin to close outer modal.
        if (uploadInfo.sent === 0 && modalVisible) {
            setModalVisible(false);
        }
        setUploadInfo({ isUploading: false, total: 0, sent: 0 });
    }

    return (
        <SafeAreaView>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                testID={testID}
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
                            onDismiss={() => { setModalVisible(false); }} // Once animation is done then close outer modal.
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
                    </View>
                    <View className="self-center pb-10">
                        <SimpleButton
                            onPress={() => { handleUpload(); }}
                            title={"Done"}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
