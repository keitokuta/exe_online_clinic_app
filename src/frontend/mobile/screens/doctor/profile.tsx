// src/frontend/screens/doctor/profile.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useDoctorProfile } from '../../hooks/useDoctorProfile';
import { AvailabilityCalendar } from '../../components/availability-calendar';

interface DoctorProfileScreenProps {
  doctorId: string; // 仮のdoctorId
}

export const DoctorProfileScreen: React.FC<DoctorProfileScreenProps> = ({ doctorId }) => {
  const { doctor, loading, error } = useDoctorProfile(doctorId);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  useEffect(() => {
    // 仮の利用可能な時間データ
    if (selectedDate) {
      setAvailableTimes(['09:00', '10:00', '11:00', '14:00', '15:00']);
    } else {
      setAvailableTimes([]);
    }
  }, [selectedDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!doctor) {
    return <Text>Doctor not found.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{doctor.name}</Text>
      <Text style={styles.specialty}>{doctor.specialty}</Text>
      <Text style={styles.bio}>{doctor.bio}</Text>

      <View style={styles.calendarContainer}>
        <Text style={styles.sectionTitle}>Availability Calendar</Text>
        <AvailabilityCalendar onDateSelect={handleDateSelect} />
      </View>

      <View style={styles.timesContainer}>
        <Text style={styles.sectionTitle}>Available Times</Text>
        {selectedDate ? (
          availableTimes.length > 0 ? (
            availableTimes.map((time) => (
              <Text key={time} style={styles.timeSlot}>{time}</Text>
            ))
          ) : (
            <Text>No available times for this date.</Text>
          )
        ) : (
          <Text>Select a date to see available times.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  specialty: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    marginBottom: 20,
  },
  calendarContainer: {
    marginBottom: 20,
  },
  timesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeSlot: {
    fontSize: 16,
    padding: 10,
    backgroundColor: '#e0e0e0',
    marginBottom: 5,
    borderRadius: 5,
  },
});