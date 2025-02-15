// src/frontend/screens/doctor/search.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { useDoctorSearch } from '../../hooks/useDoctorSearch';
import { DoctorCard } from '../../components/doctor-card';

const DoctorSearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { doctors, searchDoctors } = useDoctorSearch();

  useEffect(() => {
    searchDoctors(searchTerm);
  }, [searchTerm]);

  const renderItem = ({ item }) => (
    <DoctorCard doctor={item} />
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search doctors..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <FlatList
        data={doctors}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default DoctorSearchScreen;