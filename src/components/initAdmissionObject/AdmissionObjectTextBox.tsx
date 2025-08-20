import { RefObject, useState } from "react";
import { FlatList, View, Text, TextInput, TouchableOpacity, Animated, Keyboard } from "react-native";
import Feather from '@expo/vector-icons/Feather';

/**
 */

export interface ModelList {
    searchName: string;
    displayName: string;
}

export interface BasicTBData {
    searchName?: string;
    displayName?: string;
    values?: ModelList[];
}

interface Props {
    data: BasicTBData[];
    setData: (value: any) => void;
    required?: RefObject<boolean>;
    placeholder: string;
}

export function InitAdmisObjTB({ data, setData, required, placeholder }: Props) {
    const [textValue, setTextValue] = useState<string | undefined>(undefined);
    const [focus, setFocus] = useState(false);

    function handleSelection(item: BasicTBData) {
        setData(item.searchName);
        setTextValue(item.displayName);
        if (required) {
            required.current = true;
        }
        Keyboard.dismiss();
        setFocus(false);
    }

    return (
        <View
            className="bg-[#333333] rounded-xl"
            style={{ width: 370, maxHeight: 200 }}
        >
            <View>
                <TextInput
                    onFocus={() => { setFocus(true); }}
                    onBlur={() => { setFocus(false); }}
                    value={textValue}
                    onChangeText={(text: string) => {
                        setTextValue(text);
                        if (required && required.current) {
                            setData(undefined);
                            required.current = false;
                        }
                    }}
                    className="bg-[#181818] rounded-xl text-white text-xl pl-4"
                    style={{ width: 370, height: 40 }}
                    placeholder={placeholder}
                />
                {required && required.current &&
                    <Feather
                        name="check"
                        size={25}
                        color="lime"
                        className="absolute right-2 top-2.5"
                    />
                }
                {required && !required.current &&
                    <Feather
                        name="alert-circle"
                        size={25}
                        color="tomato"
                        className="absolute right-2 top-2"
                    />
                }
            </View>
            {focus &&
                <FlatList
                    data={data}
                    keyboardShouldPersistTaps={"handled"}
                    renderItem={({ item }: { item: BasicTBData }) => {
                        if ((!textValue) || (textValue && item.searchName && item.searchName.includes(textValue.toLowerCase()))) {
                            return (
                                <TouchableOpacity
                                    onPress={() => { handleSelection(item); }}
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
