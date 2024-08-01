import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DiscountDetailScreen = ({ route }) => {
  const { discountId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chi tiết khuyến mãi</Text>
      <Text style={styles.text}>ID khuyến mãi: {discountId}</Text>
      {/* Thêm các thành phần khác để hiển thị thông tin khuyến mãi */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
});

export default DiscountDetailScreen;
