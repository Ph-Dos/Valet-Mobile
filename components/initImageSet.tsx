import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from "expo-image-picker";
// import { getApps, initializeApp } from "firebase/app";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import { Text, Pressable, ScrollView, Image } from "react-native";
import {
    documentDirectory,
    getInfoAsync,
    makeDirectoryAsync,
    copyAsync,
    readDirectoryAsync,
    deleteAsync
} from "expo-file-system";

interface Props {
    modalVisible: boolean
}

const imageDir = documentDirectory + 'images/';
async function initImageDir() {
    const dirInfo = await getInfoAsync(imageDir);
    if (!dirInfo.exists) {
        await makeDirectoryAsync(imageDir, { intermediates: true });
    }
}

export function InitImageSet({ modalVisible }: Props) {

    const [images, setImages] = useState<Array<string>>([]);

    const option: ImagePicker.ImagePickerOptions = {
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3]
    };

    async function takePhoto() {
        await ImagePicker.requestCameraPermissionsAsync();
        let pickerResult = await ImagePicker.launchCameraAsync(option);
        console.log({ pickerResult });
        handleImages(pickerResult);
    }

    async function handleImages(pickerResult: ImagePicker.ImagePickerResult) {
        try {
            // setUploading(true);
            if (!pickerResult.canceled) {
                console.log(pickerResult.assets[0].uri);
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

    if (!modalVisible) {
        try {
            const promises = images.map(async (uri) => {
                const uriPath = await getInfoAsync(uri);
                if (uriPath.exists) {
                    try {
                        await deleteAsync(uri, { idempotent: false });
                    } catch (eInner) {
                        console.log(eInner);
                    }
                }
                const results = await Promise.all(promises);
            })
        } catch (eOutter) {
            console.log(eOutter)
        }
    } else if (images.length < 1) {
        return (
            <Pressable
                onPress={() => { takePhoto(); }}
                className="bg-[#333333] rounded-xl justify-center items-center"
                style={{ width: 370, height: 220 }}
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
            <ScrollView
                horizontal={true}
            >
                {images.map((img) => (
                    <Image
                        key={img}
                        source={{ uri: img }}
                        style={{ width: 200, height: 200 }}
                    />
                ))}
            </ScrollView>
        );
    }
}

