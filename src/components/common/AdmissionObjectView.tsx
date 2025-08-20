import { Image, Pressable, View, Text } from "react-native";
import Animated from "react-native-reanimated";
import React from "react";
import { ObjectData } from "../initAdmissionObject/AdmissionObject";

interface Props {
    object: ObjectData;
}

interface TextBlockProps {
    title: string;
    value: string | number;
}

export function AdmisObjView({ object }: Props) {
    const { vehicleDetails, locationDetails } = object;
    if (!vehicleDetails || !locationDetails) {
        return <></>
    } else if (!vehicleDetails.brand || !vehicleDetails.color || !vehicleDetails.plate) {
        return <></>
    } else if (!locationDetails.lot || !locationDetails.floor || !locationDetails.space) {
        return <></>
    }
    return (
        <Pressable>
            <Animated.View
                className={"view-admisObject pr-3"}
            >
                <View className={"util-center"}>
                    <Image source={require("../../assets/images/honda-civic.png")} />
                    <Text className={"font-bold text-white text-[20px]"}>{vehicleDetails.plate}</Text>
                    <Text className={"text-[#8D949D] text-[15px]"}>{vehicleDetails.color + " " + vehicleDetails.brand}</Text>
                </View>
                <View className={"view-admisObject-location"}>
                    <TextBlock title={"Lot"} value={locationDetails.lot} />
                    <TextBlock title={"Floor"} value={locationDetails.floor} />
                    <TextBlock title={"Space"} value={locationDetails.space} />
                </View>
            </Animated.View>
        </Pressable>
    );
}

function TextBlock({ title, value }: TextBlockProps) {
    return (
        <View className={"flex-row justify-between"}>
            <Text className={"text-white text-[18px] font-semibold"}>{title}</Text>
            <View className={"bg-blue-400 p-0.5 pl-1.5 pr-1.5 rounded-l"}>
                <Text className={"text-white text-[18px] font-semibold"}>{value}</Text>
            </View>
        </View>
    );
}
