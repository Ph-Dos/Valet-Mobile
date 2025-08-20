import { Modal, View, SafeAreaView, Pressable, Text, TextInput, Keyboard, ScrollView, FlatList } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useContext, useState } from "react";
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
import { StringInputTB } from "./StringInputTextBox";

interface Props {
    modalVisible: boolean;
    setModalVisible: (state: boolean) => void;
    testID?: string;
}

const FLOOR_MAX = 8;
const SPACE_MAX = 100;

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
    const [filledOut, setFilledOut] = useState<[boolean, boolean, boolean, boolean, boolean, boolean]>([
        false,
        false,
        false,
        false,
        false,
        false,
    ]);

    // NO GENERALIZING YOU TARD, MAKE IT WORK FIRST.

    async function handleUpload() {
        // plate && setInput(plate, (plate: string) => { admisObj.setPlate(plate) });
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

    function handleDismiss() {
        setFilledOut([false, false, false, false, false, false]);
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
                onDismiss={handleDismiss}
            >
                <Pressable
                    onPress={() => { setModalVisible(false); }}
                    style={{ height: 100 }}
                />
                <Pressable
                    className="flex-1 bg-[#2A2A2A] rounded-t-2xl"
                >
                    <Pressable
                        onPress={() => { setModalVisible(false); }}
                        className="items-end p-3 pr-5 self-end"
                        style={{ height: 50, width: 70 }}
                    >
                        <MaterialCommunityIcons name="window-close" size={30} color="white" />
                    </Pressable>
                    <View className="flex-1 pl-6 gap-4">
                        <Uploading
                            onDismiss={() => { setModalVisible(false); }} // Once animation is done then close outer modal.
                            visible={uploadInfo.isUploading}
                            prog={uploadInfo.total ? uploadInfo.sent / uploadInfo.total * 100 : 0}
                        />
                        <Text className="font-bold text-[#8D949D] text-[20px]  ">Vehicle Details</Text>
                        <StringInputTB
                            setData={(input) => { setInput(input, (input: string | undefined) => { admisObj.setPlate(input); }) }}
                            condition={(input: string) => { return input.length >= 6; }}
                            filledOut={filledOut[0]}
                            setFilledOut={(value: boolean) => {
                                setInput(value, (input: boolean) => {
                                    setFilledOut([input, filledOut[1], filledOut[2], filledOut[3], filledOut[4], filledOut[5]]);
                                })
                            }}
                            placeholder={"License Plate"}
                        />
                        <InitAdmisObjTB
                            data={Brands}
                            setData={(brand) => { setInput(brand, (input: string | undefined) => { admisObj.setBrand(input); }) }}
                            filledOut={filledOut[1]}
                            setFilledOut={(value: boolean) => {
                                setInput(value, (input: boolean) => {
                                    setFilledOut([filledOut[0], input, filledOut[2], filledOut[3], filledOut[4], filledOut[5]]);
                                });
                            }}
                            placeholder={"Brand"}
                        />
                        <DependentTB
                            data={Models}
                            setData={(model) => {
                                setInput(model, (input: string | undefined) => { admisObj.setModel(input); })
                            }}
                            placeholder={"Model"}
                        />
                        <InitAdmisObjTB
                            data={Colors}
                            setData={(color) => {
                                setInput(color, (input: string | undefined) => { admisObj.setColor(input); })
                            }}
                            filledOut={filledOut[2]}
                            setFilledOut={(value: boolean) => {
                                setInput(value, (input: boolean) => {
                                    setFilledOut([filledOut[0], filledOut[1], input, filledOut[3], filledOut[4], filledOut[5]]);
                                });
                            }}
                            placeholder={"Color"}
                        />
                        <Text className="font-bold text-[#8D949D] text-[20px] ">Location Details</Text>
                        <InitAdmisObjTB
                            data={Lots}
                            setData={(lot) => {
                                setInput(lot, (input: string | undefined) => { admisObj.setLot(input); })
                            }}
                            filledOut={filledOut[3]}
                            setFilledOut={(value: boolean) => {
                                setInput(value, (input: boolean) => {
                                    setFilledOut([filledOut[0], filledOut[1], filledOut[2], input, filledOut[4], filledOut[5]]);
                                });
                            }}
                            placeholder={"Lot"}
                        />
                        <StringInputTB
                            setData={(input) => {
                                setInput(input, (input: string | undefined) => {
                                    admisObj.setFloor(input ? Number(input) : undefined);
                                });
                            }}
                            condition={(input: string) => { return Number(input) <= FLOOR_MAX; }}
                            filledOut={filledOut[4]}
                            setFilledOut={(value: boolean) => {
                                setInput(value, (input: boolean) => {
                                    setFilledOut([filledOut[0], filledOut[1], filledOut[2], filledOut[3], input, filledOut[5]]);
                                })
                            }}
                            keyboardType={"number-pad"}
                            placeholder={"Floor"}
                        />
                        <StringInputTB
                            setData={(input) => {
                                setInput(input, (input: string | undefined) => {
                                    admisObj.setSpace(input ? Number(input) : undefined);
                                });
                            }}
                            condition={(input: string) => { return Number(input) <= SPACE_MAX; }}
                            filledOut={filledOut[5]}
                            setFilledOut={(value: boolean) => {
                                setInput(value, (input: boolean) => {
                                    setFilledOut([filledOut[0], filledOut[1], filledOut[2], filledOut[3], filledOut[4], input]);
                                })
                            }}
                            keyboardType={"number-pad"}
                            placeholder={"Space"}
                        />
                        <InitImageSet modalVisible={modalVisible} />
                    </View>
                    <View className="self-center pb-10">
                        <SimpleButton
                            onPress={() => { handleUpload(); }}
                            title={"Done"}
                            isDisabled={filledOut.includes(false)}
                        />
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}
