import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useBooking from '../../hooks/useBooking';
import TimeSlot from '../../components/time-slot';

const Schedule: React.FC = () => {
  const { availableSlots, bookAppointment, selectedSlot, setSelectedSlot } = useBooking();
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleSelectSlot = (slot: any) => {
    setSelectedSlot(slot);
  };

  const handleConfirmBooking = async () => {
    if (selectedSlot) {
      const success = await bookAppointment(selectedSlot);
      if (success) {
        setBookingConfirmed(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      {bookingConfirmed ? (
        <View>
          <Text>予約が完了しました！</Text>
          {/* 予約詳細を表示 */}
        </View>
      ) : (
        <View>
          <Text style={styles.title}>予約可能な時間</Text>
          {availableSlots.map((slot) => (
            <TimeSlot
              key={slot.id}
              slot={slot}
              onSelect={handleSelectSlot}
              isSelected={selectedSlot && selectedSlot.id === slot.id}
            />
          ))}
          {selectedSlot && (
            <View>
              <Text>選択した時間: {selectedSlot.time}</Text>
              <Button title="予約を確定する" onPress={handleConfirmBooking} />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Schedule;