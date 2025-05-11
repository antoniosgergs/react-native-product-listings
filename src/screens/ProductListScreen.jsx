import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ProductCard from '../components/ProductCard';
import { useNavigation } from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';


const PRODUCT_DATA = [
  {
    _id: '0001',
    title: 'OnePlus 12',
    description:
      'The OnePlus 12 offers flagship-level performance powered by the latest Snapdragon chipset, a stunning AMOLED display with ultra-smooth refresh rates, and exceptional battery life. It balances premium design and affordability, making it an ideal choice for power users.',
    price: 1100,
    images: [
      {
        url: 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12-1.jpg',
      },
    ],
  },
  {
    _id: '0002',
    title: 'Xiaomi 13 Ultra',
    description:
      'The Xiaomi 13 Ultra is a photography powerhouse equipped with Leica-branded cameras and advanced imaging software.',
    price: 1000,
    images: [
      {
        url: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-13-ultra-1.jpg',
      },
    ],
  },
  {
    _id: '0003',
    title: 'Asus ROG Phone 7',
    description:
      'Built for gamers, the Asus ROG Phone 7 features an ultra-fast 165Hz display and advanced cooling systems.',
    price: 1300,
    images: [
      {
        url: 'https://fdn2.gsmarena.com/vv/pics/asus/asus-rog-phone-7-1.jpg',
      },
    ],
  },
  {
    _id: '0004',
    title: 'Sony Xperia 1 V',
    description:
      'Tailored for creators, the Sony Xperia 1 V boasts a 4K OLED display with professional-grade camera features.',
    price: 1400,
    images: [
      {
        url: 'https://fdn2.gsmarena.com/vv/pics/sony/sony-xperia-1-v-1.jpg',
      },
    ],
  },
  {
    _id: '0005',
    title: 'Nokia XR21',
    description:
      'Engineered for durability, the Nokia XR21 is a rugged smartphone with military-grade protection and water resistance.',
    price: 800,
    images: [
      {
        url: 'https://fdn2.gsmarena.com/vv/pics/nokia/nokia-xr21-1.jpg',
      },
    ],
  },
  {
    _id: '0006',
    title: 'Realme GT 5 Pro',
    description:
      'The Realme GT 5 Pro offers flagship performance at a fraction of the price with a bright AMOLED display.',
    price: 950,
    images: [
      {
        url: 'https://fdn2.gsmarena.com/vv/pics/realme/realme-gt5-pro-1.jpg',
      },
    ],
  },
  {
    _id: '0007',
    title: 'Honor Magic6 Pro',
    description:
      'The Honor Magic6 Pro features a curved display, AI features, and a luxurious design.',
    price: 1250,
    images: [
      {
        url: 'https://fdn2.gsmarena.com/vv/pics/honor/honor-magic6-pro-1.jpg',
      },
    ],
  },
  {
    _id: '0008',
    title: 'iPhone 15 Pro Max',
    description:
      "The iPhone 15 Pro Max features a premium titanium design, A17 Pro chip, and ProMotion display — Apple's best yet.",
    price: 1600,
    images: [
      {
        url: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-max-1.jpg',
      },
    ],
  },
  {
    _id: '0009',
    title: 'Motorola Edge 40 Pro',
    description:
      'The Motorola Edge 40 Pro has a curved OLED display, fast wireless charging, and a near-stock Android experience.',
    price: 899,
    images: [
      {
        url: 'https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge-40-pro-1.jpg',
      },
    ],
  },
];

export default function ProductListScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header,
        {
          color: colors.text,
        }]
      }>
        Catalog
      </Text>
        <FlatList
          style={[styles.container, { backgroundColor: colors.background }]}
          data={PRODUCT_DATA}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
             onPress={() =>  navigation.navigate('ProductDetails',
               {
                 product: item,
               }
             )}
            />
          )}
          showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },

});
