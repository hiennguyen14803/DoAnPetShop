import { View, FlatList, Image, StyleSheet, Dimensions, Text } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from '../../config/FirebaseConfig';

const Slider = () => {
    const [sliderList, setSliderList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0); // State cho vị trí hiện tại của slider
    const flatListRef = useRef(null); // Ref để điều khiển FlatList

    useEffect(() => {
        GetSliders();
    }, []);

    useEffect(() => {
        if (sliderList.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === sliderList.length - 1 ? 0 : prevIndex + 1
                );
            }, 6000); // Chuyển slider mỗi 3 giây

            return () => clearInterval(interval); // Xóa interval khi component unmount
        }
    }, [sliderList]);

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                index: currentIndex,
                animated: true,
            });
        }
    }, [currentIndex]);

    const GetSliders = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'Sliders'));
            let slidersArray = [];

            snapshot.forEach((doc) => {
                slidersArray.push(doc.data());
            });

            setSliderList(slidersArray);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching sliders: ", error);
            setLoading(false);
        }
    };

    if (loading) {
        return <Text>Loading sliders...</Text>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef} // Đặt ref để điều khiển FlatList
                data={sliderList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View>
                        {item?.imageUrl ? (
                            <Image
                                source={{ uri: item.imageUrl }}
                                style={styles.sliderImage}
                            />
                        ) : (
                            <Text style={styles.errorText}>Image not available</Text>
                        )}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
    },
    sliderImage: {
        width: Dimensions.get('screen').width * 0.9,
        height: 170,
        borderRadius: 15,
        marginRight: 15,
    },
    errorText: {
        fontSize: 14,
        color: 'red',
        textAlign: 'center',
    },
});

export default Slider;
