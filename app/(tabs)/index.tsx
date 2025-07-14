import { View, Pressable, Text, TextInput } from "react-native";

export default function Receive() {
    return (
        <View className="dev-view gap-10">
            <View className="justify-center items-center gap-2">
                <TextInput
                    style={{ width: 340, height: 45 }}
                    className="bg-[#181818] rounded-md text-white text-center text-xl"
                    keyboardType="number-pad"
                />
                <Text className="text-[#8D949D]">Guest's mobile number</Text>
            </View>
            <Pressable>
                <View style={{ width: 360, height: 45 }} className="bg-actionBlue rounded-lg justify-center items-center" >
                    <Text className="font-semibold text-xl text-[#1F1F1F]">Park</Text>
                </View>
            </Pressable>
        </View>
    );
}
