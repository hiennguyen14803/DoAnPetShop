import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import Category from './Category';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { FlatList } from 'react-native';
import PetListItem from './PetListItem';

export default function PetListByCategory() {
    const [petList, setPetList] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        GetPetList('Dogs'); // Thay thế 'Dogs' bằng giá trị mặc định nếu cần
    }, []);

    const GetPetList = async (category) => {
        setLoader(true)
        console.log('Fetching pets for category:', category); // Debugging
        setPetList([]); // Reset danh sách trước khi gọi
        const q = query(collection(db, 'Pets'), where('category', '==', category));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(doc => {
            setPetList(petList => [...petList, doc.data()]); // Cập nhật danh sách thú cưng
        });
        setLoader(false);
    };

    return (
        <View>
            <Category category={(value) => {
                console.log('Selected Category:', value); // Debugging
                GetPetList(value); // Gọi hàm với category đã chọn
            }} />
           
            <FlatList
                data={petList}
                style={{ marginTop: 10 }}
                horizontal={true}
                refreshing={loader}
                onRefresh={()=>GetPetList('Dogs')}
                renderItem={({ item }) => 
                <PetListItem pet={item} />}
            />
        </View>
    );
}
