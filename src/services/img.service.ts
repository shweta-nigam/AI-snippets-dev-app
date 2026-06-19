import * as ImagePicker from "expo-image-picker";

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync();

  if (!result.canceled) {
    const imageUri = result.assets[0].uri;

    // save imageUri in sqlite
  }
};