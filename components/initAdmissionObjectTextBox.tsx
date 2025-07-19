import { useState } from "react";
import { FlatList, View, Text, TextInput, TouchableOpacity, Animated, Pressable } from "react-native";

interface Props {
    placeHolder: string;

}

/**
 * This is very important.
 * You made this a seperate componenet b/c these are not normal text inputs,
 * They will have autom complete features, (e.g you type in a name an options come up)
 *
 */

interface Card {
    displayName: string;
    searchName: string;
}

const collection: Card[] = [
    { displayName: "Ford", searchName: "ford" },
    { displayName: "BMW", searchName: "bmw" },
    { displayName: "Ferrari", searchName: "ferrari" },
    { displayName: "Lamboginie", searchName: "lamboginie" },
    { displayName: "Porch", searchName: "porch" },
    { displayName: "Chev", searchName: "chev" },
    { displayName: "Honda", searchName: "honda" },
    { displayName: "Dodge", searchName: "dodge" }
];

export function InitAdmisObjTB({ placeHolder }: Props) {

    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState("");

    const opacity = useState(new Animated.Value(0))[0]

    function handleDropDownOpen() {
        setIsFocused(true);
        Animated.timing(opacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true
        }).start();
    }

    /**
     *
     *
     * This funtion is causing problems with handleSelection(),
     * when you press a container from the FlatList it closes the FlatList
     * before the handleSelection() function can be called.
     *
     */

    function handleDropDownClose() {
        // setIsFocused(false);
        // opacity.setValue(0);
    }

    function handleSelection(item: Card) {
        setValue(item.displayName);
        setIsFocused(false);
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
                onEndEditing={handleDropDownClose}
                className="bg-[#181818] rounded-xl text-white text-xl pl-4"
                style={{ width: 370, height: 40 }}
            />
            <FlatList
                data={collection}
                renderItem={({ item }: { item: Card }) => {
                    if (isFocused && item.searchName.includes(value.toLowerCase())) {
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
