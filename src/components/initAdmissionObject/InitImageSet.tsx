import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import {
    ImagePickerOptions,
    requestCameraPermissionsAsync,
    launchCameraAsync,
} from "expo-image-picker";
import { useContext, useEffect, useState } from "react";
import { Text, Pressable, View, Image, FlatList, TouchableOpacity } from "react-native";
import {
    getInfoAsync,
    makeDirectoryAsync,
    copyAsync,
    readDirectoryAsync,
    deleteAsync,
    cacheDirectory
} from "expo-file-system";
import { URIsContext } from '../context/ImageURIContext';

interface Props {
    modalVisible: boolean;
}

const option: ImagePickerOptions = {
    mediaTypes: 'images',
    allowsEditing: true,
    aspect: [4, 3]
};
const BOX_WIDTH: number = 370;
const IMAGE_DIR = cacheDirectory + 'images/';

export function InitImageSet({ modalVisible }: Props) {

    // This undefined error handling pisses me off.
    const context = useContext(URIsContext);
    if (context === undefined) {
        throw Error("Context API has failed to provide ImageURI context.");
    }

    const { imageURIs, setImageURIs } = context;
    const [index, setIndex] = useState(0);

    async function initImageDir() {
        const dirInfo = await getInfoAsync(IMAGE_DIR);
        if (!dirInfo.exists) {
            await makeDirectoryAsync(IMAGE_DIR, { intermediates: true });
        }
    }

    async function takePhoto() {
        try {
            await requestCameraPermissionsAsync();
            const pickerResult = await launchCameraAsync(option);
            if (!pickerResult.canceled) {
                await loadImageToDir(pickerResult.assets[0].uri);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function loadImageToDir(uri: string) {
        try {
            await initImageDir();
            const path = IMAGE_DIR + new Date().getTime() + '.jpg';
            await copyAsync({ from: uri, to: path });
            setImageURIs([path, ...imageURIs]);
        } catch (e) {
            console.log(e);
        }
    }

    async function displayImages() {
        const dirInfo = await getInfoAsync(IMAGE_DIR);
        if (!dirInfo.exists) {
            return
        }
        const files = await readDirectoryAsync(IMAGE_DIR);
        if (files.length > 0) {
            setImageURIs(files.map((file: string) => IMAGE_DIR + file));
        }
    }

    async function freeAllImages() {
        let dirInfo = await getInfoAsync(IMAGE_DIR);
        if (!dirInfo.exists) {
            return
        }
        await deleteAsync(IMAGE_DIR, { idempotent: true });
        dirInfo = await getInfoAsync(IMAGE_DIR);
        if (!dirInfo.exists) {
            setImageURIs([]);
            setIndex(0);
        } else {
            throw Error("Images were not freed.");
        }
    }

    async function freeImage() {
        let files = await readDirectoryAsync(IMAGE_DIR);
        if (files.length === 1 && imageURIs.length === 1) {
            await deleteAsync(IMAGE_DIR, { idempotent: true });
            setImageURIs([]);
            setIndex(0);
            return
        }
        await deleteAsync(imageURIs[index], { idempotent: true });
        const reducedArray = imageURIs.filter((_, indexOfValue) => indexOfValue !== index);
        files = await readDirectoryAsync(IMAGE_DIR);
        if (files.length !== reducedArray.length) {
            throw Error("Uneven image to URI count.");
        }
        setImageURIs(reducedArray);
        if (index === reducedArray.length) {
            setIndex(index - 1);
        }
    }

    useEffect(() => {
        displayImages();
    }, []);

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
                style={{ width: BOX_WIDTH, height: 220 }}
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
            <View style={{ width: BOX_WIDTH, height: 300 }} >
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
                    <TouchableOpacity onPress={() => { takePhoto(); }} >
                        <Feather
                            name="plus-square"
                            size={26}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
                <FlatList
                    onMomentumScrollEnd={(ev) => {
                        setIndex(Math.floor(ev.nativeEvent.contentOffset.x / BOX_WIDTH));
                    }}
                    data={imageURIs}
                    keyExtractor={item => item.toString()}
                    renderItem={({ item }) => {
                        return (
                            <Image
                                source={{ uri: item }}
                                style={{ width: BOX_WIDTH, height: 220 }}
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

