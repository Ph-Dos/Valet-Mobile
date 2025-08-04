import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import {
    ImagePickerOptions,
    requestCameraPermissionsAsync,
    launchCameraAsync,
} from "expo-image-picker";
import { useEffect, useState } from "react";
import { Text, Pressable, View, Image, FlatList, TouchableOpacity } from "react-native";
import {
    getInfoAsync,
    makeDirectoryAsync,
    copyAsync,
    readDirectoryAsync,
    deleteAsync
} from "expo-file-system";

interface Props {
    modalVisible: boolean;
    imageDir: string;
    imageURIs: Array<string>;
    setImageURIs: (updatedImages: Array<string>) => void;
}
const option: ImagePickerOptions = {
    mediaTypes: 'images',
    allowsEditing: true,
    aspect: [4, 3]
};
const boxWidth: number = 370;

export function InitImageSet({ modalVisible, imageDir, imageURIs, setImageURIs }: Props) {
    const [index, setIndex] = useState(0);

    async function initImageDir() {
        const dirInfo = await getInfoAsync(imageDir);
        if (!dirInfo.exists) {
            await makeDirectoryAsync(imageDir, { intermediates: true });
        }
    }

    async function takePhoto() {
        try {
            await requestCameraPermissionsAsync();
            const pickerResult = await launchCameraAsync(option);
            // setUploading(true);
            if (!pickerResult.canceled) {
                await loadImageToDir(pickerResult.assets[0].uri);
            }
        } catch (e) {
            alert("Upload failed.");
        }
        // setUploading(false);
    }

    async function loadImageToDir(uri: string) {
        try {
            await initImageDir();
            const path = imageDir + new Date().getTime() + '.jpg';
            await copyAsync({ from: uri, to: path });
            setImageURIs([path, ...imageURIs]);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        displayImages();
    }, []);

    async function displayImages() {
        const dirInfo = await getInfoAsync(imageDir);
        if (!dirInfo.exists) {
            return
        }
        const files = await readDirectoryAsync(imageDir);
        if (files.length > 0) {
            setImageURIs(files.map((file: string) => imageDir + file));
        }
    }

    async function freeAllImages() {
        let dirInfo = await getInfoAsync(imageDir);
        if (!dirInfo.exists) {
            return
        }
        await deleteAsync(imageDir, { idempotent: true });
        dirInfo = await getInfoAsync(imageDir);
        if (!dirInfo.exists) {
            setImageURIs([]);
            setIndex(0);
        } else {
            alert("Images were not freed correctly. Restart App.");
            throw Error("Images were not freed.");
        }
    }

    async function freeImage() {
        let files = await readDirectoryAsync(imageDir);
        if (files.length === 1 && imageURIs.length === 1) {
            await deleteAsync(imageDir, { idempotent: true });
            setImageURIs([]);
            setIndex(0);
            return
        }
        await deleteAsync(imageURIs[index], { idempotent: true });
        const reducedArray = imageURIs.filter((_, indexOfValue) => indexOfValue !== index);
        files = await readDirectoryAsync(imageDir);
        if (files.length !== reducedArray.length) {
            throw Error("Uneven image to URI count.");
        }
        setImageURIs(reducedArray);
        if (index === reducedArray.length) {
            setIndex(index - 1);
        }
    }

    useEffect(() => {
        try {
            if (!modalVisible) {
                freeAllImages();
            }
        } catch (e) {
            console.log(e);
        }
    }, [modalVisible]);

    if (imageURIs.length < 1) {
        return (
            <Pressable
                onPress={() => { takePhoto(); }}
                className="bg-[#333333] rounded-xl justify-center items-center"
                style={{ width: boxWidth, height: 220 }}
            >
                <MaterialCommunityIcons
                    name="file-image-plus-outline"
                    size={55}
                    color="#539DF3"
                />
                <Text className="font-semibold text-white text-l pt-3">Take photos</Text>
            </Pressable>
        );
    } else {
        return (
            <View style={{ width: boxWidth, height: 300 }} >
                <View
                    className='flex-row justify-between pt-3'
                    style={{ height: 50 }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            try {
                                freeImage();
                            } catch (e) {
                                console.log(e);
                            }
                        }}
                    >
                        <Feather
                            name="x-circle"
                            size={26}
                            color="white"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { takePhoto(); }}
                    >
                        <Feather
                            name="plus-square"
                            size={26}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
                <FlatList
                    onMomentumScrollEnd={(ev) => {
                        setIndex(Math.floor(ev.nativeEvent.contentOffset.x / boxWidth));
                    }}
                    data={imageURIs}
                    keyExtractor={item => item.toString()}
                    renderItem={({ item }) => {
                        return (
                            <Image
                                source={{ uri: item }}
                                style={{ width: boxWidth, height: 220 }}
                                className='rounded-xl'
                            />
                        );
                    }}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        );
    }
}

