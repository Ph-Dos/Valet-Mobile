import { Pressable, Text } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: "images",
    aspect: [4, 3]
};

export function InitImageSet() {

    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync(options);
        handleImagePicked(result);
    }

    async function handleImagePicked(result: ImagePicker.ImagePickerResult) {
        try {
            if (result.canceled) {
                alert("Upload cancelled");
                return;
            } else {
            }
        } catch (e) {
            console.log(e);
            alert("Upload failed");
        }
    };

    return (

        <Pressable
            onPress={takePhoto}
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
}
