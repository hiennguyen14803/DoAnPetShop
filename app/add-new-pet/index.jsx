import { View, Text, Image, TextInput, StyleSheet, ScrollView, Pressable, ToastAndroid, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import { TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db, storage } from '../../config/FirebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
import { ref } from 'firebase/storage';
import { useUser } from '@clerk/clerk-expo';

export default function AddNewPet() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({ category: 'Dogs', sex: 'Nam' });
  const [gerder, setGerder] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [image, setImage] = useState(null); // Khởi tạo với giá trị null
  const [loader, setLoader] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Thêm Pet Mới',
    });
    GetCategories();
  }, []);

  // Lấy danh sách thể loại từ Firestore
  const GetCategories = async () => {
    setCategoryList([]);
    const snapshot = await getDocs(collection(db, 'Category'));
    snapshot.forEach((doc) => {
      setCategoryList((categoryList) => [...categoryList, doc.data()]);
    });
  };

  // Mở thư viện để chọn hình ảnh
  const imagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result); // Kiểm tra kết quả

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    } else {
      console.log("No image selected or image selection was canceled.");
    }
  };

  // Cập nhật giá trị trong form
  const handleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  // Xử lý khi người dùng gửi form
  const onsubmit = () => {
    if (Object.keys(formData).length !== 8) {
      ToastAndroid.show('Hãy nhập tất cả chi tiết', ToastAndroid.SHORT);
      return;
    }
    
    if (!image) {
      ToastAndroid.show('Vui lòng chọn hình ảnh', ToastAndroid.SHORT);
      return;
    }
    
    UploadImage();
  };

  // Tải lên hình ảnh lên Firebase Storage
  const UploadImage = async () => {
    try {
      setLoader(true);
      const resp = await fetch(image);
      const blobImage = await resp.blob();
      const storageRef = ref(storage, '/PetShop/' + Date.now() + '.jpg');

      // Tải lên hình ảnh
      const snapshot = await uploadBytes(storageRef, blobImage);
      console.log('File Uploaded');

      // Lấy URL của ảnh sau khi tải lên
      const downloadUrl = await getDownloadURL(snapshot.ref);
      console.log('Download URL: ', downloadUrl);

      // Lưu formData và URL ảnh vào Firestore
      await SaveFormData(downloadUrl);
      ToastAndroid.show('Tải lên thành công', ToastAndroid.SHORT);

    } catch (error) {
      console.error('Error uploading image: ', error);
      ToastAndroid.show('Tải lên thất bại', ToastAndroid.SHORT);
    } finally {
      setLoader(false);
    }
  };

  // Lưu dữ liệu form và URL ảnh vào Firestore
  const SaveFormData = async (imageUrl) => {
    const docId = Date.now().toString();
    try {
      await setDoc(doc(db, 'Pets', docId), {
        ...formData,
        imageUrl: imageUrl,  // URL của ảnh
        username: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        userImage: user?.imageUrl,
        id: docId,
      });
      ToastAndroid.show('Dữ liệu đã được lưu', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error saving form data: ', error);
      ToastAndroid.show('Lưu dữ liệu thất bại', ToastAndroid.SHORT);
    }
    setLoader(false);
    router.replace('/(tabs)/home')
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontFamily: 'outfit-medium', fontSize: 20 }}>
        Thêm thú cưng mới để nhận nuôi
      </Text>

      <Pressable onPress={imagePicker}>
        {!image ? (
          <Image
            source={require('./../../assets/images/placeholder.png')}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderWidth: 1,
              backgroundColor: Colors.GRAY,
            }}
          />
        ) : (
          <Image
            source={{ uri: image }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 15,
            }}
          />
        )}
      </Pressable>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tên Thú cưng *</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleInputChange('name', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Thể loại thú cưng *</Text>
        <Picker
          selectedValue={selectedCategory}
          style={styles.input}
          onValueChange={(itemValue) => {
            setSelectedCategory(itemValue);
            handleInputChange('category', itemValue);
          }}
        >
          {categoryList.map((category, index) => (
            <Picker.Item key={index} label={category.name} value={category.name} />
          ))}
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Giống *</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleInputChange('breed', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tuổi*</Text>
        <TextInput
          style={styles.input}
          keyboardType='number-pad'
          onChangeText={(value) => handleInputChange('age', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Giới tính *</Text>
        <Picker
          selectedValue={gerder}
          style={styles.input}
          onValueChange={(itemValue) => {
            setGerder(itemValue);
            handleInputChange('sex', itemValue);
          }}
        >
          <Picker.Item label="Nam" value="Nam" />
          <Picker.Item label="Nữ" value="Nữ" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Cân nặng*</Text>
        <TextInput
          style={styles.input}
          keyboardType='number-pad'
          onChangeText={(value) => handleInputChange('weight', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Địa chỉ*</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleInputChange('address', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Thông tin*</Text>
        <TextInput
          style={styles.input}
          numberOfLines={5}
          multiline={true}
          onChangeText={(value) => handleInputChange('about', value)}
        />
      </View>

      <TouchableOpacity 
        style={styles.button}
        disabled={loader}
        onPress={onsubmit}
      >
        {loader ? (
          <ActivityIndicator size={'large'} />
        ) : (
          <Text style={{ fontFamily: 'outfit-medium', textAlign: 'center' }}>
            Gửi yêu cầu
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 5,
  },
  input: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    borderRadius: 7,
    fontFamily: 'outfit',
  },
  label: {
    marginVertical: 5,
    fontFamily: 'outfit',
  },
  button: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 7,
    marginVertical: 20,
  },
});
