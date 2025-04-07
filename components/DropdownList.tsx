import React from 'react';
import { View, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

interface DropdownListProps {
  // The list of strings you want to display
  enumList: string[];

  // Currently selected value from the list
  selectedValue: string;

  // Callback when a user selects a new value
  onSelect: (value: string) => void;

  // Optional placeholder text
  placeholder?: string;
}

export default function DropdownList({
  enumList,
  selectedValue,
  onSelect,
  placeholder = 'Select an option',
}: DropdownListProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <View style={styles.container}>
      <DropDownPicker
        // Convert string array -> { label, value }
        items={enumList.map((item) => ({
          label: item,
          value: item,
        }))}

        placeholder={placeholder}
        // The currently selected value (null if none)
        value={selectedValue || null}

        onChangeValue={(value) => {
          if (value !== null) {
            onSelect(value as string);
          }
        }}

        listMode="SCROLLVIEW"
        // Required props for DropDownPicker
        open={open}
        setOpen={setOpen}
        multiple={false}
        setValue={(callback) => {
          const newValue = callback(selectedValue);
          if (newValue !== null) {
            onSelect(newValue as string);
          }
        }}

        // Some basic styles
        containerStyle={{ height: 40 }}
        style={{ backgroundColor: '#fff' }}
        listItemContainerStyle={{ backgroundColor: '#fff' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    // Add border/padding if you want
  },
});
