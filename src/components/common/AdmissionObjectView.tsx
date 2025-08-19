import { Image, Pressable, View, Text } from "react-native";
import Animated from "react-native-reanimated";
import React from "react";
import { ObjectData } from "../initAdmissionObject/AdmissionObject";

interface Props {
    data: ObjectData;
}

interface TextBlockProps {
    data: string;
    value: string | number;
}

export function AdmisObjView({ data }: Props) {
    if (!data.locationDetails || !data.vehicleDetails) {
        return;
    }
    const { vehicleDetails, locationDetails } = data;
    return (
        <Pressable>
            <Animated.View
                className={"view-admisObject pr-3"}
            >
                <View className={"util-center"}>
                    <Image source={require("../../assets/images/honda-civic.png")} />
                    <Text className={"font-bold text-white text-[20px]"}>67FAS123</Text>
                    <Text className={"text-[#8D949D] text-[15px]"}>{vehicleDetails.color + " " + vehicleDetails.brand}</Text>
                </View>
                <View className={"view-admisObject-location"}>
                    <TextBlock data={"Lot"} value={locationDetails.lot} />
                    <TextBlock data={"Floor"} value={locationDetails.floor} />
                    <TextBlock data={"Space"} value={"432"} />
                </View>
            </Animated.View>
        </Pressable>
    );
}

function TextBlock({ data, value }: TextBlockProps) {
    return (
        <View className={"flex-row justify-between"}>
            <Text className={"text-white text-[18px] font-semibold"}>{data}</Text>
            <View className={"bg-blue-400 p-0.5 pl-1.5 rounded-l"}>
                <Text className={"text-white text-[18px] font-semibold"}>{value}</Text>
            </View>
        </View>
    );
}
