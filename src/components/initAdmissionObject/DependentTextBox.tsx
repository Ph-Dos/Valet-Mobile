import { BasicTBData, ModelList } from "./AdmissionObjectTextBox";
import { useContext, useRef, useState } from "react";
import { FlatList, View, Text, TextInput, TouchableOpacity, Animated, Keyboard } from "react-native";
import { ObjectContext } from "../context/AdmissionObjectContext";

interface Props {
    data: BasicTBData[];
    setData: (value: any) => void;
    placeholder: string;
}
const NO_DATA: BasicTBData[] = [{ searchName: undefined, displayName: "Select a brand." }]

export function DependentTB({ data, setData, placeholder }: Props) {
    const [textValue, setTextValue] = useState<string | undefined>(undefined);
    const [focus, setFocus] = useState(false);
    const renderList = useRef<ModelList[] | undefined>(undefined);
    const renderKey = useRef<string | undefined>(undefined);
    const contextObject = useContext(ObjectContext);
    if (contextObject === undefined) {
        throw Error("Context API has failed to provide AdmissiobObject context.");
    }
    const { admisObj } = contextObject;

    function findRenderList() {
        if (!admisObj.data.vehicleDetails?.brand) {
            console.log(admisObj.data.vehicleDetails?.brand);
            return;
        }
        if (admisObj.data.vehicleDetails.brand === renderKey.current) {
            return;
        }
        for (const object of data) {
            if (object.values && object.searchName === admisObj.data.vehicleDetails?.brand) {
                renderKey.current = object.searchName;
                renderList.current = object.values;
                console.log(renderKey.current);
                return;
            }
        }
    }

    function handleSelection(item: BasicTBData) {
        setData(item.searchName);
        setTextValue(item.displayName);
        Keyboard.dismiss();
        setFocus(false);
    }

    return (
        <View
            className="bg-[#333333] rounded-xl"
            style={{ width: 370, maxHeight: 200 }}
        >
            <TextInput
                onFocus={() => {
                    setFocus(true);
                    findRenderList();
                }}
                onBlur={() => { setFocus(false); }}
                value={textValue}
                onChangeText={(text: string) => { setTextValue(text); }}
                className="bg-[#181818] rounded-xl text-white text-xl pl-4"
                style={{ width: 370, height: 40 }}
                placeholder={placeholder}
            />
            {focus &&
                <FlatList
                    data={renderList.current || NO_DATA}
                    keyboardShouldPersistTaps={"handled"}
                    renderItem={({ item }: { item: BasicTBData }) => {
                        if ((!textValue) || (textValue && item.searchName && item.searchName.includes(textValue.toLowerCase()))) {
                            return (
                                <TouchableOpacity
                                    onPress={() => { item.searchName && handleSelection(item); }}
                                    className={"h-10 util-center"}
                                >
                                    <Text className={"text-white font-semibold"}>{item.displayName}</Text>
                                </TouchableOpacity>
                            );
                        }
                        return <></>;
                    }}
                    className="rounded-b-xl"
                    bounces={false}
                />
            }
        </View>
    )
}
