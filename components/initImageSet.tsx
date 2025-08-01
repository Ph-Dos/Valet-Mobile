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
    imageCount: number;
    setImageCount: (newImageCount: number) => void;
}

const option: ImagePickerOptions = {
    mediaTypes: 'images',
    allowsEditing: true,
    aspect: [4, 3]
};
const boxWidth: number = 370;

export function InitImageSet({ modalVisible, imageDir, imageCount, setImageCount }: Props) {
    const [images, setImages] = useState<Array<string>>([]);
    const [index, setIndex] = useState(0);

    async function initImageDir() {
        let dirInfo = await getInfoAsync(imageDir);
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
                setImageCount(imageCount + 1);
            }
        } catch (e) {
            alert("Upload failed.");
        }
        // setUploading(false);
    }

    async function loadImageToDir(uri: string) {
        await initImageDir();
        const path = imageDir + new Date().getTime() + '.jpg';
        await copyAsync({ from: uri, to: path });
        setImages([path, ...images]);
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
            setImages(files.map(f => imageDir + f));
        }
    }

    async function freeAllImages() {
        let dirInfo = await getInfoAsync(imageDir);
        if (!dirInfo.exists) {
            setImages([]);
            setIndex(0);
            return
        }
        await deleteAsync(imageDir, { idempotent: true });
        dirInfo = await getInfoAsync(imageDir);
        if (!dirInfo.exists) {
            setImages([]);
            setIndex(0);
        } else {
            alert("Images were not freed correctly. Restart App.");
            throw Error("Images were not freed.");
        }
        setImageCount(0);
    }

    async function freeImage() {
        let files = await readDirectoryAsync(imageDir);
        if (files.length === 1 && images.length === 1) {
            await deleteAsync(imageDir, { idempotent: true });
            setImages([]);
            setIndex(0);
            setImageCount(0);
            return
        }
        await deleteAsync(images[index], { idempotent: true });
        const reducedArray = images.filter((value, indexOfValue) => indexOfValue !== index);
        files = await readDirectoryAsync(imageDir);
        if (files.length !== reducedArray.length) {
            throw Error("Uneven image to URI count.");
        }
        setImages(reducedArray);
        if (index === reducedArray.length) {
            setIndex(index - 1);
        }
        setImageCount(imageCount - 1);
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

    if (images.length < 1) {
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
                                const wrapper = async () => { await freeImage(); };
                                wrapper();
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
                    data={images}
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

