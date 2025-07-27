import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import {
    ImagePickerOptions,
    requestCameraPermissionsAsync,
    launchCameraAsync,
} from "expo-image-picker";
import { useEffect, useState } from "react";
import { Text, Pressable, View, Image, FlatList, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import {
    cacheDirectory,
    getInfoAsync,
    makeDirectoryAsync,
    copyAsync,
    readDirectoryAsync,
    deleteAsync
} from "expo-file-system";

interface Props {
    modalVisible: boolean
}

const imageDir = cacheDirectory + 'images/';
async function initImageDir() {
    const dirInfo = await getInfoAsync(imageDir);
    if (!dirInfo.exists) {
        await makeDirectoryAsync(imageDir, { intermediates: true });
    }
}

const option: ImagePickerOptions = {
    mediaTypes: 'images',
    allowsEditing: true,
    aspect: [4, 3]
};
const boxWidth: number = 370;

export function InitImageSet({ modalVisible }: Props) {

    const [images, setImages] = useState<Array<string>>([]);
    const [prevScroll, setPrevScroll] = useState(0);
    const [index, setIndex] = useState(0);

    async function takePhoto() {
        await requestCameraPermissionsAsync();
        let pickerResult = await launchCameraAsync(option);
        try {
            // setUploading(true);
            if (!pickerResult.canceled) {
                await loadImagesToDir(pickerResult.assets[0].uri);
            }
        } catch (e) {
            alert("Upload failed.");
        }
        // setUploading(false);
    }

    async function loadImagesToDir(uri: string) {
        await initImageDir();
        const path = imageDir + new Date().getTime() + '.jpg';
        await copyAsync({ from: uri, to: path });
        setImages([path, ...images]);
    }

    useEffect(() => {
        displayImages();
    }, []);

    async function displayImages() {
        await initImageDir();
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
    }

    function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const curScroll = event.nativeEvent.contentOffset.x;
        if (curScroll === prevScroll + boxWidth) {
            setIndex(index + 1);
            setPrevScroll(prevScroll + boxWidth);
        } else if (curScroll === prevScroll - boxWidth) {
            setIndex(index - 1);
            setPrevScroll(prevScroll - boxWidth);
        }
    }

    // NOTE: Everything bellow has bugs.

    /**
     * You are getting erros when you delete the secound to last images,
     * it makes the index equal to the size of the images array so you are out of bounds by 1.
     * ALso I thhink that the index is not being updates correctly by the boxWidth apprpoach.
     */

    async function freeImage() {
        async function popIndex() {
            if (images.length === 1) {
                setImages([]);
                return
            }
            setImages(
                images.filter((value, indexOfValue) => indexOfValue !== index)
            );
        }
        let files = await readDirectoryAsync(imageDir);
        if (files.length === 0) {
            throw Error("No images have been taken.");
        }
        await popIndex();
        await deleteAsync(images[index], { idempotent: true });
        files = await readDirectoryAsync(imageDir);
        if (files.length === images.length - 1) {
        } else {
            throw Error("Image was not freed.")
        }
        if (images.length === index) {
            setIndex(index - 1);
        }
        console.log(images.toString());
    }

    async function logImageDirState() {
        freeAllImages();
        const dirInfo = await getInfoAsync(imageDir);
        console.log(`${imageDir} exists: ${dirInfo.exists}`);
    }

    if (!modalVisible) {
        try {
            logImageDirState();
        } catch (e) {
            console.log(e);
        }
    } else if (images.length < 1) {
        return (
            <Pressable
                onPress={() => { takePhoto(); console.log(images.toString()) }}
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
                        onPress={() => { console.log(index); freeImage(); }}
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
                    onMomentumScrollEnd={(event) => { handleScroll(event); }}
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

