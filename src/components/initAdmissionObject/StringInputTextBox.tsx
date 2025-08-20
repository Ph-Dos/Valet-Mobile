import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { TextInput, View } from "react-native";

interface Props {
    setData: (value: string | undefined) => void;
    condition: (value: string) => boolean;
    filledOut: boolean;
    setFilledOut: (value: boolean) => void;
}

export function StringInputTB({ setData, condition, filledOut, setFilledOut }: Props) {
    const [textValue, setTextValue] = useState<string | undefined>(undefined);

    function handleTextChange(text: string) {
        if (condition && condition(text)) {
            setData(text);
            setFilledOut(true);
        } else if (filledOut) {
            setData(undefined);
            setFilledOut(false);
        }
        setTextValue(text);
    }

    return (
        <View
            className="bg-[#333333] rounded-xl"
            style={{ width: 370, maxHeight: 200 }}
        >
            <TextInput
                value={textValue}
                onChangeText={(text: string) => { handleTextChange(text); }}
                autoCapitalize="characters"
                className="bg-[#181818] rounded-xl text-white text-xl pl-4"
                style={{ width: 370, height: 40 }}
                returnKeyType={"done"}
                placeholder={"License plate"}
            />
            {filledOut &&
                <Feather
                    name="check"
                    size={25}
                    color="lime"
                    className="absolute right-2 top-2.5"
                />
            }
            {!filledOut &&
                <Feather
                    name="alert-circle"
                    size={25}
                    color="tomato"
                    className="absolute right-2 top-2"
                />
            }
        </View>
    );
}
