import { Modal, View, SafeAreaView, Pressable, Text, TextInput, Keyboard } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useContext, useEffect, useRef, useState } from "react";
import { Uploading } from "./Uploading";
import { UploadInfo } from "./AdmissionObject";
import { InitImageSet } from "./InitImageSet";
import { Brands } from "./staticData/carBrands.json"
import { Lots } from "./staticData/devLotData.json"
import { InitAdmisObjTB } from "./AdmissionObjectTextBox";
import { SimpleButton } from "../common/SimpleButton";
import { URIsContext } from '../context/ImageURIContext';
import { Colors } from "./staticData/colors.json";
import { ObjectContext } from "../context/AdmissionObjectContext";
import { DependentTB } from "./DependentTextBox";
import { Models } from "./staticData/models.json";

interface Props {
    modalVisible: boolean;
    setModalVisible: (state: boolean) => void;
    testID?: string;
}

export function InitAdmisObjModal({ modalVisible, setModalVisible, testID }: Props) {
    const contextURIs = useContext(URIsContext);
    if (contextURIs === undefined) {
        throw Error("Context API has failed to provide ImageURI context.");
    }
    const contextObject = useContext(ObjectContext);
    if (contextObject === undefined) {
        throw Error("Context API has failed to provide AdmissiobObject context.");
    }
    const { admisObj, setAdmisObj } = contextObject;
    const { imageURIs } = contextURIs;
    const [uploadInfo, setUploadInfo] = useState<UploadInfo>({ isUploading: false, total: 0, sent: 0 });
    const [plate, setPlate] = useState<string | undefined>(undefined);
    const requiredValues = [useRef(false), useRef(false)];

    // NO GENERALIZING YOU TARD, MAKE IT WORK FIRST.

    function handleDissmiss() {
        requiredValues[0].current = false;
        requiredValues[1].current = false;
        plate && setPlate(undefined);
    }

    async function handleUpload() {
        setInput(plate, (plate: string) => { admisObj.setPlate(plate) });
        try {
            if (imageURIs.length > 0) {
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
                    imageURIs
                );
                setUploadInfo({ isUploading: false, total: 0, sent: 0 });
            } else {
                await admisObj.upload();
                setModalVisible(false);
            }
        } catch (e) {
            console.log(e);
        }
        console.log(admisObj);
    }

    function setInput(input: any, setter: ((x: any) => void)) {
        setter(input);
        setAdmisObj(admisObj);
    }

    return (
        <SafeAreaView>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                testID={testID}
                onDismiss={handleDissmiss}
            >
                <Pressable
                    onPress={() => { setModalVisible(false); }}
                    style={{ height: 100 }}
                />
                <Pressable
                    onPress={Keyboard.dismiss}
                    className="flex-1 bg-[#2A2A2A] rounded-t-2xl"
                >
                    <Pressable
                        onPress={() => { setModalVisible(false); }}
                        className="items-end p-3 pr-5 self-end"
                        style={{ height: 50, width: 70 }}
                    >
                        <MaterialCommunityIcons name="window-close" size={30} color="white" />
                    </Pressable>
                    <View className="flex-1 pl-6 gap-5">
                        <Uploading
                            onDismiss={() => { setModalVisible(false); }} // Once animation is done then close outer modal.
                            visible={uploadInfo.isUploading}
                            prog={uploadInfo.total ? uploadInfo.sent / uploadInfo.total * 100 : 0}
                        />
                        <Text className="font-bold text-[#8D949D] text-2xl ">Vehicle Details</Text>
                        <TextInput
                            value={plate}
                            onChangeText={(text: string) => { setPlate(text); }}
                            autoCapitalize="characters"
                            className="bg-[#181818] rounded-xl text-white text-xl pl-4"
                            style={{ width: 370, height: 40 }}
                            returnKeyType={"done"}
                            placeholder={"License plate"}
                        />
                        <InitAdmisObjTB
                            data={Brands}
                            setData={(brand) => { setInput(brand, (input: string | undefined) => { admisObj.setBrand(input); }) }}
                            required={requiredValues[0]}
                            placeholder={"Brand"}
                        />
                        <DependentTB
                            data={Models}
                            setData={(model) => { setInput(model, (input: string | undefined) => { admisObj.setModel(input); }) }}
                            placeholder={"Model"}
                        />
                        <InitAdmisObjTB
                            data={Colors}
                            setData={(color) => { setInput(color, (input: string | undefined) => { admisObj.setColor(input); }) }}
                            required={requiredValues[1]}
                            placeholder={"Color"}
                        />
                        <Text className="font-bold text-[#8D949D] text-2xl ">Location Details</Text>
                        <InitAdmisObjTB
                            data={Lots}
                            setData={(lot) => { setInput(lot, (input: string | undefined) => { admisObj.setLot(input); }) }}
                            placeholder={"Lot"}
                        />
                        <InitImageSet modalVisible={modalVisible} />
                    </View>
                    <View className="self-center pb-10">
                        <SimpleButton
                            onPress={() => { handleUpload(); }}
                            title={"Done"}
                        />
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}
