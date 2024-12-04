import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import Colors from './../../constants/Colors';

export default function Category({category}) {
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Dogs'); // Mặc định là 'Dogs'

    useEffect(() => {
        GetCategories();
    }, []);
    /** Được sử dụng lấy danh sách Db ra */
    const GetCategories = async () => {
        setCategoryList([]);
        const snapshot = await getDocs(collection(db, 'Category'));
        snapshot.forEach((doc)=>{
            setCategoryList(categoryList=>[...categoryList,doc.data()])
        })
    
    };
    console.log(selectedCategory)

    return (
        <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: 'outfit-medium', fontSize: 20 }}>Category</Text>

            <FlatList
                data={categoryList}
                numColumns={4}
                keyExtractor={(item) => item.id} // Đảm bảo key là duy nhất
                extraData={selectedCategory} // Đảm bảo FlatList nhận biết khi selectedCategory thay đổi
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedCategory(item.name)
                            category(item.name)
                        }} // Cập nhật danh mục khi người dùng chọn
                        style={{ flex: 1 }}
                    >
                        <View style={[
                            styles.container,
                            selectedCategory == item.name ? styles.selectedCategoryContainer : null // So sánh với danh mục được chọn
                        ]}>
                            <Image
                                source={{ uri: item?.imageUrl }}
                                style={{
                                    width: 40,
                                    height: 40,
                                }}
                            />
                        </View>
                        <Text style={{
                            textAlign: 'center',
                            fontFamily: 'outfit'
                        }}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.LIGHT_PRIMARY, // Màu nền mặc định
        padding: 10,
        alignItems: 'center',
        borderWidth: 3,
        borderRadius: 15,
        borderColor: Colors.PRIMARY, // Màu viền mặc định
        margin: 5,
    },
    selectedCategoryContainer: {
      //  backgroundColor: Colors.SECONDARY, // Màu nền cho danh mục được chọn
        borderColor: Colors.SECONDARY, // Màu viền cho danh mục được chọn
    },
});