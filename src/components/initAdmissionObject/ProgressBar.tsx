import React from "react";
import { View } from "react-native";
import { Svg, Rect } from "react-native-svg";

interface Props {
    barWidth: number;
    prog: number;
}

export function ProgBar({ barWidth, prog }: Props) {
    const progWidth = (prog / 100) * barWidth;
    return (
        <View
            className="flex-1 justify-center items-center self-center"
        >
            <Svg
                width={barWidth}
                height={5}
            >
                <Rect
                    width={barWidth}
                    height={"100%"}
                    fill={"#000"}
                    rx={3.5}
                    ry={3.5}
                />
                <Rect
                    width={progWidth}
                    height={"100%"}
                    fill={"#fff"}
                    rx={3.5}
                    ry={3.5}
                />
            </Svg>
        </View>
    );
}
