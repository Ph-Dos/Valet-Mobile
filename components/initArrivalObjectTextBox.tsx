import { TextInput } from "react-native";

interface Props {
    placeHolder: string;

}

/**
 * This is very important.
 * You made this a seperate componenet b/c these are not normal text inputs,
 * They will have autom complete features, (e.g you type in a name an options come up)
 *
 */

export function InitAObjTB({ placeHolder }: Props) {
    return (
        <TextInput
            style={{ width: 370, height: 40 }}
            className="bg-[#181818] rounded-xl text-white text-xl pl-4"
            returnKeyType="done"
            placeholder={placeHolder}
        />
    )
}
