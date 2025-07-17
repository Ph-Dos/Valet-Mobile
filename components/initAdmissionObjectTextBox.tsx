import { useState } from "react";
import { FlatList, View, Text, TextInput, Keyboard } from "react-native";

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

    const [isFocused, setIsFocused] = useState(false)
    const [value, setValue] = useState("")

    return (
        <View
            className="bg-[#333333] rounded-xl"
            style={{ width: 370, maxHeight: 200 }}
        >
            <TextInput
                value={value}
                onChangeText={(text: string) => { setValue(text) }}
                onPress={() => { setIsFocused(true) }}
                onEndEditing={() => { setIsFocused(false) }}
                className="bg-[#181818] rounded-xl text-white text-xl pl-4"
                style={{ width: 370, height: 40 }}
            />
            <FlatList
                data={collection}
                renderItem={({ item }) => {
                    if (isFocused && item.searchName.includes(value.toLowerCase())) {
                        return (
                            <View className="bg-[#333333] items-center justify-center h-20">
                                <Text className="font-semibold text-white">{item.displayName}</Text>
                            </View>
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
