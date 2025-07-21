import { useState } from "react";
import { FlatList, View, Text, TextInput, TouchableOpacity, Animated } from "react-native";
import { basicTBData } from "@/assets/initAdmissionObjectData/initAdmisObjTBData";

/**
 * setData() should not use any, I need to think of a more robust way to transfer
 * the value selected from a TB to the AdmissionObject with out passing the entire AdmissionObject.
 */

interface Props<T extends basicTBData> {
    data: Array<T>;
    id: number;
    activeId: number;
    setActiveId: (id: number) => void;
    setData: (value: any) => void;
    placeholder: string;
}

/**
 * You have tightly coupled the initAdmissionObject.tsx component to this one,
 * for this component to work properly it MUST read state from the initAdmissionObject component.
 */

export function InitAdmisObjTB<T extends basicTBData>({
    data,
    id,
    activeId,
    setActiveId,
    setData,
    placeholder
}: Props<T>) {

    const [value, setValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const opacity = useState(new Animated.Value(0))[0];

    function handleDropDownOpen() {
        setActiveId(id);
        setIsFocused(true);
        Animated.timing(opacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true
        }).start();
    }

    function handleSelection(item: T) {
        setValue(item.displayName);
        setData(item.displayName);
        setIsFocused(false);
        opacity.setValue(0);
    }

    if (activeId != id) {
        opacity.setValue(0);
    }

    return (
        <View
            className="bg-[#333333] rounded-xl"
            style={{ width: 370, maxHeight: 200 }}
        >
            <TextInput
                value={value}
                onChangeText={(text: string) => { setValue(text) }}
                onPress={handleDropDownOpen}
                className="bg-[#181818] rounded-xl text-white text-xl pl-4"
                style={{ width: 370, height: 40 }}
                placeholder={placeholder}
            />
            <FlatList
                data={data}
                renderItem={({ item }: { item: T }) => {
                    if (activeId === id && isFocused && item.searchName.includes(value.toLowerCase())) {
                        return (
                            <Animated.View style={{ opacity }}>
                                <TouchableOpacity onPress={() => { handleSelection(item) }}>
                                    <View
                                        className="bg-[#333333] items-center justify-center"
                                        style={{ height: 40 }}
                                    >
                                        <Text className="font-semibold text-white">{item.displayName}</Text>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        )
                    }
                    return <></>
                }}
                className="rounded-b-xl"
                bounces={false}
            />
        </View>
    )
}
